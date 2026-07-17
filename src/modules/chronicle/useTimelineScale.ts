import { useEffect, useMemo, useRef } from 'react';
import { useMotionValue, type MotionValue } from 'framer-motion';
import { eras } from '@/data/timeline/eras';
import type { Year } from '@/data/timeline/types';

const JUMP_DURATION_MS = 450;

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(Math.max(n, lo), hi);
}

// Cubic ease-out — a close visual match for the project's [0.22,1,0.36,1]
// curve, without pulling in a bezier solver for a hand-rolled rAF tween.
function easeOutSoft(t: number): number {
  return 1 - (1 - t) ** 3;
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ============================================
// Piecewise-linear year <-> world-px <-> screen-px scale (spec §3).
//
// World coordinates are fixed per viewport width (eras never move).
// zoomMV/panXMV are framer-motion MotionValues: gesture handlers .set()
// them directly (no React re-render per frame — components bind their
// position to these via useTransform, which writes to the DOM outside
// React's render cycle). Callers needing LOD/virtualization/collision
// should read a throttled snapshot instead of subscribing per-frame.
// ============================================

export function useTimelineScale(
  viewportWidthPx: number,
  initialView?: { zoom: number; panX: number } | null,
  /** Whether `initialView` reflects the real persisted value yet (false
   *  while zustand/persist is still hydrating from localStorage) — until
   *  then we don't know if there's a saved viewport to restore. */
  initialViewReady = true
) {
  const { eraOffsetPx, eraSpanPx, worldWidth } = useMemo(() => {
    const weightedYears = eras.reduce((sum, e) => sum + e.weight * (e.end - e.start), 0);
    // K normalizes total world width at zoom=1 to ~3x the viewport.
    const targetWidth = Math.max(viewportWidthPx, 1) * 3;
    const K = weightedYears > 0 ? targetWidth / weightedYears : 1;

    const spans = eras.map((e) => e.weight * (e.end - e.start) * K);
    const offsets: number[] = [];
    let acc = 0;
    for (const span of spans) {
      offsets.push(acc);
      acc += span;
    }
    return { eraOffsetPx: offsets, eraSpanPx: spans, worldWidth: acc };
  }, [viewportWidthPx]);

  // Eras are ordered, contiguous, and few (7) — linear scan is plenty.
  function eraIndexForYear(y: Year): number {
    for (let i = 0; i < eras.length; i++) {
      if (y <= eras[i].end || i === eras.length - 1) return i;
    }
    return eras.length - 1;
  }

  function yearToWorld(y: Year): number {
    const i = eraIndexForYear(y);
    const era = eras[i];
    const span = era.end - era.start;
    const t = span === 0 ? 0 : (y - era.start) / span;
    return eraOffsetPx[i] + t * eraSpanPx[i];
  }

  function worldToYear(px: number): Year {
    let i = 0;
    while (i < eras.length - 1 && px >= eraOffsetPx[i] + eraSpanPx[i]) i++;
    const era = eras[i];
    const t = eraSpanPx[i] === 0 ? 0 : (px - eraOffsetPx[i]) / eraSpanPx[i];
    return era.start + t * (era.end - era.start);
  }

  // minZoom: whole range fits the viewport. maxZoom: densest era shows ~1yr/80px.
  const minZoom = viewportWidthPx > 0 ? viewportWidthPx / worldWidth : 1;
  const maxZoom = useMemo(() => {
    const densestPxPerYear = Math.max(
      ...eras.map((e, i) => eraSpanPx[i] / Math.max(e.end - e.start, 1))
    );
    return densestPxPerYear > 0 ? 80 / densestPxPerYear : minZoom;
  }, [eraSpanPx, minZoom]);

  const zoomMV = useMotionValue(minZoom);
  const panXMV = useMotionValue(0);

  function clampPanValue(panX: number, zoom: number): number {
    const maxPan = Math.max(0, worldWidth * zoom - viewportWidthPx);
    return clamp(panX, 0, maxPan);
  }

  // Restore a persisted viewport (clamped, in case the window size changed
  // since it was saved) the first time we get a real measured width;
  // otherwise fit-all. On later resizes, just keep the existing view
  // within the (possibly new) bounds.
  const hasInitialized = useRef(false);
  useEffect(() => {
    if (viewportWidthPx <= 0 || !initialViewReady) return;
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      const z = initialView ? clamp(initialView.zoom, minZoom, maxZoom) : minZoom;
      zoomMV.set(z);
      panXMV.set(initialView ? clampPanValue(initialView.panX, z) : 0);
      return;
    }
    const z = clamp(zoomMV.get(), minZoom, maxZoom);
    if (z !== zoomMV.get()) zoomMV.set(z);
    panXMV.set(clampPanValue(panXMV.get(), z));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewportWidthPx, minZoom, maxZoom, initialViewReady]);

  function screenToWorld(screenX: number, zoom: number, panX: number): number {
    return (screenX + panX) / zoom;
  }

  /** Cursor-anchored zoom: the year under `screenX` stays fixed. */
  function zoomAtScreenX(screenX: number, factor: number) {
    const z0 = zoomMV.get();
    const worldAtCursor = screenToWorld(screenX, z0, panXMV.get());
    const z1 = clamp(z0 * factor, minZoom, maxZoom);
    zoomMV.set(z1);
    panXMV.set(clampPanValue(worldAtCursor * z1 - screenX, z1));
  }

  function panBy(deltaPx: number) {
    panXMV.set(clampPanValue(panXMV.get() + deltaPx, zoomMV.get()));
  }

  // Runs at most one jump tween at a time; a new call should replace, not
  // stack on top of, one still in flight.
  const activeJump = useRef<number | null>(null);
  useEffect(() => {
    return () => {
      if (activeJump.current !== null) cancelAnimationFrame(activeJump.current);
    };
  }, []);

  /** Eased jump for programmatic moves (minimap click, fit-era, keyboard Home). */
  function animateTo(target: { zoom?: number; panX?: number }) {
    if (activeJump.current !== null) cancelAnimationFrame(activeJump.current);

    const z1 = target.zoom !== undefined ? clamp(target.zoom, minZoom, maxZoom) : zoomMV.get();
    const p1 = target.panX !== undefined ? clampPanValue(target.panX, z1) : panXMV.get();
    if (prefersReducedMotion()) {
      zoomMV.set(z1);
      panXMV.set(p1);
      return;
    }

    const z0 = zoomMV.get();
    const p0 = panXMV.get();
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / JUMP_DURATION_MS, 1);
      const e = easeOutSoft(t);
      zoomMV.set(z0 + (z1 - z0) * e);
      panXMV.set(clampPanValue(p0 + (p1 - p0) * e, z0 + (z1 - z0) * e));
      activeJump.current = t < 1 ? requestAnimationFrame(tick) : null;
    };
    activeJump.current = requestAnimationFrame(tick);
  }

  function fitAll() {
    animateTo({ zoom: minZoom, panX: 0 });
  }

  /** Zoom/pan so [startYear, endYear] fills ~60% of the viewport, centered —
   *  used by cluster-chip clicks and (later) minimap/search jumps. */
  function zoomToYearRange(startYear: Year, endYear: Year, marginFactor = 0.6) {
    const worldStart = yearToWorld(startYear);
    const worldEnd = yearToWorld(endYear);
    const span = Math.max(worldEnd - worldStart, 1);
    const targetZoom = clamp((viewportWidthPx * marginFactor) / span, minZoom, maxZoom);
    const centerWorld = (worldStart + worldEnd) / 2;
    animateTo({ zoom: targetZoom, panX: centerWorld * targetZoom - viewportWidthPx / 2 });
  }

  return {
    worldWidth,
    minZoom,
    maxZoom,
    zoomMV,
    panXMV,
    yearToWorld,
    worldToYear,
    screenToWorld,
    zoomAtScreenX,
    panBy,
    animateTo,
    fitAll,
    zoomToYearRange,
  };
}

export type TimelineScale = ReturnType<typeof useTimelineScale>;

/** A MotionValue tracking `worldX * zoom - panX` — bind directly to a CSS
 *  style prop (e.g. `style={{ left }}`) for 60fps position updates with no
 *  React re-render. `worldX` must be a stable number (not itself reactive). */
export function useScreenX(worldX: number, zoomMV: MotionValue<number>, panXMV: MotionValue<number>) {
  return useCombinedTransform(zoomMV, panXMV, (z, p) => worldX * z - p);
}

/** A MotionValue tracking `worldSpan * zoom` — for bar widths (period/era bands). */
export function useScreenWidth(worldSpan: number, zoomMV: MotionValue<number>) {
  return useTransformSingle(zoomMV, (z) => worldSpan * z);
}

// Small local helpers so EntryNode/TimeAxis don't each import framer-motion's
// useTransform combinator boilerplate directly.
import { useTransform } from 'framer-motion';

function useCombinedTransform(
  a: MotionValue<number>,
  b: MotionValue<number>,
  combine: (a: number, b: number) => number
) {
  return useTransform([a, b], ([av, bv]: number[]) => combine(av, bv));
}

function useTransformSingle(a: MotionValue<number>, fn: (a: number) => number) {
  return useTransform(a, fn);
}
