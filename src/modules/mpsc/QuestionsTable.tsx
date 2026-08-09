import { Fragment, useState } from 'react';
import type { BankQuestion, ExamPaper } from '@/data/banks/types';
import type { BankQuestionQuery, Correction } from '@/lib/mpscApi';
import { BANK_ID } from './useMpscData';
import { QuestionReviewPanel } from './QuestionReviewPanel';

// Reuses the API's own sort-key type (4 values) rather than a narrower
// local one — the table only exposes 3 of them as clickable columns
// ('id' has no column), but accepting the same type as the URL state in
// MpscPage means there's no separate type to keep in sync.
type SortKey = NonNullable<BankQuestionQuery['sortBy']>;

interface QuestionsTableProps {
  questions: BankQuestion[];
  paperById: Map<string, ExamPaper>;
  corrections: Record<string, Correction>;
  total: number;
  sortBy: SortKey;
  sortDir: 'asc' | 'desc';
  onSortChange: (key: SortKey) => void;
}

export function QuestionsTable({ questions, paperById, corrections, total, sortBy, sortDir, onSortChange }: QuestionsTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const SortIndicator = ({ column }: { column: SortKey }) => {
    if (sortBy !== column) return null;
    return <span className="ml-1 text-xs">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="flex flex-col h-full gap-3 p-4">
      {/* Results count — reflects the server-side total for the current
          filter combination, not just this one page's row count. */}
      <div className="text-xs text-gray-600 dark:text-gray-400">
        {total} question{total === 1 ? '' : 's'} match your filters
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="sticky top-0 bg-gray-50 dark:bg-slate-800 border-b dark:border-slate-700">
            <tr>
              <th className="px-3 py-2 text-left font-semibold cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700" onClick={() => onSortChange('question')}>
                Question <SortIndicator column="question" />
              </th>
              <th className="px-3 py-2 text-left font-semibold w-32">
                Post
              </th>
              <th className="px-3 py-2 text-left font-semibold w-20">
                Subject
              </th>
              <th className="px-3 py-2 text-left font-semibold cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 w-24" onClick={() => onSortChange('difficulty')}>
                Level <SortIndicator column="difficulty" />
              </th>
              <th className="px-3 py-2 text-left font-semibold cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 w-16" onClick={() => onSortChange('year')}>
                Year <SortIndicator column="year" />
              </th>
              <th className="px-3 py-2 text-center w-20">Action</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => {
              const paper = q.paperId ? paperById.get(q.paperId) : undefined;
              const correction = corrections[q.id];
              const isOpen = expandedId === q.id;
              return (
                <Fragment key={q.id}>
                  <tr className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800">
                    <td className="px-3 py-2 text-left">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        {paper?.examType && <span className="font-medium">{paper.examType.replace('_', ' ')}</span>}
                        {paper?.examType && paper?.examName ? ' · ' : ''}
                        {paper?.examName}
                        {correction && <span className="ml-2 text-green-600 dark:text-green-400">✓ corrected</span>}
                      </p>
                      {q.passage && (
                        <details className="mb-1">
                          <summary className="text-xs text-blue-600 dark:text-blue-400 cursor-pointer select-none">
                            📄 Show passage
                          </summary>
                          <p className="text-xs mt-1 p-2 bg-gray-100 dark:bg-slate-900 rounded whitespace-pre-wrap">
                            {q.passage}
                          </p>
                        </details>
                      )}
                      <p className="line-clamp-2">{q.question}</p>
                    </td>
                    <td className="px-3 py-2 text-left text-xs">{paper?.post || '—'}</td>
                    <td className="px-3 py-2 text-left text-xs">{q.subject}</td>
                    <td className="px-3 py-2 text-left">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        q.difficulty === 'easy' ? 'bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100' :
                        q.difficulty === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100' :
                        'bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100'
                      }`}>
                        {q.difficulty}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-left text-sm">{q.year}</td>
                    <td className="px-3 py-2 text-center">
                      <button
                        onClick={() => setExpandedId(isOpen ? null : q.id)}
                        className="text-xs text-red-600 dark:text-red-400 hover:underline"
                      >
                        {isOpen ? 'Close' : 'Flag / discuss'}
                      </button>
                    </td>
                  </tr>
                  {isOpen && (
                    <tr className="border-b dark:border-slate-700">
                      <td colSpan={6} className="px-3 py-2 bg-gray-50 dark:bg-slate-900">
                        <QuestionReviewPanel bankId={BANK_ID} questionId={q.id} options={q.type === 'descriptive' ? undefined : q.options} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
