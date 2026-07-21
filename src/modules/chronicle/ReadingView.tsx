import { useMemo } from 'react';
import { useApp, chronicleMasteryOf } from '@/lib/store';
import { eras } from '@/data/timeline/eras';
import { TRACKS, formatYear } from '@/data/timeline/types';
import type { TimelineRenderEntry } from './useTimelineData';

interface ReadingViewProps {
  renderEntries: TimelineRenderEntry[];
  onSelectEntry: (id: string) => void;
}

const MASTERY_COLOR = { strong: '#2e7d5b', weak: '#a5504a', unseen: 'transparent' } as const;

/** Reading view (design handoff §"Screens / Views" → 2. Reading view): a
 *  scrollable, era-by-era list alternative to the zoomable canvas — same
 *  entries, era pills/track chips (shared chrome in ChroniclePage) still
 *  filter it. Bookmark/mastery indicators are wired to real store state but
 *  will render blank until the drawer-rework and quiz-rework phases add the
 *  UI that actually writes to them — same disclosed-gap pattern as Phase 1's
 *  inert Mastery lens. */
export function ReadingView({ renderEntries, onSelectEntry }: ReadingViewProps) {
  const trackMode = useApp((s) => s.chronicle.trackMode);
  const bookmarks = useApp((s) => s.chronicle.bookmarks);
  const mastery = useApp((s) => s.chronicle.mastery);

  const groups = useMemo(() => {
    return eras
      .map((era) => ({
        era,
        rows: renderEntries
          .filter(
            (r) =>
              (trackMode === 'both' || r.entry.track === trackMode) &&
              r.entry.year >= era.start &&
              r.entry.year < era.end
          )
          .sort((a, b) => a.entry.year - b.entry.year),
      }))
      .filter((g) => g.rows.length > 0);
  }, [renderEntries, trackMode]);

  return (
    <div className="absolute inset-0 overflow-y-auto scroll-panel" style={{ background: 'var(--bg-app)' }}>
      <div className="max-w-[760px] mx-auto flex flex-col px-6 md:px-10 py-7">
        {groups.length === 0 && (
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            No entries match the current track filter.
          </p>
        )}
        {groups.map(({ era, rows }) => (
          <div key={era.id} className="mb-8">
            <div className="flex items-baseline gap-3 mb-1">
              <h4 className="text-lg m-0" style={{ color: 'var(--text-primary)' }}>
                {era.label}
              </h4>
              <span className="text-[11.5px] tabular-nums" style={{ color: 'var(--text-muted)' }}>
                {formatYear(era.start)} – {formatYear(era.end)} · {rows.length} entries
              </span>
            </div>
            <div
              className="h-px mb-3.5"
              style={{ background: 'linear-gradient(to right, transparent, var(--border) 48px, var(--border) calc(100% - 48px), transparent)' }}
            />
            <div className="flex flex-col gap-0.5">
              {rows.map((r) => {
                const m = chronicleMasteryOf(mastery, r.entry.id);
                const bookmarked = bookmarks.includes(r.entry.id);
                return (
                  <button
                    key={r.entry.id}
                    onClick={() => onSelectEntry(r.entry.id)}
                    className={`${TRACKS[r.entry.track].cssClass} grid items-baseline gap-3 text-left px-3 py-2 rounded-lg transition-colors hover:brightness-95`}
                    style={{ gridTemplateColumns: '86px 10px 1fr auto' }}
                  >
                    <span className="tabular-nums text-xs text-right" style={{ color: 'var(--text-secondary)' }}>
                      {formatYear(r.entry.year, r.entry.circa)}
                    </span>
                    <span className="w-2 h-2 rounded-full self-center" style={{ background: 'var(--subject)' }} />
                    <span className="min-w-0">
                      <span className="flex items-center gap-1.5 text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                        <span className="truncate">{r.entry.title}</span>
                        {bookmarked && <span className="shrink-0 text-xs">🔖</span>}
                      </span>
                      <span className="block text-xs mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>
                        {r.entry.summary}
                      </span>
                    </span>
                    <span className="text-[10.5px] font-semibold tracking-wide whitespace-nowrap" style={{ color: MASTERY_COLOR[m] }}>
                      {m === 'unseen' ? '' : m.toUpperCase()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
