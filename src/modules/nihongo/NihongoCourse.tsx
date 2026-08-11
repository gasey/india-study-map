import { useEffect, useState } from 'react';
import { useApp } from '@/lib/store';
import { nihongoStages } from '@/data/nihongo/course';
import { MiniQuiz } from '@/components/shared/MiniQuiz';

// Grammar course tab — same stage-tab shape as PythonPage/PostgresPage,
// just embedded inside NihongoPage rather than its own top-level page
// (Nihongo already has Kana as a sibling section).
export function NihongoCourse() {
  const lastStage = useApp((s) => s.nihongoCourseLastStage);
  const setLastStage = useApp((s) => s.setNihongoCourseLastStage);
  const [stageId, setStageId] = useState(() => (lastStage && nihongoStages.some((s) => s.id === lastStage) ? lastStage : nihongoStages[0].id));
  const stage = nihongoStages.find((s) => s.id === stageId) ?? nihongoStages[0];

  useEffect(() => { setLastStage(stageId); }, [stageId, setLastStage]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {nihongoStages.map((s) => (
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

        {stage.example && (
          <div className="rounded-md overflow-hidden mb-4" style={{ border: '1px solid var(--border)' }}>
            <div className="px-3 py-1.5 text-[11px] font-mono flex items-center justify-between" style={{ background: 'var(--bg-panel-elev)', color: 'var(--text-secondary)' }}>
              <span>{stage.example.label}</span>
              {stage.example.source && <span>{stage.example.source}</span>}
            </div>
            <pre className="px-3 py-3 text-xs overflow-x-auto whitespace-pre-wrap" style={{ background: 'var(--bg-app)', color: 'var(--text-primary)' }}>
              <code>{stage.example.snippet}</code>
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
  );
}
