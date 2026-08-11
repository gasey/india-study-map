import { useEffect, useState } from 'react';
import { useApp } from '@/lib/store';
import { pgStages } from '@/data/postgres/lessons';
import { MiniQuiz } from '@/components/shared/MiniQuiz';

// ============================================
// POSTGRES & SQL — same shape as PythonPage.tsx (lessons + cheatsheets +
// MCQ drills only, no in-browser SQL runtime — that's its own scoping
// pass, same reasoning as Python's deferred Pyodide playground).
// ============================================

export default function PostgresPage() {
  const lastStage = useApp((s) => s.postgresLastStage);
  const setLastStage = useApp((s) => s.setPostgresLastStage);
  const [stageId, setStageId] = useState(() => (lastStage && pgStages.some((s) => s.id === lastStage) ? lastStage : pgStages[0].id));
  const stage = pgStages.find((s) => s.id === stageId) ?? pgStages[0];

  useEffect(() => { setLastStage(stageId); }, [stageId, setLastStage]);

  return (
    <div className="h-full overflow-y-auto scroll-panel">
      <div className="max-w-[820px] mx-auto px-8 py-9 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-medium tracking-tight" style={{ color: 'var(--text-primary)' }}>Postgres &amp; SQL</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            A 6-stage path. Stages 2, 4, and 5 read straight from your own mpsc-backend load script and schema — real code, not textbook filler.
          </p>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {pgStages.map((s) => (
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
            <MiniQuiz questions={stage.quiz} />
          </div>
        )}
      </div>
    </div>
  );
}
