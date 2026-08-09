import { tint, mixSurface, hueForTopic } from '@/lib/colorMix';
import type { ArchiveDayEntry } from './types';

// ============================================
// DAY SHELF — ported from the Jabreeze handoff's graphs.tsx `DayShelf`,
// adapted to this repo's Tailwind + var(--token) convention instead of the
// handoff's own inline lib/styles.ts vocabulary (see Phase 1's "one
// vocabulary" rule). The active card widens and lifts; a missed day shows a
// muted "missed" pill on purpose — visible failure is the point, not a bug
// to hide.
// ============================================

export interface DayShelfEntry extends ArchiveDayEntry {
  state: 'done' | 'missed' | 'today';
  scoreLabel: string;
}

export function DayShelf({ days, active, onPick }: { days: DayShelfEntry[]; active: number; onPick: (i: number) => void }) {
  const centre = (el: HTMLDivElement | null) => {
    if (!el || el.dataset.centred) return;
    el.dataset.centred = '1';
    const card = el.querySelectorAll<HTMLElement>('[data-shelf-card]')[active];
    if (card) el.scrollLeft = card.offsetLeft - el.clientWidth / 2 + card.clientWidth / 2;
  };

  return (
    <div className="flex flex-col gap-4">
      <div ref={centre} className="relative overflow-x-auto overflow-y-hidden" style={{ padding: '26px 0 20px' }}>
        <div className="flex items-center gap-4" style={{ padding: '0 calc(50% - 104px)', width: 'max-content' }}>
          {days.map((d, i) => {
            const on = i === active;
            const near = Math.abs(i - active) === 1;
            const color = hueForTopic(d.topics[0] ?? d.title);
            const dt = new Date(d.date + 'T00:00:00');
            const dayLabel = dt.toLocaleDateString(undefined, { weekday: 'short' });
            const dateNum = dt.getDate();
            const monthLabel = dt.toLocaleDateString(undefined, { month: 'short' });
            const pill =
              d.state === 'done'
                ? { bg: 'transparent', fg: 'var(--ok)', bd: 'var(--ok)' }
                : d.state === 'today'
                ? { bg: 'var(--accent)', fg: 'var(--on-accent)', bd: 'transparent' }
                : { bg: 'transparent', fg: 'var(--text-secondary)', bd: 'var(--border)' };

            return (
              <div
                key={d.date}
                data-shelf-card
                onClick={() => onPick(i)}
                className="shrink-0 cursor-pointer transition-all"
                style={{ width: on ? 218 : 148 }}
              >
                <div
                  className="relative overflow-hidden rounded-2xl"
                  style={{
                    opacity: on ? 1 : near ? 0.88 : 0.62,
                    transform: on ? 'translateY(-8px)' : 'none',
                    border: `1px solid ${on ? tint(color, 50) : 'var(--border)'}`,
                    background: on
                      ? `linear-gradient(148deg, ${mixSurface(color, 34)} 0%, ${mixSurface('var(--accent)', 18)} 58%, var(--bg-panel) 100%)`
                      : `linear-gradient(160deg, ${mixSurface(color, 12)} 0%, var(--bg-panel) 70%)`,
                    boxShadow: on ? `0 20px 40px -22px ${tint(color, 85)}` : 'none',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease, opacity 0.25s ease',
                  }}
                >
                  <div
                    className="relative flex flex-col gap-2.5 box-border"
                    style={{ padding: on ? '14px 15px' : '11px 12px', minHeight: on ? 156 : 130 }}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="text-center shrink-0">
                        <div className="font-mono text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>{dayLabel}</div>
                        <div className="text-2xl font-bold leading-none tracking-tight" style={{ color }}>{dateNum}</div>
                        <div className="font-mono text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>{monthLabel}</div>
                      </div>
                      <span
                        className="ml-auto text-[9px] font-bold uppercase px-1.5 py-0.5 rounded whitespace-nowrap"
                        style={{ letterSpacing: '0.04em', border: `1px solid ${color}`, color }}
                      >
                        {d.topics[0] ?? 'GK'}
                      </span>
                    </div>
                    <div className={`font-semibold leading-tight text-wrap-pretty flex-1 ${on ? 'text-sm' : 'text-xs'}`}>{d.title}</div>
                    <div className="flex items-center gap-2 pt-2" style={{ borderTop: `1px dashed ${tint('var(--text-primary)', 14)}` }}>
                      <span
                        className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded"
                        style={{ letterSpacing: '0.04em', background: pill.bg, color: pill.fg, border: `1px solid ${pill.bd}` }}
                      >
                        {d.scoreLabel}
                      </span>
                      <span className="ml-auto text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {on ? 'Open today →' : 'Review'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5">
        {days.map((d, i) => (
          <span
            key={d.date}
            onClick={() => onPick(i)}
            className="block rounded-full cursor-pointer transition-all"
            style={{ width: i === active ? 22 : 6, height: 6, background: i === active ? 'var(--accent)' : 'var(--border)' }}
          />
        ))}
      </div>
    </div>
  );
}
