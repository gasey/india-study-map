import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValueEvent, type MotionValue } from 'framer-motion';
import { useApp, useHasHydrated } from '@/lib/store';
import { useTimelineScale, useScreenX } from './useTimelineScale';
import type { TimelineRenderEntry } from './useTimelineData';
import { TRACKS, type TrackId, type Year, type Importance } from '@/data/timeline/types';
import { eras } from '@/data/timeline/eras';
import { EntryNode, type LodLevel } from './EntryNode';
import { TimeAxis } from './TimeAxis';
import { MiniMap } from './MiniMap';
import type { BankQuestion } from '@/data/banks/types';

// Semantic zoom (spec §4.2): what LOD level shows depends on *local*
// px/year at the viewport center, not the raw zoom number, so the sparse
// ancient era naturally reveals more of its few entries sooner.
function lodFor(pxPerYearLocal: number): { level: LodLevel; importanceCeiling: Importance } {
  if (pxPerYearLocal < 0.15) return { level: 'L0', importanceCeiling: 1 };
  if (pxPerYearLocal < 1) return { level: 'L1', importanceCeiling: 2 };
  if (pxPerYearLocal < 8) return { level: 'L2', importanceCeiling: 3 };
  if (pxPerYearLocal < 40) return { level: 'L3', importanceCeiling: 4 };
  return { level: 'L4', importanceCeiling: 5 };
}

function eraIdForYear(year: Year): string {
  for (const era of eras) {
    if (year <= era.end) return era.id;
  }
  return eras[eras.length - 1]?.id ?? '';
}

// Mid-L3 (spec's LOD table: L3 = 8-40 px/yr local) — a jump should land
// somewhere you can read individual years, not the fully-zoomed-out view.
const JUMP_TARGET_PX_PER_YEAR = 15;

const RENDER_THROTTLE_MS = 100; // ~10Hz, per spec §3 "Smoothness"
const WHEEL_ZOOM_SENSITIVITY = 0.0018;
const STEP_ZOOM_FACTOR = 1.5;
const KEY_PAN_STEP = 80;

// --- Collision handling (spec §4.3): sweep left->right per lane, bump
// overlapping labels into sub-rows, collapse whatever still collides into
// a cluster chip. Widths are estimated (character count), not measured —
// "simple, deterministic, no force layout" per spec, not pixel-perfect.
const MIN_GAP_PX = 8;
const CLUSTER_CHIP_WIDTH_PX = 44;

/** How many stacked sub-rows a lane offers at each zoom level. More rows at
 *  higher LOD = more of the (now much denser) content visible at once. */
function laneMaxRows(lodLevel: LodLevel): number {
  if (lodLevel === 'L4' || lodLevel === 'L3') return 5;
  if (lodLevel === 'L2') return 4;
  if (lodLevel === 'L1') return 3;
  return 2;
}

function estimateLabelWidth(item: TimelineRenderEntry, lodLevel: LodLevel): number {
  const marker = item.entry.kind === 'event' ? 20 : 28;
  let textLen = item.entry.title.length + 2; // leading kind glyph
  // " · <year>" (or "· start–end") suffix, shown from L2 up
  if (lodLevel === 'L2' || lodLevel === 'L3' || lodLevel === 'L4') {
    textLen += item.entry.endYear !== undefined ? 16 : 10;
  }
  if (item.questions.length > 0) textLen += 5; // "Q<N>" pill
  return marker + textLen * 6.6 + 14;
}

function itemStartX(item: TimelineRenderEntry, rv: { zoom: number; panX: number }, y2w: (y: Year) => number): number {
  return y2w(item.entry.year) * rv.zoom - rv.panX;
}

/** Horizontal space an item actually occupies. A period/person's bar can be
 *  far wider than its label — reserving only the label width (the old bug) let
 *  events that fall *inside* a period render right on top of its bar. We now
 *  reserve the full bar extent, so the row sweep bumps them clear. */
function itemFootprint(
  item: TimelineRenderEntry,
  lodLevel: LodLevel,
  rv: { zoom: number; panX: number },
  y2w: (y: Year) => number
): number {
  const label = estimateLabelWidth(item, lodLevel);
  if (item.entry.endYear !== undefined) {
    const barW = (y2w(item.entry.endYear) - y2w(item.entry.year)) * rv.zoom;
    return Math.max(barW, label);
  }
  return label;
}

interface LaneNode {
  row: number;
  entries: TimelineRenderEntry[];
  anchorYear: Year;
}

function layoutLane(
  items: TimelineRenderEntry[],
  lodLevel: LodLevel,
  renderView: { zoom: number; panX: number },
  yearToWorld: (y: Year) => number
): LaneNode[] {
  const maxRows = laneMaxRows(lodLevel);
  const rowEdge: number[] = new Array(maxRows).fill(-Infinity);
  const rowNode: (LaneNode | null)[] = new Array(maxRows).fill(null);
  const nodes: LaneNode[] = [];

  // Left-to-right sweep — sort so the greedy row packing is deterministic
  // regardless of the source array order.
  const sorted = [...items].sort((a, b) => a.entry.year - b.entry.year);

  for (const item of sorted) {
    const x = itemStartX(item, renderView, yearToWorld);
    const foot = itemFootprint(item, lodLevel, renderView, yearToWorld);
    const row = rowEdge.findIndex((edge) => x >= edge + MIN_GAP_PX);

    if (row !== -1) {
      const node: LaneNode = { row, entries: [item], anchorYear: item.entry.year };
      rowEdge[row] = x + foot;
      rowNode[row] = node;
      nodes.push(node);
    } else {
      // Collides on every row — merge into row 0's last node as a cluster.
      const target = rowNode[0];
      if (target) {
        target.entries.push(item);
      } else {
        const node: LaneNode = { row: 0, entries: [item], anchorYear: item.entry.year };
        nodes.push(node);
        rowNode[0] = node;
      }
      rowEdge[0] = x + CLUSTER_CHIP_WIDTH_PX;
    }
  }
  return nodes;
}

function rowTopPercent(row: number, maxRows: number): number {
  return ((row + 1) / (maxRows + 1)) * 100;
}

function ClusterChip({
  node,
  trackId,
  maxRows,
  zoomMV,
  panXMV,
  yearToWorld,
  onOpen,
}: {
  node: LaneNode;
  trackId: TrackId;
  maxRows: number;
  zoomMV: MotionValue<number>;
  panXMV: MotionValue<number>;
  yearToWorld: (y: Year) => number;
  onOpen: (startYear: Year, endYear: Year) => void;
}) {
  const years = node.entries.map((e) => e.entry.year);
  const startYear = Math.min(...years);
  const endYear = Math.max(...years);
  const left = useScreenX(yearToWorld(node.anchorYear), zoomMV, panXMV);
  const titles = node.entries.map((e) => e.entry.title).join(', ');

  return (
    <motion.button
      className={`${TRACKS[trackId].cssClass} absolute -translate-y-1/2 rounded-full text-[11px] px-2 py-0.5 hover:opacity-85 transition-opacity`}
      style={{
        left,
        top: `${rowTopPercent(node.row, maxRows)}%`,
        background: 'var(--bg-panel)',
        border: '1px solid var(--subject)',
        color: 'var(--subject)',
      }}
      title={`${node.entries.length} entries: ${titles} — click to zoom in`}
      onClick={(e) => { e.stopPropagation(); onOpen(startYear, endYear); }}
    >
      ⊕ {node.entries.length}
    </motion.button>
  );
}

function useMeasuredWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setWidth(el.clientWidth);
    const ro = new ResizeObserver((entries) => setWidth(entries[0].contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

function Lane({
  trackId,
  items,
  lodLevel,
  renderView,
  zoomMV,
  panXMV,
  yearToWorld,
  onOpenCluster,
  selectedEntryId,
  onSelectEntry,
  heat,
}: {
  trackId: TrackId;
  items: TimelineRenderEntry[];
  lodLevel: LodLevel;
  renderView: { zoom: number; panX: number };
  zoomMV: MotionValue<number>;
  panXMV: MotionValue<number>;
  yearToWorld: (y: Year) => number;
  onOpenCluster: (startYear: Year, endYear: Year) => void;
  selectedEntryId: string | null;
  onSelectEntry: (id: string | null) => void;
  heat: boolean;
}) {
  const maxRows = laneMaxRows(lodLevel);
  const nodes = useMemo(
    () => layoutLane(items, lodLevel, renderView, yearToWorld),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, lodLevel, renderView.zoom, renderView.panX]
  );

  return (
    <div
      className={`${TRACKS[trackId].cssClass} relative flex-1 min-h-0 border-b`}
      style={{
        borderColor: 'var(--border)',
        background: 'linear-gradient(180deg, color-mix(in srgb, var(--subject) 4%, transparent), transparent 70%)',
      }}
    >
      {nodes.map((node) =>
        node.entries.length === 1 ? (
          <EntryNode
            key={node.entries[0].entry.id}
            entry={node.entries[0].entry}
            questionCount={node.entries[0].questions.length}
            lodLevel={lodLevel}
            worldX={yearToWorld(node.entries[0].entry.year)}
            worldEndX={node.entries[0].entry.endYear !== undefined ? yearToWorld(node.entries[0].entry.endYear!) : undefined}
            zoomMV={zoomMV}
            panXMV={panXMV}
            topPercent={rowTopPercent(node.row, maxRows)}
            isSelected={node.entries[0].entry.id === selectedEntryId}
            onSelect={() => onSelectEntry(node.entries[0].entry.id)}
            heat={heat}
          />
        ) : (
          <ClusterChip
            key={node.entries[0].entry.id}
            node={node}
            trackId={trackId}
            maxRows={maxRows}
            zoomMV={zoomMV}
            panXMV={panXMV}
            yearToWorld={yearToWorld}
            onOpen={onOpenCluster}
          />
        )
      )}
    </div>
  );
}

/** Handle exposed upward so ChroniclePage's top bar/controls row (era
 *  pills, command palette, quiz button) can drive the canvas's zoom/pan
 *  without duplicating the scale math — only TimelineCanvas has the
 *  measured container the scale is computed from. */
export interface ChronicleScaleHandle {
  zoomToYearRange: (startYear: Year, endYear: Year, marginFactor?: number) => void;
  jumpToYearAtL3: (year: Year) => void;
  fitAll: () => void;
  getVisibleYearRange: () => { start: Year; end: Year };
}

/** Throttled (~10Hz) view snapshot for the top bar's live era readout and
 *  the controls row's active era pill. */
export interface ChronicleViewInfo {
  centerYear: Year;
  level: LodLevel;
  currentEraId: string;
}

interface TimelineCanvasProps {
  renderEntries: TimelineRenderEntry[];
  orphanQuestions: BankQuestion[];
  selectedEntryId: string | null;
  onSelectEntry: (id: string | null) => void;
  onScaleReady: (handle: ChronicleScaleHandle) => void;
  onViewChange: (info: ChronicleViewInfo) => void;
  /** False while Reading view covers the canvas — the canvas stays mounted
   *  (so its scale/zoom state and the ChronicleScaleHandle era pills depend
   *  on survive the switch) but its keyboard shortcuts should go quiet;
   *  pointer/wheel input is already blocked by the parent's pointer-events-none. */
  active: boolean;
}

/** Core renderer: history + polity lanes, era bands, entry nodes. Full
 *  gesture set (wheel/pinch/drag/keyboard) drives zoom/pan via motion
 *  values — see useTimelineScale. LOD level and the virtualization window
 *  are recomputed from a throttled (~10Hz + on gesture-end) snapshot, not
 *  every frame, so gesture smoothness never waits on React. */
export function TimelineCanvas({
  renderEntries,
  orphanQuestions,
  selectedEntryId,
  onSelectEntry,
  onScaleReady,
  onViewChange,
  active,
}: TimelineCanvasProps) {
  const savedViewport = useApp((s) => s.chronicle.viewport);
  const setChronicleViewport = useApp((s) => s.setChronicleViewport);
  const trackMode = useApp((s) => s.chronicle.trackMode);
  const userImportanceCeiling = useApp((s) => s.chronicle.importanceCeiling);
  const heat = useApp((s) => s.chronicle.lens === 'heat');
  const hasHydrated = useHasHydrated();
  const [containerRef, width] = useMeasuredWidth();
  const scale = useTimelineScale(width, savedViewport, hasHydrated);
  const { zoomMV, panXMV, minZoom, maxZoom, yearToWorld, worldToYear, zoomAtScreenX, panBy, fitAll, animateTo, zoomToYearRange } = scale;

  function jumpToYear(year: Year) {
    animateTo({ panX: yearToWorld(year) * zoomMV.get() - width / 2 });
  }

  /** Search/jump target: land at mid-L3 (spec §7), not just re-centered
   *  at whatever zoom happened to be active. */
  function jumpToYearAtL3(year: Year) {
    const localWorldPerYear = yearToWorld(year + 1) - yearToWorld(year);
    const rawZoom = localWorldPerYear > 0 ? JUMP_TARGET_PX_PER_YEAR / localWorldPerYear : minZoom;
    const targetZoom = Math.min(Math.max(rawZoom, minZoom), maxZoom);
    animateTo({ zoom: targetZoom, panX: yearToWorld(year) * targetZoom - width / 2 });
  }

  const [renderView, setRenderView] = useState(() => ({ zoom: zoomMV.get(), panX: panXMV.get() }));
  const lastFlush = useRef(0);
  const flushTimer = useRef<ReturnType<typeof setTimeout>>();

  // Persist the viewport, debounced so continuous gestures don't hammer
  // localStorage — only writes once the view has settled for a moment,
  // plus a final write on unmount (e.g. navigating to another module).
  // Guarded on `width > 0`: before the container's first real measurement,
  // zoom/panX are just the meaningless pre-measurement placeholder, and
  // StrictMode's dev-only mount->cleanup->remount would otherwise save
  // that placeholder over a real persisted value before restore ever runs.
  const persistTimer = useRef<ReturnType<typeof setTimeout>>();
  const latestRenderView = useRef(renderView);
  latestRenderView.current = renderView;
  const latestWidth = useRef(width);
  latestWidth.current = width;
  useEffect(() => {
    if (width <= 0) return;
    if (persistTimer.current) clearTimeout(persistTimer.current);
    persistTimer.current = setTimeout(() => {
      setChronicleViewport({ zoom: renderView.zoom, panX: renderView.panX });
    }, 500);
    return () => { if (persistTimer.current) clearTimeout(persistTimer.current); };
  }, [renderView.zoom, renderView.panX, setChronicleViewport, width]);
  useEffect(() => {
    return () => {
      if (latestWidth.current > 0) {
        setChronicleViewport({ zoom: latestRenderView.current.zoom, panX: latestRenderView.current.panX });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function flushNow() {
    lastFlush.current = performance.now();
    setRenderView({ zoom: zoomMV.get(), panX: panXMV.get() });
  }
  function scheduleFlush() {
    const now = performance.now();
    if (now - lastFlush.current >= RENDER_THROTTLE_MS) {
      flushNow();
    } else if (!flushTimer.current) {
      flushTimer.current = setTimeout(() => {
        flushTimer.current = undefined;
        flushNow();
      }, RENDER_THROTTLE_MS - (now - lastFlush.current));
    }
  }
  useMotionValueEvent(zoomMV, 'change', scheduleFlush);
  useMotionValueEvent(panXMV, 'change', scheduleFlush);
  useEffect(() => () => { if (flushTimer.current) clearTimeout(flushTimer.current); }, []);

  const { level, importanceCeiling: lodImportanceCeiling, centerYear } = useMemo(() => {
    if (width <= 0) return { level: 'L0' as LodLevel, importanceCeiling: 1 as Importance, centerYear: eras[0].start };
    const centerWorld = (width / 2 + renderView.panX) / renderView.zoom;
    const centerYear = worldToYear(centerWorld);
    const pxPerYearLocal = (yearToWorld(centerYear + 1) - yearToWorld(centerYear)) * renderView.zoom;
    return { ...lodFor(pxPerYearLocal), centerYear };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderView.zoom, renderView.panX, width]);

  // The importance ceiling only ever *lowers* the LOD-computed ceiling (spec §4.2) —
  // no toolbar exposes the user override since the v2 design, but the store field
  // (default 5, i.e. no-op) is kept for a future command-palette filter.
  const importanceCeiling = Math.min(lodImportanceCeiling, userImportanceCeiling) as Importance;

  // Bridges the canvas's internal scale/view-state up to ChroniclePage's top
  // bar/controls row — see ChronicleScaleHandle/ChronicleViewInfo above.
  useEffect(() => {
    onScaleReady({
      zoomToYearRange,
      jumpToYearAtL3,
      fitAll,
      getVisibleYearRange: () => ({
        start: worldToYear((0 + panXMV.get()) / zoomMV.get()),
        end: worldToYear((width + panXMV.get()) / zoomMV.get()),
      }),
    });
  });

  useEffect(() => {
    onViewChange({ centerYear, level, currentEraId: eraIdForYear(centerYear) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [centerYear, level]);

  // Virtualization: entries whose screen-x falls within viewport +/- 1 screen width.
  const visible = useMemo(() => {
    const lo = -width;
    const hi = width * 2;
    return renderEntries.filter((r) => {
      if (r.entry.importance > importanceCeiling) return false;
      const x = yearToWorld(r.entry.year) * renderView.zoom - renderView.panX;
      return x >= lo && x <= hi;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderEntries, importanceCeiling, renderView.zoom, renderView.panX, width]);

  const historyItems = visible.filter((r) => r.entry.track === 'history');
  const polityItems = visible.filter((r) => r.entry.track === 'polity');

  // --- Gestures ---
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchDist = useRef<number | null>(null);

  function onWheel(e: React.WheelEvent) {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    // Mouse wheel (vertical) or ctrl/⌘+wheel → zoom at the cursor.
    // A dominant horizontal delta (trackpad two-finger swipe) → pan.
    const horizontalSwipe = Math.abs(e.deltaX) > Math.abs(e.deltaY);
    if (horizontalSwipe && !e.ctrlKey) {
      panBy(e.deltaX);
    } else {
      zoomAtScreenX(e.clientX - rect.left, Math.exp(-e.deltaY * WHEEL_ZOOM_SENSITIVITY));
    }
  }

  function onPointerDown(e: React.PointerEvent) {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinchDist.current = Math.hypot(a.x - b.x, a.y - b.y);
    }
  }

  function onPointerMove(e: React.PointerEvent) {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;

    if (pointers.current.size === 2) {
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinchDist.current) {
        const rect = e.currentTarget.getBoundingClientRect();
        const midX = (a.x + b.x) / 2 - rect.left;
        zoomAtScreenX(midX, dist / pinchDist.current);
      }
      pinchDist.current = dist;
      return;
    }

    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    panBy(-(e.clientX - prev.x));
  }

  function onPointerUp(e: React.PointerEvent) {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchDist.current = null;
    flushNow();
  }

  function onDoubleClick(e: React.MouseEvent) {
    const rect = e.currentTarget.getBoundingClientRect();
    zoomAtScreenX(e.clientX - rect.left, STEP_ZOOM_FACTOR);
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!active) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (document.activeElement?.tagName ?? '').toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      if (e.key === 'ArrowLeft') { panBy(-KEY_PAN_STEP); e.preventDefault(); }
      else if (e.key === 'ArrowRight') { panBy(KEY_PAN_STEP); e.preventDefault(); }
      else if (e.key === '+' || e.key === '=') { zoomAtScreenX(width / 2, STEP_ZOOM_FACTOR); e.preventDefault(); }
      else if (e.key === '-' || e.key === '_') { zoomAtScreenX(width / 2, 1 / STEP_ZOOM_FACTOR); e.preventDefault(); }
      else if (e.key === 'Home') { fitAll(); e.preventDefault(); }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, active]);

  const showHistory = trackMode === 'both' || trackMode === 'history';
  const showPolity = trackMode === 'both' || trackMode === 'polity';

  return (
    <div className="w-full h-full flex flex-col" style={{ background: 'var(--bg-app)' }}>
      <div className="flex-1 min-h-0 flex">
        <div className="w-9 lg:w-16 shrink-0 flex flex-col border-r" style={{ borderColor: 'var(--border)' }}>
          {showHistory && (
            <div
              className={`${TRACKS.history.cssClass} flex-1 flex items-center justify-center`}
              style={{ background: 'color-mix(in srgb, var(--subject) 7%, transparent)' }}
            >
              <span
                className="font-bold uppercase tracking-widest text-[11px]"
                style={{ color: 'var(--subject)', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                {TRACKS.history.label}
              </span>
            </div>
          )}
          {showPolity && (
            <div
              className={`${TRACKS.polity.cssClass} flex-1 flex items-center justify-center ${showHistory ? 'border-t' : ''}`}
              style={{ borderColor: 'var(--border)', background: 'color-mix(in srgb, var(--subject) 7%, transparent)' }}
            >
              <span
                className="font-bold uppercase tracking-widest text-[11px]"
                style={{ color: 'var(--subject)', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                {TRACKS.polity.label}
              </span>
            </div>
          )}
          {/* Spacers matching TimeAxis (h-14) + MiniMap (h-6) heights so the
              rail's lane sections stay aligned with the right side. Zoom
              controls moved to a floating cluster over the canvas (touch). */}
          <div className="h-14 shrink-0" />
          <div className="h-6 shrink-0" />
        </div>

        <div
          ref={containerRef}
          className="relative flex-1 min-w-0 flex flex-col overflow-hidden touch-none select-none cursor-grab active:cursor-grabbing"
          onWheel={onWheel}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onDoubleClick={onDoubleClick}
          onClick={() => onSelectEntry(null)}
        >
          {width > 0 && (
            <>
              {showHistory && (
                <Lane
                  trackId="history"
                  items={historyItems}
                  lodLevel={level}
                  renderView={renderView}
                  zoomMV={zoomMV}
                  panXMV={panXMV}
                  yearToWorld={yearToWorld}
                  onOpenCluster={zoomToYearRange}
                  selectedEntryId={selectedEntryId}
                  onSelectEntry={onSelectEntry}
                  heat={heat}
                />
              )}
              {showPolity && (
                <Lane
                  trackId="polity"
                  items={polityItems}
                  lodLevel={level}
                  renderView={renderView}
                  zoomMV={zoomMV}
                  panXMV={panXMV}
                  yearToWorld={yearToWorld}
                  onOpenCluster={zoomToYearRange}
                  selectedEntryId={selectedEntryId}
                  onSelectEntry={onSelectEntry}
                  heat={heat}
                />
              )}
              <TimeAxis
                zoomMV={zoomMV}
                panXMV={panXMV}
                yearToWorld={yearToWorld}
                worldToYear={worldToYear}
                viewportWidthPx={width}
                renderView={renderView}
                orphanQuestions={orphanQuestions}
              />
              <MiniMap
                entries={renderEntries}
                zoomMV={zoomMV}
                panXMV={panXMV}
                minZoom={minZoom}
                viewportWidthPx={width}
                yearToWorld={yearToWorld}
                worldToYear={worldToYear}
                onJump={jumpToYear}
              />

              {/* Floating zoom cluster — big touch targets that work on phones
                  (pinch also zooms). stopPropagation so a tap never starts a pan. */}
              <div
                className="absolute top-2 right-2 z-20 flex flex-col rounded-lg overflow-hidden shadow-lg"
                style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                {([
                  { label: '+', title: 'Zoom in', onClick: () => zoomAtScreenX(width / 2, STEP_ZOOM_FACTOR) },
                  { label: '⤢', title: 'Fit all', onClick: fitAll },
                  { label: '−', title: 'Zoom out', onClick: () => zoomAtScreenX(width / 2, 1 / STEP_ZOOM_FACTOR) },
                ] as const).map((b, i) => (
                  <button
                    key={b.title}
                    onClick={b.onClick}
                    title={b.title}
                    className={`w-9 h-9 flex items-center justify-center text-base leading-none hover:bg-[var(--bg-panel-elev)] active:bg-[var(--bg-panel-elev)] transition-colors ${i > 0 ? 'border-t' : ''}`}
                    style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
