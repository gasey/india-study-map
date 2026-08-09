import { useState } from 'react';
import type { PyQuizQuestion } from '@/data/python/lessons';

// Deliberately NOT the Question Bank engine — there's no real bank data to
// filter into for Python (checked: zero questions tagged for programming in
// the live DB). This is a small, locally-authored, click-to-reveal card
// list: no scoring, timer, or palette, so it reads as a different kind of
// thing rather than a competing "second question renderer".
export function PyQuiz({ questions }: { questions: PyQuizQuestion[] }) {
  const [picked, setPicked] = useState<Record<number, number>>({});

  if (questions.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {questions.map((q, qi) => {
        const chosen = picked[qi];
        return (
          <div key={qi} className="rounded-lg p-4" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
            <div className="text-sm font-medium mb-2.5" style={{ color: 'var(--text-primary)' }}>{q.q}</div>
            <div className="grid sm:grid-cols-2 gap-2">
              {q.options.map((opt, oi) => {
                const isAnswer = oi === q.answerIndex;
                const isChosen = chosen === oi;
                const revealed = chosen !== undefined;
                return (
                  <button
                    key={oi}
                    onClick={() => setPicked((p) => ({ ...p, [qi]: oi }))}
                    disabled={revealed}
                    className="text-left px-3 py-2 rounded-md text-sm disabled:cursor-default"
                    style={{
                      border: `1px solid ${revealed && isAnswer ? 'var(--ok)' : 'var(--border)'}`,
                      background: revealed && isAnswer ? 'color-mix(in srgb, var(--ok) 12%, transparent)'
                        : revealed && isChosen ? 'color-mix(in srgb, var(--bad) 12%, transparent)'
                        : 'var(--bg-panel-elev)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {chosen !== undefined && (
              <div className="mt-2.5 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {chosen === q.answerIndex ? <b style={{ color: 'var(--ok)' }}>Correct. </b> : <b style={{ color: 'var(--bad)' }}>Not quite. </b>}
                {q.explanation}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
