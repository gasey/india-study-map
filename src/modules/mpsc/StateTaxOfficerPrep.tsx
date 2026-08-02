import { useMemo, useState } from 'react';
import { sciencePrimers } from '@/data/banks';
import type { BankQuestion } from '@/data/banks/types';

interface Props {
  allQuestions: BankQuestion[];
}

type PrepTab = 'overview' | 'primers' | 'questions' | 'mock' | 'progress';

export function StateTaxOfficerPrep({ allQuestions }: Props) {
  const [prepTab, setPrepTab] = useState<PrepTab>('overview');
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);

  const stateTaxQuestions = useMemo(
    () => allQuestions.filter((q) => q.source?.includes('State Tax Officer') || q.source?.includes('Inspector of Taxes')),
    [allQuestions],
  );

  const unitCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    stateTaxQuestions.forEach((q) => {
      if (q.topic) {
        counts[q.topic] = (counts[q.topic] || 0) + 1;
      }
    });
    return counts;
  }, [stateTaxQuestions]);

  const filteredPrimers = useMemo(() => {
    if (!selectedUnit) return sciencePrimers;
    return sciencePrimers.filter((p: any) => p.subtopic.toLowerCase().includes(selectedUnit.toLowerCase()));
  }, [selectedUnit]);

  return (
    <div className="flex flex-col h-full">
      {/* Tab Navigation */}
      <div className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex gap-6 px-5 py-3 overflow-x-auto">
          {(['overview', 'primers', 'questions', 'mock', 'progress'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setPrepTab(t)}
              className="text-sm font-medium whitespace-nowrap pb-2"
              style={{
                color: prepTab === t ? 'var(--accent)' : 'var(--text-secondary)',
                borderBottom: prepTab === t ? '2px solid var(--accent)' : '2px solid transparent',
              }}
            >
              {t === 'overview' && '📋 Overview'}
              {t === 'primers' && '📚 Primers'}
              {t === 'questions' && `❓ Questions (${stateTaxQuestions.length})`}
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
        {prepTab === 'questions' && <QuestionsTab questions={stateTaxQuestions} unitCounts={unitCounts} />}
        {prepTab === 'mock' && <MockTab questions={stateTaxQuestions} />}
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
          Comprehensive preparation guide for the General Competitive exam pattern: General English, General Essay, and General Studies (I/II/III).
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Questions" value={questions.length} />
        <StatCard label="Exam Papers" value="23" />
        <StatCard label="Concept Primers" value={sciencePrimers.length.toString()} />
        <StatCard label="Subject Areas" value={Object.keys(unitCounts).length.toString()} />
      </div>

      <div>
        <h3 className="font-semibold mb-3">How to use this guide:</h3>
        <ol className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <li>
            <strong>1. Read Primers:</strong> Start with concept primers for each topic to build foundational knowledge.
          </li>
          <li>
            <strong>2. Drill Questions:</strong> Browse and solve real past questions filtered by topic or exam.
          </li>
          <li>
            <strong>3. Take Mock Tests:</strong> Full-paper tests with real negative marking (-1/3 per wrong answer).
          </li>
          <li>
            <strong>4. Track Progress:</strong> Monitor your performance and identify weak areas.
          </li>
          <li>
            <strong>5. Revisit & Refine:</strong> Return to primers for topics where you're struggling.
          </li>
        </ol>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Topics covered:</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.entries(unitCounts)
            .sort(([, a], [, b]) => b - a)
            .map(([unit, count]) => (
              <div key={unit} className="text-sm p-2 rounded" style={{ background: 'var(--bg-panel-elev)' }}>
                <div className="font-medium capitalize">{unit.replace('_', ' ')}</div>
                <div style={{ color: 'var(--text-secondary)' }}>{count} questions</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function PrimersTab({ primers, selectedUnit, onSelectUnit }: { primers: any[]; selectedUnit: string | null; onSelectUnit: (unit: string | null) => void }) {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Concept Primers</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => onSelectUnit(null)}
            className="px-3 py-1 rounded-full text-sm font-medium"
            style={{
              background: selectedUnit === null ? 'var(--accent)' : 'var(--bg-panel-elev)',
              color: selectedUnit === null ? '#fff' : 'var(--text-primary)',
            }}
          >
            All Topics
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
      </div>

      <div className="space-y-4">
        {primers.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No primers found for this category.</p>
        ) : (
          primers.map((p: any, i: number) => (
            <div key={i} className="p-4 rounded-lg" style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)' }}>
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold">{p.subtopic}</h3>
                <span
                  className="text-xs px-2 py-1 rounded"
                  style={{
                    background: p.priority === 'critical' ? '#ff4444' : p.priority === 'high' ? '#ff8800' : '#666',
                    color: '#fff',
                  }}
                >
                  {p.priority}
                </span>
              </div>
              <p className="text-sm mb-3">{p.primer}</p>
              {p.analogy && (
                <div className="text-sm p-2 mb-3 rounded" style={{ background: 'var(--bg)', borderLeft: '3px solid var(--accent)' }}>
                  <strong>💡 Remember:</strong> {p.analogy}
                </div>
              )}
              {p.traps && p.traps.length > 0 && (
                <div className="text-sm space-y-1">
                  <strong>⚠️ Common traps:</strong>
                  <ul style={{ color: 'var(--text-secondary)' }}>
                    {p.traps.map((trap: string, j: number) => (
                      <li key={j}>• {trap}</li>
                    ))}
                  </ul>
                </div>
              )}
              {p.formulae && p.formulae.length > 0 && (
                <div className="text-xs mt-3 p-2 font-mono" style={{ background: 'var(--bg)', borderRadius: '4px' }}>
                  {p.formulae.map((f: string, j: number) => (
                    <div key={j}>{f}</div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function QuestionsTab({ questions, unitCounts }: { questions: BankQuestion[]; unitCounts: Record<string, number> }) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const filtered = useMemo(
    () => (selectedTopic ? questions.filter((q) => q.topic === selectedTopic) : questions),
    [questions, selectedTopic],
  );

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Question Bank</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
          <button
            onClick={() => setSelectedTopic(null)}
            className="px-3 py-2 rounded text-sm font-medium"
            style={{
              background: selectedTopic === null ? 'var(--accent)' : 'var(--bg-panel-elev)',
              color: selectedTopic === null ? '#fff' : 'var(--text-primary)',
            }}
          >
            All ({questions.length})
          </button>
          {Object.entries(unitCounts).map(([topic, count]) => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className="px-3 py-2 rounded text-sm font-medium text-left"
              style={{
                background: selectedTopic === topic ? 'var(--accent)' : 'var(--bg-panel-elev)',
                color: selectedTopic === topic ? '#fff' : 'var(--text-primary)',
              }}
            >
              {topic} ({count})
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filtered.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No questions in this category.</p>
        ) : (
          filtered.map((q, i) => (
            <div key={i} className="p-3 rounded-lg text-sm" style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)' }}>
              <div className="font-semibold mb-1 line-clamp-2">{q.question}</div>
              <div className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                {q.source} · {q.year}
              </div>
              <div className="space-y-1 text-xs">
                {q.options.map((opt, j) => (
                  <div key={j} style={{ color: j === q.answerIndex ? 'var(--accent)' : 'var(--text-secondary)' }}>
                    {String.fromCharCode(97 + j)}) {opt}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function MockTab({ questions }: { questions: BankQuestion[] }) {
  const [testSize, setTestSize] = useState(25);

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Mock Tests</h2>
        <p style={{ color: 'var(--text-secondary)' }} className="mb-6">
          Practice full papers with real negative marking. Each wrong answer loses 1/3 mark (mimicking the actual exam).
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Number of questions:</label>
          <select
            value={testSize}
            onChange={(e) => setTestSize(Number(e.target.value))}
            className="px-3 py-2 rounded-md text-sm"
            style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          >
            <option value={10}>10 questions (quick drill)</option>
            <option value={25}>25 questions</option>
            <option value={50}>50 questions (half paper)</option>
            <option value={100}>100+ questions (full paper)</option>
          </select>
        </div>

        <button
          className="px-4 py-2 rounded-md font-medium"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          Start Test ({testSize} Q)
        </button>

        <div className="p-4 rounded-lg" style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)' }}>
          <div className="text-sm space-y-2" style={{ color: 'var(--text-secondary)' }}>
            <p>
              <strong>How tests work:</strong> Answer all questions, submit for review. Your score is calculated with real exam
              rules.
            </p>
            <p>
              <strong>Negative marking:</strong> -1/3 per wrong answer (standard MPSC pattern).
            </p>
            <p>
              <strong>Score formula:</strong> (Correct - Wrong/3) out of {testSize}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressTab() {
  return (
    <div className="max-w-4xl space-y-6">
      <h2 className="text-lg font-semibold">Study Progress</h2>
      <div className="p-4 rounded-lg" style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Progress tracking coming soon. Start taking mock tests to track your performance.</p>
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
