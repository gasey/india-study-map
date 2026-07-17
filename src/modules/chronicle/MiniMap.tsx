import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { TimelineRenderEntry } from './useTimelineData';
import type { Year } from '@/data/timeline/types';

interface MiniMapProps {
  entries: TimelineRenderEntry[];
  zoomMV: MotionValue<number>;
  panXMV: MotionValue<number>;
  minZoom: number;
  viewportWidthPx: number;
  yearToWorld: (y: Year) => number;
  worldToYear: (px: number) => Year;
  onJump: (year: Year) => void;
}

/** Full-range overview strip: every entry as a faint dot, positioned at
 *  the fixed minZoom scale (the minimap itself never zooms) — only the
 *  viewport-window box tracks the main canvas's live zoom/pan. Click
 *  anywhere to re-center the main view there. */
export function MiniMap({
  entries,
  zoomMV,
  panXMV,
  minZoom,
  viewportWidthPx,
  yearToWorld,
  worldToYear,
  onJump,
}: MiniMapProps) {
  const windowLeft = useTransform([zoomMV, panXMV], ([z, p]: number[]) => (p / z) * minZoom);
  const windowWidth = useTransform(zoomMV, (z) => (viewportWidthPx / z) * minZoom);

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const miniX = e.clientX - rect.left;
    onJump(worldToYear(miniX / minZoom));
  }

  return (
    <div
      className="relative h-6 shrink-0 border-t cursor-pointer"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-panel)' }}
      onClick={handleClick}
      title="Click to jump — this is the full range, Indus Valley to today"
    >
      {entries.map(({ entry }) => (
        <div
          key={entry.id}
          className="absolute top-1/2 -translate-y-1/2 rounded-full"
          style={{
            left: yearToWorld(entry.year) * minZoom,
            width: 2,
            height: 2,
            background: 'var(--text-muted)',
            opacity: 0.6,
          }}
        />
      ))}
      <motion.div
        className="absolute top-0 h-full rounded-sm pointer-events-none"
        style={{ left: windowLeft, width: windowWidth, background: 'var(--accent-soft)', border: '1px solid var(--accent)' }}
      />
    </div>
  );
}
