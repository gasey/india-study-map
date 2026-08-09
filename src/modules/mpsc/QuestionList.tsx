import { useState } from 'react';
import type { BankQuestion, ExamPaper } from '@/data/banks/types';
import type { BankQuestionQuery, Correction } from '@/lib/mpscApi';
import { QuestionCard } from './QuestionCard';

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
}

export function QuestionList({
  questions, paperById, corrections, total, bankTotal,
  sortBy, sortDir, onSortChange, onStartTest, startingTest,
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
          <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>{total.toLocaleString()}</span>
          {bankTotal !== null && <> of <span className="font-mono">{bankTotal.toLocaleString()}</span></>} questions match
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
        {questions.length === 0 && (
          <p className="text-sm py-8 text-center" style={{ color: 'var(--text-secondary)' }}>
            No questions match these filters.
          </p>
        )}
        {questions.map((q) => (
          <QuestionCard
            key={q.id}
            q={q}
            paper={q.paperId ? paperById.get(q.paperId) : undefined}
            correction={corrections[q.id]}
            showAnswer={showAnswers}
          />
        ))}
      </div>
    </div>
  );
}
