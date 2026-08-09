import { useEffect, useState } from 'react';
import { useApp } from '@/lib/store';
import { pyStages } from '@/data/python/lessons';
import { PyQuiz } from '@/modules/python/PyQuiz';

// ============================================
// PROGRAMMING & PYTHON — replaces the /code PlannedPage stub. Lessons +
// cheatsheets + MCQ drills only (6a); the Pyodide-in-a-worker playground
// (6b) is deferred per the handoff's own advice ("ship lessons + MCQs
// first, defer the runtime") — it's a different kind of engineering
// (sandboxed code execution) from everything else in this app, and
// shouldn't be bolted on without its own scoping pass.
// ============================================

export default function PythonPage() {
  const lastStage = useApp((s) => s.pythonLastStage);
  const setLastStage = useApp((s) => s.setPythonLastStage);
  const [stageId, setStageId] = useState(() => (lastStage && pyStages.some((s) => s.id === lastStage) ? lastStage : pyStages[0].id));
  const stage = pyStages.find((s) => s.id === stageId) ?? pyStages[0];

  useEffect(() => { setLastStage(stageId); }, [stageId, setLastStage]);

  return (
    <div className="h-full overflow-y-auto scroll-panel">
      <div className="max-w-[820px] mx-auto px-8 py-9 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-medium tracking-tight" style={{ color: 'var(--text-primary)' }}>Programming &amp; Python</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            A 6-stage path. Stages 5–6 read straight from your own MPSC extraction scripts — real code, not textbook filler.
          </p>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {pyStages.map((s) => (
            <button
              key={s.id}
              onClick={() => setStageId(s.id)}
              className="shrink-0 text-xs px-3 py-1.5 rounded-full whitespace-nowrap"
              style={{
                border: `1px solid ${stageId === s.id ? 'var(--accent)' : 'var(--border)'}`,
                background: stageId === s.id ? 'var(--accent-soft)' : 'var(--bg-panel)',
                color: stageId === s.id ? 'var(--accent)' : 'var(--text-secondary)',
              }}
            >
              {s.title}
            </button>
          ))}
        </div>

        <div className="rounded-lg p-5" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
          <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{stage.title}</h2>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{stage.blurb}</p>

          <ul className="flex flex-col gap-2 mb-4">
            {stage.notes.map((n, i) => (
              <li key={i} className="text-sm leading-relaxed pl-4" style={{ color: 'var(--text-primary)', borderLeft: '2px solid var(--border)' }}>{n}</li>
            ))}
          </ul>

          {stage.code && (
            <div className="rounded-md overflow-hidden mb-4" style={{ border: '1px solid var(--border)' }}>
              <div className="px-3 py-1.5 text-[11px] font-mono flex items-center justify-between" style={{ background: 'var(--bg-panel-elev)', color: 'var(--text-secondary)' }}>
                <span>{stage.code.label}</span>
                {stage.code.source && <span>{stage.code.source}</span>}
              </div>
              <pre className="px-3 py-3 text-xs overflow-x-auto" style={{ background: 'var(--bg-app)', color: 'var(--text-primary)' }}>
                <code>{stage.code.snippet}</code>
              </pre>
            </div>
          )}
        </div>

        {stage.quiz.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>Quick check</h3>
            <PyQuiz questions={stage.quiz} />
          </div>
        )}
      </div>
    </div>
  );
}
