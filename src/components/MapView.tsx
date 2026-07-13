import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, ImageOverlay, useMap, useMapEvents, CircleMarker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import type { Chapter, Layer } from '@/types';
import type { FeatureCollection } from 'geojson';
import { basemaps, DEFAULT_BASEMAP } from '@/lib/basemaps';
import { injectPatterns, PATTERN_IDS } from '@/lib/patterns';
import { useGeoJSON } from '@/hooks/useGeoJSON';

interface MapViewProps {
  chapter: Chapter;
  activeLayerIds: string[];
  /** Base layers rendered beneath chapter layers (e.g. state boundaries). */
  baseLayers?: Layer[];
  view?: { center: [number, number]; zoom: number };
  onMapClick?: (latlng: { lat: number; lng: number }) => void;
  clickMarker?: { lat: number; lng: number } | null;
  answerMarker?: { lat: number; lng: number; toleranceKm: number } | null;
  onMapMouseMove?: (latlng: { lat: number; lng: number }) => void;
  /** Slot for author-mode shapes (must be inside MapContainer). */
  authorLayer?: React.ReactNode;
  /** Global basemap override from the top bar ("picture map" switcher). */
  basemapOverride?: string | null;
}

function ViewController({ view }: { view: { center: [number, number]; zoom: number } }) {
  const map = useMap();
  useEffect(() => {
    // Skip if we're already (nearly) at the target — avoids jitter on re-renders.
    const c = map.getCenter();
    if (
      Math.abs(c.lat - view.center[0]) < 1e-4 &&
      Math.abs(c.lng - view.center[1]) < 1e-4 &&
      Math.abs(map.getZoom() - view.zoom) < 0.01
    ) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      map.setView(view.center, view.zoom, { animate: false });
      return;
    }
    // Longer glide + gentler easing = noticeably smoother chapter transitions.
    map.flyTo(view.center, view.zoom, { duration: 1.9, easeLinearity: 0.08 });
  }, [view.center[0], view.center[1], view.zoom, map]);
  return null;
}

function ClickHandler({ onMapClick, onMapMouseMove }: { onMapClick?: (ll: { lat: number; lng: number }) => void; onMapMouseMove?: (ll: { lat: number; lng: number }) => void }) {
  useMapEvents({
    click(e) {
      if (onMapClick) onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
    mousemove(e) {
      if (onMapMouseMove) onMapMouseMove({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

/** Inject SVG patterns into Leaflet's renderer once the map mounts. */
function PatternInjector({ accentColor }: { accentColor: string }) {
  const map = useMap();
  useEffect(() => {
    // Leaflet creates an SVG element for the renderer. Find it.
    const container = map.getPanes().overlayPane;
    const svg = container.querySelector('svg') as SVGSVGElement | null;
    if (svg) injectPatterns(svg, accentColor);
    // Also try again after a tick — sometimes the SVG isn't there immediately
    const t = setTimeout(() => {
      const svg2 = container.querySelector('svg') as SVGSVGElement | null;
      if (svg2) injectPatterns(svg2, accentColor);
    }, 100);
    return () => clearTimeout(t);
  }, [map, accentColor]);
  return null;
}

function LayerRenderer({ layer }: { layer: Layer }) {
  if (layer.kind === 'raster') {
    return (
      <ImageOverlay
        url={layer.url}
        bounds={layer.bounds}
        opacity={layer.opacity ?? 0.7}
      />
    );
  }

  // Vector layer — data may be inline FeatureCollection or a URL string
  const isUrl = typeof layer.data === 'string';
  const inline = isUrl ? null : (layer.data as FeatureCollection);
  const fetched = useGeoJSON(isUrl ? (layer.data as string) : null);
  const data = inline ?? fetched;
  if (!data) return null;

  const style = (feature: any) => {
    const featColor = feature?.properties?.color;
    const baseColor = featColor || layer.style?.color || '#3a7a7a';

    // Pattern fill takes priority over solid fillColor
    const fillColor = layer.style?.pattern
      ? `url(#${PATTERN_IDS[layer.style.pattern]})`
      : featColor || layer.style?.fillColor || baseColor;

    const classes: string[] = [];
    if (layer.style?.flow) classes.push('flow-line');
    if (layer.style?.glow) classes.push('glow-path');

    return {
      color: baseColor,
      weight: layer.style?.weight ?? 2,
      fillColor,
      fillOpacity: layer.style?.pattern ? 1 : (layer.style?.fillOpacity ?? 0.25),
      // Flow lines need a dash pattern to animate; provide a soft default.
      dashArray: layer.style?.dashArray ?? (layer.style?.flow ? '1 9' : undefined),
      lineCap: 'round' as const,
      lineJoin: 'round' as const,
      className: classes.join(' ') || undefined,
    };
  };

  const pointToLayer = (feature: any, latlng: L.LatLng) => {
    const name = layer.labelKey ? feature.properties?.[layer.labelKey] : undefined;
    const color = feature.properties?.color || layer.style?.color || '#22221f';

    // Two-circle marker — ring + dot — looks more cartographic than flat circles
    const marker = L.circleMarker(latlng, {
      radius: layer.style?.markerRadius ?? 6,
      color: 'rgba(20, 18, 14, 0.85)',
      weight: 2,
      fillColor: color === '#22221f' ? '#fbf8f3' : color,
      fillOpacity: 1,
      className: `study-map-marker marker-pop${layer.style?.glow ? ' glow-path' : ''}`,
    });
    if (name) marker.bindTooltip(name, { permanent: false, direction: 'top', offset: [0, -6], className: 'feature-tooltip' });
    return marker;
  };

  const onEachFeature = (feature: any, lyr: L.Layer) => {
    const name = layer.labelKey ? feature.properties?.[layer.labelKey] : undefined;
    if (name && feature.geometry.type !== 'Point') {
      lyr.bindTooltip(name, { sticky: true, className: 'feature-tooltip' });
    }

    // Hover interactivity for polygons and lines — intensify the feature
    if (feature.geometry.type !== 'Point') {
      lyr.on({
        mouseover: (e) => {
          const target = e.target as L.Path;
          target.setStyle({
            weight: (layer.style?.weight ?? 2) + 1,
            fillOpacity: Math.min(1, (layer.style?.fillOpacity ?? 0.25) + 0.2),
          });
          // Apply shadow filter if enabled
          if (layer.style?.shadow) {
            const el = (target as any)._path;
            if (el) el.setAttribute('filter', 'url(#study-map-shadow)');
          }
        },
        mouseout: (e) => {
          const target = e.target as L.Path;
          target.setStyle({
            weight: layer.style?.weight ?? 2,
            fillOpacity: layer.style?.pattern ? 1 : (layer.style?.fillOpacity ?? 0.25),
          });
          if (layer.style?.shadow) {
            const el = (target as any)._path;
            if (el) el.removeAttribute('filter');
          }
        },
      });

      // Apply persistent shadow if enabled
      if (layer.style?.shadow) {
        setTimeout(() => {
          const el = (lyr as any)._path;
          if (el) el.setAttribute('filter', 'url(#study-map-shadow)');
        }, 50);
      }
    }
  };

  return (
    <GeoJSON
      key={layer.id}
      data={data}
      style={style as any}
      pointToLayer={pointToLayer}
      onEachFeature={onEachFeature}
    />
  );
}

export function MapView({ chapter, activeLayerIds, baseLayers = [], view, onMapClick, clickMarker, answerMarker, onMapMouseMove, authorLayer, basemapOverride }: MapViewProps) {
  const activeLayers = useMemo(
    () => chapter.layers.filter((l) => activeLayerIds.includes(l.id)),
    [chapter.layers, activeLayerIds]
  );

  const currentView = view ?? chapter.view;
  const basemap =
    (basemapOverride ? basemaps[basemapOverride] : undefined) ??
    basemaps[chapter.basemap ?? DEFAULT_BASEMAP] ??
    basemaps[DEFAULT_BASEMAP];
  const toleranceDeg = answerMarker ? answerMarker.toleranceKm / 111 : 0;

  // World chapters roam the globe; India chapters stay framed on the subcontinent.
  const world = chapter.worldExtent === true;
  const bounds: [[number, number], [number, number]] = world ? [[-75, -180], [82, 195]] : [[5, 65], [40, 100]];

  // Re-key the MapContainer when basemap or extent changes so it remounts cleanly.
  return (
    <div className="relative h-full w-full map-frame">
    <MapContainer
      key={`${basemap.id}-${world ? 'w' : 'in'}`}
      center={chapter.view.center}
      zoom={chapter.view.zoom}
      minZoom={world ? 2 : 4}
      maxZoom={basemap.maxZoom ?? 12}
      maxBounds={bounds}
      maxBoundsViscosity={0.8}
      worldCopyJump={world}
      zoomSnap={0.25}
      zoomDelta={0.5}
      wheelPxPerZoomLevel={120}
      zoomAnimationThreshold={8}
      className="h-full w-full"
      zoomControl={true}
    >
      <TileLayer
        attribution={basemap.attribution}
        url={basemap.url}
        {...(basemap.subdomains ? { subdomains: basemap.subdomains } : {})}
        maxZoom={basemap.maxZoom ?? 18}
      />

      <ViewController view={currentView} />
      <ClickHandler onMapClick={onMapClick} onMapMouseMove={onMapMouseMove} />
      <PatternInjector accentColor={getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#3a7a7a'} />

      {/* Base layers — administrative reference, render below chapter content */}
      {baseLayers.map((layer) => (
        <LayerRenderer key={`base-${layer.id}`} layer={layer} />
      ))}

      {activeLayers.map((layer) => (
        <LayerRenderer key={layer.id} layer={layer} />
      ))}

      {clickMarker && (
        <CircleMarker
          center={[clickMarker.lat, clickMarker.lng]}
          radius={9}
          pathOptions={{ color: '#1a1a17', fillColor: '#c46a3d', fillOpacity: 0.9, weight: 2.5 }}
        >
          <Tooltip permanent direction="top" offset={[0, -9]}>Your answer</Tooltip>
        </CircleMarker>
      )}

      {answerMarker && (
        <>
          <CircleMarker
            center={[answerMarker.lat, answerMarker.lng]}
            radius={9}
            pathOptions={{ color: '#1a1a17', fillColor: '#3a7a7a', fillOpacity: 0.9, weight: 2.5 }}
          >
            <Tooltip permanent direction="top" offset={[0, -9]}>Correct location</Tooltip>
          </CircleMarker>
          <CircleMarker
            center={[answerMarker.lat, answerMarker.lng]}
            radius={Math.max(20, toleranceDeg * 20)}
            pathOptions={{ color: '#3a7a7a', fillColor: '#3a7a7a', fillOpacity: 0.08, weight: 1, dashArray: '4 4' }}
            interactive={false}
          />
        </>
      )}

      {authorLayer}
    </MapContainer>
    {/* Atlas-plate finish: paper grain + soft vignette. Pure decoration, no pointer events. */}
    <div className="map-grain" aria-hidden="true" />
    <div className="map-vignette" aria-hidden="true" />
    </div>
  );
}
