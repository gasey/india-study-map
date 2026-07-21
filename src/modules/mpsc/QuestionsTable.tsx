import { useMemo, useState } from 'react';
import type { BankQuestion, ExamPaper } from '@/data/banks/types';
import { ReportModal } from './ReportModal';

interface QuestionsTableProps {
  questions: BankQuestion[];
  paperById: Map<string, ExamPaper>;
}

type SortKey = 'question' | 'subject' | 'difficulty' | 'year';
type SortDir = 'asc' | 'desc';

export function QuestionsTable({ questions, paperById }: QuestionsTableProps) {
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: 'year', dir: 'desc' });
  const [search, setSearch] = useState('');
  const [reportTarget, setReportTarget] = useState<{ question: BankQuestion; paper: ExamPaper | undefined } | null>(null);

  const filtered = useMemo(() => {
    let result = questions;

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((qu) => qu.question.toLowerCase().includes(q));
    }

    // Sort
    return result.sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';

      if (sort.key === 'question') {
        aVal = a.question;
        bVal = b.question;
      } else if (sort.key === 'subject') {
        aVal = a.subject;
        bVal = b.subject;
      } else if (sort.key === 'difficulty') {
        const order = { easy: 0, medium: 1, hard: 2 };
        aVal = order[a.difficulty as keyof typeof order] ?? 0;
        bVal = order[b.difficulty as keyof typeof order] ?? 0;
      } else if (sort.key === 'year') {
        aVal = a.year ?? 0;
        bVal = b.year ?? 0;
      }

      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sort.dir === 'asc' ? cmp : -cmp;
    });
  }, [questions, search, sort]);

  const toggleSort = (key: SortKey) => {
    if (sort.key === key) {
      setSort({ key, dir: sort.dir === 'asc' ? 'desc' : 'asc' });
    } else {
      setSort({ key, dir: 'asc' });
    }
  };

  const SortIndicator = ({ column }: { column: SortKey }) => {
    if (sort.key !== column) return null;
    return <span className="ml-1 text-xs">{sort.dir === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="flex flex-col h-full gap-3 p-4">
      {/* Search */}
      <input
        type="text"
        placeholder="Search questions..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="px-3 py-2 border rounded text-sm dark:bg-slate-800 dark:border-slate-600"
      />

      {/* Results count */}
      <div className="text-xs text-gray-600 dark:text-gray-400">
        {filtered.length} of {questions.length} questions
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="sticky top-0 bg-gray-50 dark:bg-slate-800 border-b dark:border-slate-700">
            <tr>
              <th className="px-3 py-2 text-left font-semibold cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700" onClick={() => toggleSort('question')}>
                Question <SortIndicator column="question" />
              </th>
              <th className="px-3 py-2 text-left font-semibold w-32">
                Post
              </th>
              <th className="px-3 py-2 text-left font-semibold cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 w-20" onClick={() => toggleSort('subject')}>
                Subject <SortIndicator column="subject" />
              </th>
              <th className="px-3 py-2 text-left font-semibold cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 w-24" onClick={() => toggleSort('difficulty')}>
                Level <SortIndicator column="difficulty" />
              </th>
              <th className="px-3 py-2 text-left font-semibold cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 w-16" onClick={() => toggleSort('year')}>
                Year <SortIndicator column="year" />
              </th>
              <th className="px-3 py-2 text-center w-20">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((q) => {
              const paper = q.paperId ? paperById.get(q.paperId) : undefined;
              return (
                <tr key={q.id} className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800">
                  <td className="px-3 py-2 text-left">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {paper?.examType && <span className="font-medium">{paper.examType.replace('_', ' ')}</span>}
                      {paper?.examType && paper?.examName ? ' · ' : ''}
                      {paper?.examName}
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
                      onClick={() => setReportTarget({ question: q, paper })}
                      className="text-xs text-red-600 dark:text-red-400 hover:underline"
                    >
                      Report
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Report Modal */}
      {reportTarget && (
        <ReportModal
          question={reportTarget.question}
          paper={reportTarget.paper}
          onClose={() => setReportTarget(null)}
        />
      )}
    </div>
  );
}
