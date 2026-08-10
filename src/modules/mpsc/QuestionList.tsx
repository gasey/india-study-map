import { useState } from 'react';
import type { BankQuestion, ExamPaper } from '@/data/banks/types';
import type { BankQuestionQuery, Correction } from '@/lib/mpscApi';
import { QuestionCard } from './QuestionCard';
import { SkeletonRows } from '@/components/states/Skeleton';
import { EmptyState, ErrorState } from '@/components/states/StateMessage';
import type { MpscFilters } from './useMpscData';

// Human labels for the filter dimensions, so the empty state can name which
// filters are actually narrowing the result — see the honesty note on
// EmptyState below.
const FILTER_LABELS: { key: keyof MpscFilters; label: string }[] = [
  { key: 'examType', label: 'Exam type' },
  { key: 'post', label: 'Post' },
  { key: 'year', label: 'Year' },
  { key: 'paperId', label: 'Paper' },
  { key: 'subject', label: 'Subject' },
  { key: 'difficulty', label: 'Difficulty' },
  { key: 'type', label: 'Type' },
];

function activeFilterLabels(f: MpscFilters): string[] {
  const out: string[] = [];
  for (const { key, label } of FILTER_LABELS) {
    if ((f[key] as string[]).length > 0) out.push(label);
  }
  if (f.search.trim()) out.push('Search');
  return out;
}

// ============================================
// The bank's Browse pane — the design's list of <QuestionCard/>s plus the
// header row above it (match count · sort · Show answers · Mock test from
// these). Replaces QuestionsTable, which rendered a plain <table> and
// hardcoded gray/slate Tailwind colours that broke the parchment and neon
// themes outright.
//
// "Show answers" is off by default and lives here rather than per-card:
// the design treats it as one switch over the whole list, and a learner
// scrolling a filtered set should not have answers revealed one at a time
// by accident.
// ============================================

type SortKey = NonNullable<BankQuestionQuery['sortBy']>;

/** The design's four sort options minus "Least attempted" — that needs
 *  cross-user attempt counts, which no endpoint provides. */
const SORTS: { label: string; by: SortKey; dir: 'asc' | 'desc' }[] = [
  { label: 'Newest paper first', by: 'year', dir: 'desc' },
  { label: 'Oldest first', by: 'year', dir: 'asc' },
  { label: 'Hardest first', by: 'difficulty', dir: 'desc' },
  { label: 'Easiest first', by: 'difficulty', dir: 'asc' },
];

interface QuestionListProps {
  questions: BankQuestion[];
  paperById: Map<string, ExamPaper>;
  corrections: Record<string, Correction>;
  /** Server-side total for the current filters, not this page's length. */
  total: number;
  /** Whole-bank total, for the "N of TOTAL match" line. */
  bankTotal: number | null;
  sortBy: SortKey;
  sortDir: 'asc' | 'desc';
  onSortChange: (by: SortKey, dir: 'asc' | 'desc') => void;
  onStartTest: () => void;
  startingTest: boolean;
  /** Fetch in flight — show skeleton rows at real row height, not a spinner. */
  loading: boolean;
  /** Fetch failed — the filter is still safe in the URL; offer one retry. */
  error: boolean;
  onRetry: () => void;
  /** The live filter, so the empty state can name what's narrowing the result. */
  filters: MpscFilters;
  /** Clear every filter dimension at once (the empty state's one-click escape). */
  onResetFilters: () => void;
}

export function QuestionList({
  questions, paperById, corrections, total, bankTotal,
  sortBy, sortDir, onSortChange, onStartTest, startingTest,
  loading, error, onRetry, filters, onResetFilters,
}: QuestionListProps) {
  const [showAnswers, setShowAnswers] = useState(false);
  const activeSort = SORTS.find((s) => s.by === sortBy && s.dir === sortDir) ?? SORTS[0];

  return (
    <div className="flex flex-col h-full min-h-0">
      <div
        className="flex items-center gap-3 flex-wrap px-4 py-3 shrink-0"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {loading ? (
            'Loading questions…'
          ) : error ? (
            // Not "0 of N match" — that reads as a real zero-result filter,
            // not a failed fetch. The error state below explains why.
            'Could not load'
          ) : (
            <>
              <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>{total.toLocaleString()}</span>
              {bankTotal !== null && <> of <span className="font-mono">{bankTotal.toLocaleString()}</span></>} questions match
            </>
          )}
        </span>

        <select
          value={`${activeSort.by}|${activeSort.dir}`}
          onChange={(e) => {
            const [by, dir] = e.target.value.split('|');
            onSortChange(by as SortKey, dir as 'asc' | 'desc');
          }}
          className="px-2 py-1 rounded-md text-xs"
          style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
        >
          {SORTS.map((s) => <option key={`${s.by}|${s.dir}`} value={`${s.by}|${s.dir}`}>{s.label}</option>)}
        </select>

        <button
          onClick={() => setShowAnswers((v) => !v)}
          className="px-2.5 py-1 rounded-md text-xs font-medium"
          style={showAnswers
            ? { background: 'var(--accent)', color: 'var(--on-accent)', border: '1px solid var(--accent)' }
            : { background: 'var(--bg-panel-elev)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
        >
          {showAnswers ? 'Hide answers' : 'Show answers'}
        </button>

        <button
          onClick={onStartTest}
          disabled={total === 0 || startingTest}
          className="ml-auto text-xs font-medium disabled:opacity-50"
          style={{ color: 'var(--accent)' }}
        >
          {startingTest ? 'Building…' : 'Mock test from these →'}
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scroll-panel px-4 py-3 flex flex-col gap-3">
        {loading ? (
          <SkeletonRows rows={4} />
        ) : error ? (
          <ErrorState
            heading="Couldn't reach the question bank"
            body="Your filters are saved in the URL, so nothing's lost. This is a server problem, not a problem with what you searched for."
            primary={{ label: 'Retry', onClick: onRetry }}
          />
        ) : questions.length === 0 ? (
          <EmptyResult filters={filters} onResetFilters={onResetFilters} />
        ) : (
          questions.map((q) => (
            <QuestionCard
              key={q.id}
              q={q}
              paper={q.paperId ? paperById.get(q.paperId) : undefined}
              correction={corrections[q.id]}
              showAnswer={showAnswers}
            />
          ))
        )}
      </div>
    </div>
  );
}

// The mockup's Empty state names the single tightest filter and the exact
// count dropping it would bring back ("Official key only rules out 42,201").
// We deliberately DON'T fake that number: computing the real count-if-dropped
// for each active filter would be one extra facets query per dimension, and
// inventing a plausible-looking figure would be exactly the fabrication this
// project's honesty rules warn against. Instead we name *which* filters are
// active and give a one-click reset — honest, and still actionable. If a
// cheap count-if-dropped becomes available, this is where the mockup's exact
// copy would slot back in.
function EmptyResult({ filters, onResetFilters }: { filters: MpscFilters; onResetFilters: () => void }) {
  const active = activeFilterLabels(filters);

  if (active.length === 0) {
    // No filters at all and still nothing — the bank itself returned zero.
    return (
      <EmptyState
        heading="No questions here yet"
        body="The bank returned nothing for this view. If this looks wrong, it's worth checking the source rather than assuming the bank is empty."
      />
    );
  }

  const list =
    active.length === 1
      ? active[0]
      : active.length === 2
        ? `${active[0]} and ${active[1]}`
        : `${active.slice(0, -1).join(', ')} and ${active[active.length - 1]}`;

  return (
    <EmptyState
      heading="No questions match these filters"
      body={
        <>
          {active.length} filter{active.length === 1 ? '' : 's'} — {list} — {active.length === 1 ? 'is' : 'are'} narrowing this down at once.
          Drop or widen one to see results; your selection stays saved in the URL.
        </>
      }
      primary={{ label: 'Reset all filters', onClick: onResetFilters }}
    />
  );
}
