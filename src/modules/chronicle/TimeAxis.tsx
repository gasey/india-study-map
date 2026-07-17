import { useMemo } from 'react';
import { motion, type MotionValue } from 'framer-motion';
import { eras } from '@/data/timeline/eras';
import { formatYear, type Year } from '@/data/timeline/types';
import type { BankQuestion } from '@/data/banks/types';
import { useScreenX, useScreenWidth } from './useTimelineScale';

interface TimeAxisProps {
  zoomMV: MotionValue<number>;
  panXMV: MotionValue<number>;
  yearToWorld: (y: Year) => number;
  worldToYear: (w: number) => Year;
  viewportWidthPx: number;
  renderView: { zoom: number; panX: number };
  orphanQuestions: BankQuestion[];
}

// "Nice" tick steps (years). We pick the smallest one that keeps labels
// from crowding at the current local pixels-per-year.
const NICE_STEPS = [1, 2, 5, 10, 25, 50, 100, 200, 250, 500, 1000, 2000];
const TARGET_TICK_SPACING_PX = 96;

/** Adaptive year gridline: a light tick + year label at a "nice" interval,
 *  so you can always read off which year a spot on the timeline is. */
function YearTick({
  year,
  major,
  zoomMV,
  panXMV,
  yearToWorld,
}: {
  year: Year;
  major: boolean;
  zoomMV: MotionValue<number>;
  panXMV: MotionValue<number>;
  yearToWorld: (y: Year) => number;
}) {
  const left = useScreenX(yearToWorld(year), zoomMV, panXMV);
  return (
    <motion.div className="absolute top-6" style={{ left }}>
      <div className="w-px" style={{ height: major ? 10 : 6, background: 'color-mix(in srgb, var(--accent) 32%, var(--border))' }} />
      <span
        className="absolute top-2.5 -translate-x-1/2 whitespace-nowrap tabular-nums"
        style={{ fontSize: major ? 11 : 10, fontWeight: major ? 600 : 400, color: major ? 'var(--text-secondary)' : 'var(--text-muted)' }}
      >
        {formatYear(year)}
      </span>
    </motion.div>
  );
}

function EraBand({
  era,
  zoomMV,
  panXMV,
  yearToWorld,
}: {
  era: (typeof eras)[number];
  zoomMV: MotionValue<number>;
  panXMV: MotionValue<number>;
  yearToWorld: (y: Year) => number;
}) {
  const worldStart = yearToWorld(era.start);
  const worldEnd = yearToWorld(era.end);
  const left = useScreenX(worldStart, zoomMV, panXMV);
  const width = useScreenWidth(worldEnd - worldStart, zoomMV);
  return (
    <motion.div
      className="absolute top-0 h-6 flex items-center justify-center overflow-hidden border-r"
      style={{
        left,
        width,
        background: `linear-gradient(180deg, ${era.color}, transparent)`,
        borderColor: 'color-mix(in srgb, var(--accent) 20%, var(--border))',
      }}
    >
      <span
        className="truncate px-1.5 font-semibold uppercase"
        style={{ fontSize: 10, letterSpacing: '0.06em', color: 'color-mix(in srgb, var(--accent) 65%, var(--text-secondary))' }}
        title={era.label}
      >
        {era.label}
      </span>
    </motion.div>
  );
}

function OrphanTick({
  question,
  zoomMV,
  panXMV,
  yearToWorld,
}: {
  question: BankQuestion;
  zoomMV: MotionValue<number>;
  panXMV: MotionValue<number>;
  yearToWorld: (y: Year) => number;
}) {
  const left = useScreenX(yearToWorld(question.about!), zoomMV, panXMV);
  return (
    <motion.div
      className="absolute bottom-0 w-1 h-1 rounded-full cursor-help"
      style={{ left, background: 'var(--text-muted)' }}
      title={`Unclaimed: ${question.question} (${formatYear(question.about!)}) — no timeline entry yet`}
    />
  );
}

/** Era bands + an adaptive year ruler below the lanes. The ruler picks a
 *  "nice" year step from the current zoom so there are always readable year
 *  labels (never just the era boundaries), making it easy to see when and
 *  over what range something happened. Orphan bank questions (have `about`,
 *  matched no entry) render as small unclaimed ticks. */
export function TimeAxis({
  zoomMV,
  panXMV,
  yearToWorld,
  worldToYear,
  viewportWidthPx,
  renderView,
  orphanQuestions,
}: TimeAxisProps) {
  const boundarySet = new Set<Year>([...eras.map((e) => e.start), eras[eras.length - 1].end]);

  const ticks = useMemo(() => {
    if (viewportWidthPx <= 0) return [] as { year: Year; major: boolean }[];
    const { zoom, panX } = renderView;
    const yStart = worldToYear(panX / zoom);
    const yEnd = worldToYear((viewportWidthPx + panX) / zoom);
    const centerYear = worldToYear((viewportWidthPx / 2 + panX) / zoom);
    const pxPerYear = (yearToWorld(centerYear + 1) - yearToWorld(centerYear)) * zoom;
    if (!(pxPerYear > 0)) return [];
    const rawYears = TARGET_TICK_SPACING_PX / pxPerYear;
    const step = NICE_STEPS.find((s) => s >= rawYears) ?? NICE_STEPS[NICE_STEPS.length - 1];
    const majorStep = step * 5;
    const screenX = (y: Year) => yearToWorld(y) * zoom - panX;
    const MIN_LABEL_GAP_PX = 46;

    // Era boundaries in view are always-kept major ticks. Because the scale is
    // piecewise (px/year varies by era), a fixed year-step gives uneven pixel
    // spacing, so we drop any regular tick that lands too close to a kept one.
    const kept: { year: Year; major: boolean; x: number }[] = [];
    for (const b of boundarySet) {
      if (b >= yStart && b <= yEnd) kept.push({ year: b, major: true, x: screenX(b) });
    }
    const first = Math.ceil(yStart / step) * step;
    for (let y = first; y <= yEnd; y += step) {
      if (boundarySet.has(y)) continue;
      const x = screenX(y);
      if (kept.every((k) => Math.abs(k.x - x) >= MIN_LABEL_GAP_PX)) {
        kept.push({ year: y, major: y % majorStep === 0, x });
      }
      if (kept.length >= 80) break;
    }
    return kept.map(({ year, major }) => ({ year, major }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderView.zoom, renderView.panX, viewportWidthPx]);

  return (
    <div className="relative h-14 shrink-0 border-t" style={{ borderColor: 'var(--border)' }}>
      {eras.map((era) => (
        <EraBand key={era.id} era={era} zoomMV={zoomMV} panXMV={panXMV} yearToWorld={yearToWorld} />
      ))}
      {ticks.map((t) => (
        <YearTick
          key={t.year}
          year={t.year}
          major={t.major}
          zoomMV={zoomMV}
          panXMV={panXMV}
          yearToWorld={yearToWorld}
        />
      ))}
      {orphanQuestions
        .filter((q) => q.about !== undefined)
        .map((q) => (
          <OrphanTick key={q.id} question={q} zoomMV={zoomMV} panXMV={panXMV} yearToWorld={yearToWorld} />
        ))}
    </div>
  );
}
