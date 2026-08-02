import { useMemo, useState } from 'react';
import { allPrimers, PRIMER_CATEGORIES, UNIT_LABELS } from '@/data/banks';
import type { BankQuestion, ExamPaper } from '@/data/banks/types';
import './state-tax-officer.css';

interface Props {
  allQuestions: BankQuestion[];
  papers: ExamPaper[];
}

type PrepTab = 'overview' | 'primers' | 'bank' | 'exam-browse' | 'yearly-browse' | 'mock' | 'progress';
type MockState = 'setup' | 'running' | 'review';
interface MockResults {
  correct: number; wrong: number; unattempted: number; score: number; total: number;
}

// Maps both BankQuestion.topic (snake_case, e.g. "gs2_economy") and primer
// `unit` codes (upper-dash, e.g. "GS2-ECONOMY") to one of the CSS subject
// classes defined in state-tax-officer.css, so a topic is always the same
// color whether it's shown on a question card or a primer card.
function subjectClass(unitOrTopic: string | undefined): string {
  const key = (unitOrTopic ?? '').toLowerCase().replace(/-/g, '_');
  if (key.startsWith('eng')) return 'sto-unit-english';
  if (key === 'gs1_current') return 'sto-unit-current';
  if (key === 'gs1_history') return 'sto-unit-history';
  if (key === 'gs2_economy') return 'sto-unit-economy';
  if (key === 'gs2_geography') return 'sto-unit-geography';
  if (key === 'gs2_polity') return 'sto-unit-polity';
  if (key === 'gs3_mizoram') return 'sto-unit-mizoram';
  if (key === 'gs3_scitech') return 'sto-unit-scitech';
  if (key === 'gs3_aptitude') return 'sto-unit-aptitude';
  if (key === 'essay') return 'sto-unit-essay';
  return '';
}

function confidenceLabel(q: BankQuestion): 'high' | 'medium' | 'low' {
  // BankQuestion has no confidence field of its own; difficulty stands in
  // (mirrors the source data: high-confidence answers were marked 'medium'
  // difficulty, low-confidence 'hard' — see mpsc-state-tax-prep SOLVE_INSTRUCTIONS).
  if (q.difficulty === 'hard') return 'low';
  if (q.difficulty === 'easy') return 'high';
  return 'medium';
}

export function StateTaxOfficerEnhanced({ allQuestions, papers }: Props) {
  const [prepTab, setPrepTab] = useState<PrepTab>('overview');
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [mockState, setMockState] = useState<MockState>('setup');
  const [mockAnswers, setMockAnswers] = useState<Record<number, number>>({});
  const [testQuestions, setTestQuestions] = useState<BankQuestion[]>([]);
  const [testResults, setTestResults] = useState<MockResults | null>(null);

  // Every question in this bank already IS the State Tax Officer prep set —
  // no further source filtering needed (the old q.source-based filter here
  // was always a no-op/broken since every row shares one hardcoded source).
  // Essay/précis-letter items are "pick a topic and write" prompts stored
  // with mcq-shaped options for display purposes — they have no single
  // correct answerIndex, so they can't be scored. Excluded here rather than
  // in the data so a future "descriptive questions" viewer can still use them.
  const stateTaxQuestions = useMemo(
    () => allQuestions.filter((q) => q.topic !== 'essay' && q.topic !== 'eng_precis_letter'),
    [allQuestions],
  );

  // Real per-question exam name comes from the linked ExamPaper via paperId,
  // not from BankQuestion.source (which is the same string on every row).
  const examByPaperId = useMemo(() => {
    const m = new Map<string, string>();
    papers.forEach((p) => m.set(p.id, p.examName));
    return m;
  }, [papers]);

  const questionExamName = (q: BankQuestion) => (q.paperId && examByPaperId.get(q.paperId)) || 'Unknown exam';
  const questionSitting = (q: BankQuestion) => (q.paperId && papers.find((p) => p.id === q.paperId)) || null;

  const years = useMemo(() => {
    const y = new Set<number>();
    stateTaxQuestions.forEach((q) => {
      if (q.year) y.add(q.year);
    });
    return Array.from(y).sort((a, b) => b - a);
  }, [stateTaxQuestions]);

  const exams = useMemo(() => {
    const e = new Set<string>();
    papers.forEach((p) => e.add(p.examName));
    return Array.from(e).sort();
  }, [papers]);

  const unitCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    stateTaxQuestions.forEach((q) => {
      if (q.topic) counts[q.topic] = (counts[q.topic] || 0) + 1;
    });
    return counts;
  }, [stateTaxQuestions]);

  const filteredPrimers = useMemo(() => {
    if (!selectedUnit) return allPrimers;
    return allPrimers.filter((p) => p.unit === selectedUnit);
  }, [selectedUnit]);

  const startMockTest = (questions: BankQuestion[]) => {
    setTestQuestions(questions);
    setMockAnswers({});
    setTestResults(null);
    setMockState('running');
    setPrepTab('mock');
  };

  const submitTest = () => {
    let correct = 0;
    let wrong = 0;
    let unattempted = 0;

    testQuestions.forEach((q, i) => {
      if (!(i in mockAnswers)) {
        unattempted++;
      } else if (mockAnswers[i] === q.answerIndex) {
        correct++;
      } else {
        wrong++;
      }
    });

    const penalty = 1 / 3; // Real MPSC negative marking
    const score = correct - wrong * penalty;

    setTestResults({ correct, wrong, unattempted, score, total: testQuestions.length });
    setMockState('review');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Tab Navigation */}
      <div className="border-b overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
        <div className="flex gap-6 px-5 py-3">
          {(['overview', 'primers', 'bank', 'exam-browse', 'yearly-browse', 'mock', 'progress'] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setPrepTab(t);
                if (t !== 'mock') setMockState('setup');
              }}
              className="text-sm font-medium whitespace-nowrap pb-2"
              style={{
                color: prepTab === t ? 'var(--accent)' : 'var(--text-secondary)',
                borderBottom: prepTab === t ? '2px solid var(--accent)' : '2px solid transparent',
              }}
            >
              {t === 'overview' && '📋 Overview'}
              {t === 'primers' && '📚 Primers'}
              {t === 'bank' && '❓ Question Bank'}
              {t === 'exam-browse' && '🏛️ By Exam'}
              {t === 'yearly-browse' && '📅 By Year'}
              {t === 'mock' && '🧪 Mock Tests'}
              {t === 'progress' && '📊 Progress'}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto px-5 py-5">
        {prepTab === 'overview' && <OverviewTab questions={stateTaxQuestions} unitCounts={unitCounts} exams={exams} />}
        {prepTab === 'primers' && <PrimersTab primers={filteredPrimers} selectedUnit={selectedUnit} onSelectUnit={setSelectedUnit} />}
        {prepTab === 'bank' && (
          <QuestionBankTab
            questions={stateTaxQuestions}
            unitCounts={unitCounts}
            questionExamName={questionExamName}
            questionSitting={questionSitting}
          />
        )}
        {prepTab === 'exam-browse' && (
          <ExamBrowseTab questions={stateTaxQuestions} exams={exams} questionExamName={questionExamName} onStartTest={startMockTest} />
        )}
        {prepTab === 'yearly-browse' && <YearlyBrowseTab questions={stateTaxQuestions} years={years} onStartTest={startMockTest} />}
        {prepTab === 'mock' && mockState === 'setup' && (
          <MockSetupTab questions={stateTaxQuestions} onStartTest={startMockTest} />
        )}
        {prepTab === 'mock' && mockState === 'running' && (
          <MockRunnerTab questions={testQuestions} answers={mockAnswers} onAnswer={(i, ans) => setMockAnswers({ ...mockAnswers, [i]: ans })} onSubmit={submitTest} />
        )}
        {prepTab === 'mock' && mockState === 'review' && testResults && (
          <MockReviewTab questions={testQuestions} answers={mockAnswers} results={testResults} onBack={() => setMockState('setup')} />
        )}
        {prepTab === 'progress' && <ProgressTab />}
      </div>
    </div>
  );
}

function OverviewTab({ questions, unitCounts, exams }: { questions: BankQuestion[]; unitCounts: Record<string, number>; exams: string[] }) {
  const maxCount = Math.max(1, ...Object.values(unitCounts));
  const totalPrimers = allPrimers.length;

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <div className="text-[0.68rem] font-bold tracking-widest uppercase mb-1" style={{ color: 'var(--accent)' }}>
          MPSC State Tax Officer · Group B Gazetted, Finance Dept
        </div>
        <h2 className="text-xl font-semibold mb-2">Complete General Competitive exam preparation</h2>
        <p style={{ color: 'var(--text-secondary)' }} className="mb-4 text-sm">
          General English, General Essay, and General Studies Papers I/II/III — pulled from every Mizoram PSC exam
          that used this identical pattern: Inspector of Taxes, Inspector of Excise &amp; Narcotics, and the Group B
          Combined sitting where State Tax Officer candidates themselves sat these exact papers.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="sto-stat"><b>{questions.length}</b><span>Questions</span></div>
        <div className="sto-stat"><b>{exams.length}</b><span>Exams</span></div>
        <div className="sto-stat"><b>{totalPrimers}</b><span>Primers</span></div>
        <div className="sto-stat"><b>{Object.keys(unitCounts).length}</b><span>Topics</span></div>
      </div>

      <div>
        <h3 className="font-semibold mb-3 text-sm">Study path</h3>
        <ol className="space-y-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <li><strong style={{ color: 'var(--text-primary)' }}>1. Read Primers</strong> — build the concept foundation for a unit before drilling it</li>
          <li><strong style={{ color: 'var(--text-primary)' }}>2. Search the Question Bank</strong> — every solved question, filterable and searchable</li>
          <li><strong style={{ color: 'var(--text-primary)' }}>3. Browse by Exam or Year</strong> — see one real paper's difficulty at a time</li>
          <li><strong style={{ color: 'var(--text-primary)' }}>4. Take Mock Tests</strong> — timed practice under real negative marking (−1/3 per wrong answer)</li>
        </ol>
      </div>

      <div>
        <h3 className="font-semibold mb-1 text-sm">Where the questions come from</h3>
        <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
          How many solved questions exist for each topic — a short bar means lean harder on the primer for that unit
          instead of expecting to drill your way through it.
        </p>
        <div className="sto-card">
          {Object.entries(unitCounts)
            .sort(([, a], [, b]) => b - a)
            .map(([topic, count]) => (
              <div key={topic} className={`sto-weight-row ${subjectClass(topic)}`}>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="sto-pill sto-subject">{topic.replace(/_/g, ' ')}</span>
                  <div className="sto-weight-track flex-1" style={{ width: 'min(38vw, 220px)' }}>
                    <div className="sto-weight-bar" style={{ width: `${Math.max(4, (count / maxCount) * 100)}%` }} />
                  </div>
                </div>
                <span className="sto-weight-n">{count} Qs</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function PrimersTab({ primers, selectedUnit, onSelectUnit }: { primers: typeof allPrimers; selectedUnit: string | null; onSelectUnit: (unit: string | null) => void }) {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-wrap gap-2 mb-2">
        <button
          onClick={() => onSelectUnit(null)}
          className="px-3 py-1 rounded-full text-sm font-medium"
          style={{
            background: selectedUnit === null ? 'var(--accent)' : 'var(--bg-panel-elev)',
            color: selectedUnit === null ? '#fff' : 'var(--text-primary)',
          }}
        >
          All ({allPrimers.length})
        </button>
        {PRIMER_CATEGORIES.map((unit) => (
          <button
            key={unit}
            onClick={() => onSelectUnit(unit)}
            className="px-3 py-1 rounded-full text-sm font-medium"
            style={{
              background: selectedUnit === unit ? 'var(--accent)' : 'var(--bg-panel-elev)',
              color: selectedUnit === unit ? '#fff' : 'var(--text-primary)',
            }}
          >
            {UNIT_LABELS[unit] ?? unit}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {primers.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No primers for this unit yet.</p>
        ) : (
          primers.map((p, i) => (
            <div key={i} className="sto-card space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`sto-pill sto-subject ${subjectClass(p.unit)}`}>{p.unit}</span>
                  <h3 className="font-semibold text-sm">{p.subtopic}</h3>
                </div>
                <span className={`sto-pill sto-priority-${p.priority} shrink-0`}>{p.priority}</span>
              </div>
              <p className="text-sm">{p.primer}</p>
              {p.analogy && <div className="sto-analogy">{p.analogy}</div>}
              {p.traps && p.traps.length > 0 && (
                <div className="sto-traps">
                  <ul>{p.traps.map((t, j) => <li key={j}>{t}</li>)}</ul>
                </div>
              )}
              {p.formulae && p.formulae.length > 0 && (
                <div className="sto-formulae">{p.formulae.map((f, j) => <code key={j}>{f}</code>)}</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function QuestionBankTab({
  questions, unitCounts, questionExamName, questionSitting,
}: {
  questions: BankQuestion[];
  unitCounts: Record<string, number>;
  questionExamName: (q: BankQuestion) => string;
  questionSitting: (q: BankQuestion) => ExamPaper | null;
}) {
  const [topicFilter, setTopicFilter] = useState('');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return questions.filter((q) => {
      if (topicFilter && q.topic !== topicFilter) return false;
      if (!term) return true;
      return (
        q.question.toLowerCase().includes(term) ||
        q.options.some((o) => o.toLowerCase().includes(term)) ||
        (q.topicLabel ?? '').toLowerCase().includes(term)
      );
    });
  }, [questions, topicFilter, search]);

  const visible = filtered.slice(0, 100);

  const toggle = (i: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  return (
    <div className="max-w-3xl space-y-4">
      <h2 className="text-lg font-semibold">Question Bank</h2>
      <div className="flex flex-wrap gap-2 items-center">
        <select
          value={topicFilter}
          onChange={(e) => setTopicFilter(e.target.value)}
          className="px-2.5 py-1.5 rounded-md text-sm"
          style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
        >
          <option value="">Any topic</option>
          {Object.keys(unitCounts).sort().map((t) => (
            <option key={t} value={t}>{t.replace(/_/g, ' ')} ({unitCounts[t]})</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search stems, options, topics…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-2.5 py-1.5 rounded-md text-sm flex-1 min-w-[200px]"
          style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
        />
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {filtered.length} question{filtered.length === 1 ? '' : 's'}{filtered.length > 100 ? ' (showing first 100)' : ''}
        </span>
      </div>

      <div className="space-y-3">
        {visible.map((q, i) => {
          const isOpen = expanded.has(i);
          const paper = questionSitting(q);
          return (
            <div key={q.id} className="sto-card space-y-2">
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className={`sto-pill sto-subject ${subjectClass(q.topic)}`}>{q.topic?.replace(/_/g, ' ')}</span>
                <span className={`sto-pill sto-conf-${confidenceLabel(q)}`}>{confidenceLabel(q)} confidence</span>
                <span className="ml-auto" style={{ color: 'var(--text-secondary)' }}>
                  {questionExamName(q)}{paper?.year ? `, ${paper.year}` : ''}
                </span>
              </div>
              <p className="text-sm font-medium">{q.question}</p>
              <div className="space-y-1.5">
                {q.options.map((opt, j) => (
                  <div key={j} className={`sto-opt ${j === q.answerIndex ? 'sto-opt-correct' : ''}`}>
                    <span className="sto-opt-letter">{String.fromCharCode(97 + j)}</span>
                    <span>{opt}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => toggle(i)}
                className="text-xs font-medium"
                style={{ color: 'var(--accent)' }}
              >
                {isOpen ? '▾ Hide explanation' : '▸ Show explanation'}
              </button>
              {isOpen && (
                <div className="text-sm p-2.5 rounded" style={{ background: 'var(--bg-app)', color: 'var(--text-secondary)' }}>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
        {visible.length === 0 && (
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No questions match these filters.</p>
        )}
      </div>
    </div>
  );
}

function ExamBrowseTab({
  questions, exams, questionExamName, onStartTest,
}: {
  questions: BankQuestion[]; exams: string[]; questionExamName: (q: BankQuestion) => string; onStartTest: (q: BankQuestion[]) => void;
}) {
  return (
    <div className="max-w-3xl space-y-6">
      <h2 className="text-lg font-semibold">Browse by exam</h2>

      <div className="space-y-2">
        {exams.map((exam) => {
          const examQuestions = questions.filter((q) => questionExamName(q) === exam);
          return (
            <div key={exam} className="sto-card flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-sm">{exam}</div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {examQuestions.length} questions
                </div>
              </div>
              <button
                onClick={() => onStartTest(examQuestions)}
                className="px-3 py-1.5 rounded text-sm font-medium shrink-0"
                style={{ background: 'var(--accent)', color: '#fff' }}
              >
                Start Test
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function YearlyBrowseTab({ questions, years, onStartTest }: { questions: BankQuestion[]; years: number[]; onStartTest: (q: BankQuestion[]) => void }) {
  return (
    <div className="max-w-3xl space-y-6">
      <h2 className="text-lg font-semibold">Browse by year</h2>

      <div className="space-y-2">
        {years.map((year) => {
          const yearQuestions = questions.filter((q) => q.year === year);
          return (
            <div key={year} className="sto-card flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-sm">{year}</div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {yearQuestions.length} questions
                </div>
              </div>
              <button
                onClick={() => onStartTest(yearQuestions)}
                className="px-3 py-1.5 rounded text-sm font-medium shrink-0"
                style={{ background: 'var(--accent)', color: '#fff' }}
              >
                Start Test
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MockSetupTab({ questions, onStartTest }: { questions: BankQuestion[]; onStartTest: (q: BankQuestion[]) => void }) {
  const [testSize, setTestSize] = useState(25);

  const pickRandom = () => {
    const arr = [...questions].sort(() => Math.random() - 0.5);
    onStartTest(arr.slice(0, testSize));
  };

  return (
    <div className="max-w-lg space-y-6">
      <h2 className="text-lg font-semibold">Mock test setup</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Questions</label>
          <select
            value={testSize}
            onChange={(e) => setTestSize(Number(e.target.value))}
            className="px-3 py-2 rounded-md text-sm w-full"
            style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          >
            <option value={10}>10 (quick)</option>
            <option value={25}>25</option>
            <option value={50}>50 (half paper)</option>
            <option value={100}>100+ (full paper)</option>
          </select>
        </div>

        <button
          onClick={pickRandom}
          className="px-4 py-2 rounded-md font-medium w-full"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          Start test ({testSize} questions)
        </button>

        <div className="sto-card text-sm" style={{ color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--text-primary)' }}>Real negative marking:</strong> correct = +1, wrong = −1/3, blank = 0 —
          matching the actual MPSC exam rules.
        </div>
      </div>
    </div>
  );
}

function MockRunnerTab({ questions, answers, onAnswer, onSubmit }: { questions: BankQuestion[]; answers: Record<number, number>; onAnswer: (i: number, ans: number) => void; onSubmit: () => void }) {
  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-center justify-between sticky top-0 py-2 -mx-1 px-1" style={{ background: 'var(--bg-app)', zIndex: 1 }}>
        <h2 className="text-lg font-semibold">Test in progress</h2>
        <div className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
          {Object.keys(answers).length} / {questions.length} answered
        </div>
      </div>

      <div className="space-y-3">
        {questions.map((q, i) => (
          <div key={q.id} className="sto-card space-y-2.5">
            <div className="font-semibold text-sm">Q{i + 1}. {q.question}</div>
            <div className="space-y-1.5">
              {q.options.map((opt, j) => {
                const selected = answers[i] === j;
                return (
                  <label
                    key={j}
                    className={`sto-opt cursor-pointer ${selected ? 'sto-opt-correct' : ''}`}
                    style={selected ? undefined : { cursor: 'pointer' }}
                  >
                    <input
                      type="radio"
                      name={`q-${i}`}
                      checked={selected}
                      onChange={() => onAnswer(i, j)}
                      style={{ marginTop: 2 }}
                    />
                    <span>{String.fromCharCode(97 + j)}) {opt}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button onClick={onSubmit} className="px-4 py-2 rounded-md font-medium w-full" style={{ background: 'var(--accent)', color: '#fff' }}>
        Submit test
      </button>
    </div>
  );
}

function MockReviewTab({ questions, answers, results, onBack }: { questions: BankQuestion[]; answers: Record<number, number>; results: MockResults; onBack: () => void }) {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Test results</h2>
        <div className="grid grid-cols-4 gap-3">
          <div className="sto-stat text-center"><b>{results.score.toFixed(2)}</b><span>Score</span></div>
          <div className="sto-stat text-center"><b style={{ color: '#2e7d4f' }}>{results.correct}</b><span>Correct</span></div>
          <div className="sto-stat text-center"><b style={{ color: '#a33232' }}>{results.wrong}</b><span>Wrong</span></div>
          <div className="sto-stat text-center"><b style={{ color: '#9a6b12' }}>{results.unattempted}</b><span>Blank</span></div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-sm">Review answers</h3>
        {questions.map((q, i) => {
          const answered = i in answers;
          const isCorrect = answers[i] === q.answerIndex;
          return (
            <div
              key={q.id}
              className="sto-card space-y-2"
              style={{ borderColor: !answered ? '#9a6b12' : isCorrect ? '#2e7d4f' : '#a33232', borderWidth: 2 }}
            >
              <div className="font-semibold text-sm">Q{i + 1}. {q.question}</div>
              <div className="space-y-1.5">
                {q.options.map((opt, j) => {
                  const isRight = j === q.answerIndex;
                  const isWrongPick = j === answers[i] && !isCorrect;
                  return (
                    <div key={j} className={`sto-opt ${isRight ? 'sto-opt-correct' : isWrongPick ? 'sto-opt-wrong-pick' : ''}`}>
                      <span className="sto-opt-letter">{String.fromCharCode(97 + j)}</span>
                      <span>{opt}</span>
                    </div>
                  );
                })}
              </div>
              <div className="text-xs p-2 rounded" style={{ background: 'var(--bg-app)', color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Explanation:</strong> {q.explanation}
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={onBack} className="px-4 py-2 rounded-md font-medium" style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
        Take another test
      </button>
    </div>
  );
}

function ProgressTab() {
  return (
    <div className="max-w-3xl space-y-6">
      <h2 className="text-lg font-semibold">Study progress</h2>
      <div className="sto-card">
        <p style={{ color: 'var(--text-secondary)' }}>Progress analytics coming soon. Your test attempts will be tracked here.</p>
      </div>
    </div>
  );
}
