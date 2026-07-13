// ============================================
// Basemaps — free tile sources.
// Chapter picks a basemap by id; adding new
// ones means adding an entry here.
// ============================================

export interface Basemap {
  id: string;
  name: string;
  description: string;
  url: string;
  attribution: string;
  /** Subdomains, only if URL contains {s}. */
  subdomains?: string;
  /** Max zoom this source supports. */
  maxZoom?: number;
}

export const basemaps: Record<string, Basemap> = {
  watercolor: {
    id: 'watercolor',
    name: 'Watercolor',
    description: 'Hand-painted picture-map look \u2014 the atlas-plate feel. Best with bold vector layers.',
    url: 'https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg',
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://stamen.com/">Stamen Design</a> &copy; OpenStreetMap',
    maxZoom: 14,
  },
  imagery: {
    id: 'imagery',
    name: 'Satellite',
    description: 'True-color satellite imagery \u2014 real GIS texture for terrain study.',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri \u2014 Source: Esri, Maxar, Earthstar Geographics',
    maxZoom: 17,
  },
  relief: {
    id: 'relief',
    name: 'Shaded Relief',
    description: 'Pure landform shading, no labels \u2014 the terrain speaks for itself.',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
    maxZoom: 13,
  },
  topo: {
    id: 'topo',
    name: 'Topographic',
    description: 'Full topo map \u2014 mountains, rivers, roads, state borders, place names. Good general default.',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri \u2014 Esri, DeLorme, NAVTEQ, TomTom, Intermap, GEBCO',
    maxZoom: 18,
  },
  physical: {
    id: 'physical',
    name: 'Physical Atlas',
    description: 'Hillshading, rivers, biomes, country borders \u2014 textbook physical map look.',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri \u2014 US National Park Service',
    maxZoom: 8,
  },
  natgeo: {
    id: 'natgeo',
    name: 'National Geographic',
    description: 'Warm-toned, richly labeled, atlas-style. Excellent for historical chapters.',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri \u2014 National Geographic, Esri, DeLorme, NAVTEQ',
    maxZoom: 12,
  },
  opentopo: {
    id: 'opentopo',
    name: 'OpenTopoMap',
    description: 'Strong terrain with contour lines \u2014 great for understanding relief.',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    subdomains: 'abc',
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, SRTM | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
    maxZoom: 17,
  },
  voyager: {
    id: 'voyager',
    name: 'Voyager',
    description: 'Soft, modern, lightly labeled. Good general-purpose modern look.',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    subdomains: 'abcd',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19,
  },
  clean: {
    id: 'clean',
    name: 'Clean',
    description: 'Minimal, label-free. Best when vector layers carry all the meaning.',
    url: 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
    subdomains: 'abcd',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19,
  },
  // Kept for backward compatibility (old chapters reference 'terrain' / 'paper')
  terrain: {
    id: 'terrain',
    name: 'Terrain (legacy)',
    description: 'Older alias \u2014 same as Topographic.',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
    maxZoom: 18,
  },
  paper: {
    id: 'paper',
    name: 'Paper (legacy)',
    description: 'Older alias \u2014 same as National Geographic.',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
    maxZoom: 12,
  },
};

export const DEFAULT_BASEMAP = 'topo';
