import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '@/lib/mpscApi';
import type { StaticSet, StaticSetGroup } from '@/lib/mpscApi';
import { SetCard } from '@/modules/library/SetCard';
import { SkeletonCards } from '@/components/states/Skeleton';
import { EmptyState } from '@/components/states/StateMessage';

// ============================================
// Library — Phase 5c. Sourced from the StaticSet registry (a real backend
// table now, not a scan of the frontend-only modules.ts) so counts/blurb/
// publish-state can be edited from the admin console. registry.ts/EmbedPage
// are unchanged — StaticSet.route matches an existing registry id, so
// `/embed/:id` still resolves the exact same static file it always did.
// ============================================

const GROUPS: { key: StaticSetGroup; label: string }[] = [
  { key: 'exam_guide', label: 'Exam guides' },
  { key: 'lab', label: 'Labs' },
  { key: 'quick_practice', label: 'Quick practice (one-offs)' },
];

type Sort = 'newest' | 'az' | 'most';
const SORTS: { key: Sort; label: string }[] = [
  { key: 'newest', label: 'Newest first' },
  { key: 'az', label: 'A–Z' },
  { key: 'most', label: 'Most questions' },
];

// Sorts within each category group rather than flattening them away — the
// grouping is real, useful structure (Phase 5c), not something to discard
// just because the design's own grid happens to be flat.
function sortSets(sets: StaticSet[], sort: Sort): StaticSet[] {
  const copy = [...sets];
  if (sort === 'az') return copy.sort((a, b) => a.title.localeCompare(b.title));
  if (sort === 'most') return copy.sort((a, b) => (b.nItems ?? -1) - (a.nItems ?? -1));
  return copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function LibraryLandingPage() {
  const navigate = useNavigate();
  const [sets, setSets] = useState<StaticSet[] | null>(null);
  const [sort, setSort] = useState<Sort>('newest');

  useEffect(() => {
    api.getStaticSets().then((r) => setSets(r.sets)).catch(() => setSets([]));
  }, []);

  const totalQuestions = sets?.reduce((sum, s) => sum + (s.nItems ?? 0), 0) ?? 0;

  return (
    <div className="h-full overflow-y-auto scroll-panel">
      <div className="max-w-[1100px] mx-auto px-8 py-9 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-medium tracking-tight mb-1.5" style={{ color: 'var(--text-primary)' }}>Library</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Premade sets — self-contained pages that never touch the question API.
          </p>
        </div>

        <div
          className="rounded-lg px-4 py-3 flex items-center gap-3 flex-wrap"
          style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}
        >
          <span
            className="text-[10px] font-bold uppercase px-2 py-0.5 rounded"
            style={{ letterSpacing: '0.04em', background: 'var(--sunk)', color: 'var(--text-secondary)' }}
          >
            Not from the API
          </span>
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            These sets are self-contained pages, authored once and uploaded. They open inside the app shell, keep
            their own scoring, and never hit the question API — so nothing here can break when the bank changes.
          </span>
        </div>

        {sets === null && <SkeletonCards count={6} />}

        {sets !== null && sets.length === 0 && (
          <EmptyState
            heading="No sets yet"
            body="Premade sets are authored and uploaded, then published from the admin console. None are live right now."
          />
        )}

        {sets !== null && sets.length > 0 && (
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
              {sets.length} set{sets.length === 1 ? '' : 's'}
              {totalQuestions > 0 && <> · {totalQuestions.toLocaleString()} questions</>}
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="ml-auto text-xs px-2 py-1 rounded-md"
              style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            >
              {SORTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </div>
        )}

        {sets !== null && GROUPS.map((group) => {
          const groupSets = sortSets(sets.filter((s) => s.group === group.key), sort);
          if (groupSets.length === 0) return null;
          return (
            <div key={group.key}>
              <div
                className="text-[11px] tracking-wider uppercase font-medium mb-2.5"
                style={{ color: 'var(--text-secondary)' }}
              >
                {group.label}
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {groupSets.map((s) => (
                  <SetCard key={s.id} set={s} onOpen={(set) => navigate(set.route)} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
