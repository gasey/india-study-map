import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { TimelineEntry } from '@/data/timeline/types';
import { TRACKS, formatYear } from '@/data/timeline/types';
import { useScreenX, useScreenWidth } from './useTimelineScale';

export type LodLevel = 'L0' | 'L1' | 'L2' | 'L3' | 'L4';

interface EntryNodeProps {
  entry: TimelineEntry;
  questionCount: number;
  lodLevel: LodLevel;
  /** Fixed world-px position/span (independent of zoom) — screen position
   *  is derived from these via the shared zoom/pan motion values, so this
   *  node's position stays smooth during gestures with no React re-render. */
  worldX: number;
  worldEndX?: number;
  zoomMV: MotionValue<number>;
  panXMV: MotionValue<number>;
  /** Vertical sub-row slot (collision handling bumps overlapping labels
   *  down instead of letting them overlap) — see layoutLane in TimelineCanvas. */
  topPercent: number;
  isSelected: boolean;
  onSelect: () => void;
  /** Exam-heat toolbar toggle (spec §4.4): 0 questions -> plain,
   *  1-2 -> ring, 3+ -> glow. */
  heat: boolean;
}

/** A small glyph per kind so a moment, a span, and a person read
 *  differently at a glance — not just three identically-styled labels. */
const KIND_GLYPH: Record<TimelineEntry['kind'], string> = {
  event: '◈',
  period: '▬',
  person: '◆',
};

/** One entry: a dot for a moment, a bar for a period/person's span.
 *  LOD-aware: L0-L2 show a compact label; L3 adds the year; L4 adds the
 *  summary line. (linksTo threads are drawn later, alongside the drawer.) */
export function EntryNode({
  entry,
  questionCount,
  lodLevel,
  worldX,
  worldEndX,
  zoomMV,
  panXMV,
  topPercent,
  isSelected,
  onSelect,
  heat,
}: EntryNodeProps) {
  const track = TRACKS[entry.track];
  const heatTier = heat ? (questionCount >= 3 ? 'glow' : questionCount >= 1 ? 'ring' : 'plain') : 'plain';
  const isSpan = entry.kind !== 'event';
  const left = useScreenX(worldX, zoomMV, panXMV);
  const rawWidth = useScreenWidth(worldEndX !== undefined ? worldEndX - worldX : 0, zoomMV);
  const barWidth = useTransform(rawWidth, (w) => Math.max(w, 6));

  // Show the year/range on the label from L2 up — the earlier "when did this
  // happen?" answer, not something you only see once fully zoomed in.
  const detailed = lodLevel === 'L2' || lodLevel === 'L3' || lodLevel === 'L4';
  const yearLabel =
    entry.endYear !== undefined
      ? `${formatYear(entry.year, entry.circa)}–${formatYear(entry.endYear, entry.circa)}`
      : formatYear(entry.year, entry.circa);
  const tooltip = `${entry.title} — ${yearLabel}${questionCount > 0 ? ` · ${questionCount} question${questionCount === 1 ? '' : 's'}` : ''}`;

  const labelEl = (
    <span
      className="inline-flex items-center gap-1 whitespace-nowrap text-[12px] font-medium px-1.5 py-1 rounded-md leading-none"
      style={{
        color: 'var(--text-primary)',
        background: 'color-mix(in srgb, var(--subject) 9%, var(--bg-panel))',
        border: '1px solid color-mix(in srgb, var(--subject) 38%, var(--border))',
        boxShadow: isSelected ? 'none' : '0 1px 2px rgba(0,0,0,0.08)',
      }}
    >
      <span aria-hidden style={{ color: 'var(--subject)', fontSize: 9, opacity: 0.85 }}>
        {KIND_GLYPH[entry.kind]}
      </span>
      {entry.title}
      {detailed && <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>· {yearLabel}</span>}
      {questionCount > 0 && (
        <span
          className="inline-flex items-center rounded-full px-1.5 text-[10px] font-semibold leading-tight"
          style={{
            color: 'var(--subject)',
            background: 'color-mix(in srgb, var(--subject) 16%, transparent)',
            border: '1px solid color-mix(in srgb, var(--subject) 35%, transparent)',
          }}
          title={`${questionCount} attached question${questionCount === 1 ? '' : 's'}`}
        >
          {heat && questionCount >= 3 ? '🔥' : 'Q'}{questionCount}
        </span>
      )}
    </span>
  );

  return (
    <motion.button
      className={`${track.cssClass} absolute -translate-y-1/2 rounded-lg ${
        isSpan ? 'flex flex-col items-start gap-0.5' : 'flex items-center gap-1.5'
      }`}
      style={{
        left,
        top: `${topPercent}%`,
        zIndex: isSelected ? 30 : heatTier === 'glow' ? 20 : 10,
        boxShadow: isSelected ? '0 0 0 2px var(--accent), 0 4px 14px rgba(0,0,0,0.22)' : 'none',
        filter: heatTier === 'glow' ? 'drop-shadow(0 0 6px color-mix(in srgb, var(--subject) 70%, transparent))' : 'none',
      }}
      title={tooltip}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
      whileHover={{ scale: 1.04, y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      {isSpan ? (
        // Period/person: label sits ABOVE the bar so it never widens the
        // bar's horizontal footprint (which the lane layout reserves in full).
        <>
          {labelEl}
          <motion.div
            className="rounded-full"
            style={{
              width: barWidth,
              height: 9,
              background: 'linear-gradient(90deg, color-mix(in srgb, var(--subject) 72%, transparent), color-mix(in srgb, var(--subject) 42%, transparent))',
              border: '1px solid var(--subject)',
              boxShadow: heatTier === 'ring'
                ? 'inset 0 1px 0 rgba(255,255,255,0.25), 0 0 0 1.5px color-mix(in srgb, var(--subject) 45%, transparent)'
                : 'inset 0 1px 0 rgba(255,255,255,0.25)',
            }}
          />
        </>
      ) : (
        // Event: a dot at the moment, label to its right.
        <>
          <div
            className="rounded-full shrink-0"
            style={{
              width: 13,
              height: 13,
              background: 'radial-gradient(circle at 35% 30%, color-mix(in srgb, white 45%, var(--subject)), var(--subject))',
              border: '2px solid var(--bg-app)',
              boxShadow: heatTier === 'ring'
                ? '0 0 0 2px color-mix(in srgb, var(--subject) 45%, transparent), 0 1px 3px rgba(0,0,0,0.3)'
                : '0 1px 3px rgba(0,0,0,0.3)',
            }}
          />
          {labelEl}
        </>
      )}
    </motion.button>
  );
}
