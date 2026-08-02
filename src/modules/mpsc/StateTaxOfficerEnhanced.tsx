import { useMemo, useState } from 'react';
import { sciencePrimers } from '@/data/banks';
import type { BankQuestion } from '@/data/banks/types';

interface Props {
  allQuestions: BankQuestion[];
}

type PrepTab = 'overview' | 'primers' | 'exam-browse' | 'yearly-browse' | 'mock' | 'progress';
type MockState = 'setup' | 'running' | 'review';

export function StateTaxOfficerEnhanced({ allQuestions }: Props) {
  const [prepTab, setPrepTab] = useState<PrepTab>('overview');
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [mockState, setMockState] = useState<MockState>('setup');
  const [mockAnswers, setMockAnswers] = useState<Record<number, number>>({});
  const [testQuestions, setTestQuestions] = useState<BankQuestion[]>([]);
  const [testResults, setTestResults] = useState<any>(null);

  const stateTaxQuestions = useMemo(
    () => allQuestions.filter((q) => q.source?.includes('State Tax Officer') || q.source?.includes('Inspector')),
    [allQuestions],
  );

  const years = useMemo(() => {
    const y = new Set<number>();
    stateTaxQuestions.forEach((q) => {
      if (q.year) y.add(q.year);
    });
    return Array.from(y).sort((a, b) => b - a);
  }, [stateTaxQuestions]);

  const exams = useMemo(() => {
    const e = new Set<string>();
    stateTaxQuestions.forEach((q) => {
      if (q.source) e.add(q.source);
    });
    return Array.from(e).sort();
  }, [stateTaxQuestions]);

  const unitCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    stateTaxQuestions.forEach((q) => {
      if (q.topic) counts[q.topic] = (counts[q.topic] || 0) + 1;
    });
    return counts;
  }, [stateTaxQuestions]);

  const filteredPrimers = useMemo(() => {
    if (!selectedUnit) return sciencePrimers;
    return sciencePrimers.filter((p: any) => p.subtopic.toLowerCase().includes(selectedUnit.toLowerCase()));
  }, [selectedUnit]);

  const startMockTest = (questions: BankQuestion[], testTitle: string) => {
    setTestQuestions(questions);
    setMockAnswers({});
    setTestResults(null);
    setMockState('running');
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

    setTestResults({
      correct,
      wrong,
      unattempted,
      score,
      total: testQuestions.length,
      percentage: ((score / testQuestions.length) * 100).toFixed(1),
    });

    setMockState('review');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Tab Navigation */}
      <div className="border-b overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
        <div className="flex gap-6 px-5 py-3">
          {(['overview', 'primers', 'exam-browse', 'yearly-browse', 'mock', 'progress'] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setPrepTab(t);
                setMockState('setup');
              }}
              className="text-sm font-medium whitespace-nowrap pb-2"
              style={{
                color: prepTab === t ? 'var(--accent)' : 'var(--text-secondary)',
                borderBottom: prepTab === t ? '2px solid var(--accent)' : '2px solid transparent',
              }}
            >
              {t === 'overview' && '📋 Overview'}
              {t === 'primers' && '📚 Primers'}
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
        {prepTab === 'overview' && <OverviewTab questions={stateTaxQuestions} unitCounts={unitCounts} />}
        {prepTab === 'primers' && <PrimersTab primers={filteredPrimers} selectedUnit={selectedUnit} onSelectUnit={setSelectedUnit} />}
        {prepTab === 'exam-browse' && <ExamBrowseTab questions={stateTaxQuestions} exams={exams} onStartTest={startMockTest} />}
        {prepTab === 'yearly-browse' && <YearlyBrowseTab questions={stateTaxQuestions} years={years} onStartTest={startMockTest} />}
        {prepTab === 'mock' && mockState === 'setup' && (
          <MockSetupTab questions={stateTaxQuestions} onStartTest={startMockTest} />
        )}
        {prepTab === 'mock' && mockState === 'running' && (
          <MockRunnerTab questions={testQuestions} answers={mockAnswers} onAnswer={(i, ans) => setMockAnswers({ ...mockAnswers, [i]: ans })} onSubmit={submitTest} />
        )}
        {prepTab === 'mock' && mockState === 'review' && (
          <MockReviewTab questions={testQuestions} answers={mockAnswers} results={testResults} onBack={() => setMockState('setup')} />
        )}
        {prepTab === 'progress' && <ProgressTab />}
      </div>
    </div>
  );
}

function OverviewTab({ questions, unitCounts }: { questions: BankQuestion[]; unitCounts: Record<string, number> }) {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">MPSC State Tax Officer · Group B Gazetted</h2>
        <p style={{ color: 'var(--text-secondary)' }} className="mb-4">
          Complete General Competitive exam preparation: General English, General Essay, and General Studies (I/II/III).
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Questions" value={questions.length} />
        <StatCard label="Years" value="2016-2025" />
        <StatCard label="Primers" value="80+" />
        <StatCard label="Topics" value={Object.keys(unitCounts).length.toString()} />
      </div>

      <div>
        <h3 className="font-semibold mb-3">Study Path:</h3>
        <ol className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <li><strong>1. Read Primers</strong> — Concept foundation for each topic</li>
          <li><strong>2. Browse by Exam/Year</strong> — See real papers and their difficulty</li>
          <li><strong>3. Take Mock Tests</strong> — Practice with real negative marking</li>
          <li><strong>4. Review Progress</strong> — Identify weak areas and improve</li>
        </ol>
      </div>
    </div>
  );
}

function PrimersTab({ primers, selectedUnit, onSelectUnit }: { primers: any[]; selectedUnit: string | null; onSelectUnit: (unit: string | null) => void }) {
  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => onSelectUnit(null)}
          className="px-3 py-1 rounded-full text-sm font-medium"
          style={{
            background: selectedUnit === null ? 'var(--accent)' : 'var(--bg-panel-elev)',
            color: selectedUnit === null ? '#fff' : 'var(--text-primary)',
          }}
        >
          All
        </button>
        {['Physics', 'Chemistry', 'Biology', 'Earth', 'Astronomy'].map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectUnit(cat)}
            className="px-3 py-1 rounded-full text-sm font-medium"
            style={{
              background: selectedUnit === cat ? 'var(--accent)' : 'var(--bg-panel-elev)',
              color: selectedUnit === cat ? '#fff' : 'var(--text-primary)',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {primers.map((p: any, i: number) => (
          <div key={i} className="p-4 rounded-lg" style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)' }}>
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-sm">{p.subtopic}</h3>
              <span className="text-xs px-2 py-1 rounded" style={{ background: p.priority === 'critical' ? '#ff4444' : '#666', color: '#fff' }}>
                {p.priority}
              </span>
            </div>
            <p className="text-sm mb-2">{p.primer}</p>
            {p.analogy && <div className="text-sm text-xs p-2 rounded mb-2" style={{ background: 'var(--bg)', borderLeft: '3px solid var(--accent)' }}>💡 {p.analogy}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function ExamBrowseTab({ questions, exams, onStartTest }: { questions: BankQuestion[]; exams: string[]; onStartTest: (q: BankQuestion[], title: string) => void }) {
  const [selectedExam, setSelectedExam] = useState<string | null>(null);

  const filtered = useMemo(
    () => (selectedExam ? questions.filter((q) => q.source === selectedExam) : questions),
    [questions, selectedExam],
  );

  return (
    <div className="max-w-4xl space-y-6">
      <h2 className="text-lg font-semibold">Browse by Exam</h2>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {exams.map((exam) => {
          const count = questions.filter((q) => q.source === exam).length;
          return (
            <div key={exam} className="p-4 rounded-lg" style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm">{exam}</div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {count} questions
                  </div>
                </div>
                <button
                  onClick={() => onStartTest(questions.filter((q) => q.source === exam), exam)}
                  className="px-3 py-1 rounded text-sm font-medium"
                  style={{ background: 'var(--accent)', color: '#fff' }}
                >
                  Start Test
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function YearlyBrowseTab({ questions, years, onStartTest }: { questions: BankQuestion[]; years: number[]; onStartTest: (q: BankQuestion[], title: string) => void }) {
  return (
    <div className="max-w-4xl space-y-6">
      <h2 className="text-lg font-semibold">Browse by Year</h2>

      <div className="space-y-2">
        {years.map((year) => {
          const count = questions.filter((q) => q.year === year).length;
          return (
            <div key={year} className="p-4 rounded-lg" style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm">{year}</div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {count} questions
                  </div>
                </div>
                <button
                  onClick={() => onStartTest(questions.filter((q) => q.year === year), `${year} Papers`)}
                  className="px-3 py-1 rounded text-sm font-medium"
                  style={{ background: 'var(--accent)', color: '#fff' }}
                >
                  Start Test
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MockSetupTab({ questions, onStartTest }: { questions: BankQuestion[]; onStartTest: (q: BankQuestion[], title: string) => void }) {
  const [testSize, setTestSize] = useState(25);

  const shuffled = useMemo(() => {
    const arr = [...questions].sort(() => Math.random() - 0.5);
    return arr.slice(0, testSize);
  }, [questions, testSize]);

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-lg font-semibold">Mock Test Setup</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-3">Questions:</label>
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
          onClick={() => onStartTest(shuffled, `Mock Test (${testSize}Q)`)}
          className="px-4 py-2 rounded-md font-medium w-full"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          Start Test ({testSize} Questions)
        </button>

        <div className="p-4 rounded-lg text-sm" style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
          <p>
            <strong>Real marking:</strong> Correct = +1, Wrong = -1/3, Blank = 0
          </p>
        </div>
      </div>
    </div>
  );
}

function MockRunnerTab({ questions, answers, onAnswer, onSubmit }: { questions: BankQuestion[]; answers: Record<number, number>; onAnswer: (i: number, ans: number) => void; onSubmit: () => void }) {
  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Test in Progress</h2>
        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {Object.keys(answers).length} / {questions.length} answered
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((q, i) => (
          <div key={i} className="p-4 rounded-lg" style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)' }}>
            <div className="font-semibold text-sm mb-3">
              Q{i + 1}: {q.question}
            </div>
            <div className="space-y-2">
              {q.options.map((opt, j) => (
                <label key={j} className="flex items-center p-2 rounded cursor-pointer" style={{ background: answers[i] === j ? 'var(--accent)' : 'transparent' }}>
                  <input
                    type="radio"
                    name={`q-${i}`}
                    value={j}
                    checked={answers[i] === j}
                    onChange={() => onAnswer(i, j)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  <span className="text-sm" style={{ color: answers[i] === j ? 'var(--accent)' : 'var(--text-primary)' }}>
                    {String.fromCharCode(97 + j)}) {opt}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button onClick={onSubmit} className="px-4 py-2 rounded-md font-medium w-full" style={{ background: 'var(--accent)', color: '#fff' }}>
        Submit Test
      </button>
    </div>
  );
}

function MockReviewTab({ questions, answers, results, onBack }: { questions: BankQuestion[]; answers: Record<number, number>; results: any; onBack: () => void }) {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Test Results</h2>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-lg text-center" style={{ background: 'var(--bg-panel-elev)' }}>
            <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
              {results.score.toFixed(1)}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Score</div>
          </div>
          <div className="p-4 rounded-lg text-center" style={{ background: 'var(--bg-panel-elev)' }}>
            <div className="text-2xl font-bold" style={{ color: '#4CAF50' }}>
              {results.correct}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Correct</div>
          </div>
          <div className="p-4 rounded-lg text-center" style={{ background: 'var(--bg-panel-elev)' }}>
            <div className="text-2xl font-bold" style={{ color: '#F44336' }}>
              {results.wrong}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Wrong</div>
          </div>
          <div className="p-4 rounded-lg text-center" style={{ background: 'var(--bg-panel-elev)' }}>
            <div className="text-2xl font-bold" style={{ color: '#FF9800' }}>
              {results.unattempted}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Blank</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">Review Answers:</h3>
        {questions.map((q, i) => {
          const answered = i in answers;
          const correct = answers[i] === q.answerIndex;
          return (
            <div key={i} className="p-4 rounded-lg" style={{ background: 'var(--bg-panel-elev)', border: `2px solid ${!answered ? '#FF9800' : correct ? '#4CAF50' : '#F44336'}` }}>
              <div className="font-semibold text-sm mb-2">
                Q{i + 1}: {q.question}
              </div>
              <div className="text-sm mb-2">
                {q.options.map((opt, j) => (
                  <div
                    key={j}
                    style={{
                      color: j === q.answerIndex ? '#4CAF50' : j === answers[i] && !correct ? '#F44336' : 'var(--text-primary)',
                      fontWeight: j === q.answerIndex || (j === answers[i] && !correct) ? 'bold' : 'normal',
                    }}
                  >
                    {String.fromCharCode(97 + j)}) {opt}
                  </div>
                ))}
              </div>
              <div className="text-xs p-2 rounded" style={{ background: 'var(--bg)', color: 'var(--text-secondary)' }}>
                <strong>Explanation:</strong> {q.explanation}
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={onBack} className="px-4 py-2 rounded-md font-medium" style={{ background: 'var(--border)', color: 'var(--text-primary)' }}>
        Take Another Test
      </button>
    </div>
  );
}

function ProgressTab() {
  return (
    <div className="max-w-4xl space-y-6">
      <h2 className="text-lg font-semibold">Study Progress</h2>
      <div className="p-4 rounded-lg" style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Progress analytics coming soon. Your test attempts will be tracked here.</p>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-3 rounded-lg" style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)' }}>
      <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
        {value}
      </div>
      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </div>
    </div>
  );
}
