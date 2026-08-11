import { useRef, useState } from 'react';
import { KANA } from '@/data/kana';

type Script = 'hira' | 'kata';
type QuizMode = 'mcq' | 'type';

function pick<T>(list: T[]): T { return list[Math.floor(Math.random() * list.length)]; }
function sample<T>(arr: T[], n: number): T[] {
  const pool = [...arr];
  const out: T[] = [];
  while (out.length < n && pool.length) out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  return out;
}

export function KanaQuiz({ rows, script }: { rows: typeof KANA; script: Script }) {
  const idx = script === 'hira' ? 0 : 1;
  const [qmode, setQmode] = useState<QuizMode>('mcq');
  const [q, setQ] = useState(() => pick(rows));
  const [opts, setOpts] = useState(() => buildOpts(rows, q));
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<'right' | 'wrong' | null>(null);
  const [tally, setTally] = useState({ right: 0, total: 0 });
  const inputRef = useRef<HTMLInputElement>(null);

  function buildOpts(list: typeof rows, target: typeof rows[number]) {
    const others = sample(list.map((x) => x[2]).filter((r) => r !== target[2]), 3);
    return [...others, target[2]].sort(() => Math.random() - 0.5);
  }
  function next() {
    const nq = pick(rows);
    setQ(nq); setOpts(buildOpts(rows, nq)); setAnswer(''); setFeedback(null);
    if (qmode === 'type') setTimeout(() => inputRef.current?.focus(), 30);
  }
  function grade(correct: boolean) {
    setFeedback(correct ? 'right' : 'wrong');
    setTally((t) => ({ right: t.right + (correct ? 1 : 0), total: t.total + 1 }));
    setTimeout(next, correct ? 650 : 1300);
  }

  return (
    <div className="rounded-lg p-5" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
      <div className="flex items-center justify-between mb-5">
        <div className="inline-flex rounded-lg p-1 gap-0.5" style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)' }}>
          {(['mcq', 'type'] as QuizMode[]).map((m) => (
            <button key={m} onClick={() => { setQmode(m); setFeedback(null); }}
              className="px-3 py-1 rounded-md text-xs font-medium"
              style={{ background: qmode === m ? 'var(--accent-soft)' : 'transparent', color: qmode === m ? 'var(--accent)' : 'var(--text-secondary)' }}>
              {m === 'mcq' ? 'Multiple choice' : 'Type romaji'}
            </button>
          ))}
        </div>
        <span className="text-sm tabular-nums" style={{ color: 'var(--text-secondary)' }}>{tally.right}/{tally.total}</span>
      </div>

      <div className="flex flex-col items-center gap-5">
        <div className="rounded-lg flex items-center justify-center" style={{
          width: 120, height: 120, background: 'var(--bg-panel-elev)', border: '1px solid var(--border)',
          fontSize: 56, lineHeight: 1, color: 'var(--text-primary)',
        }}>
          {q[idx]}
        </div>

        {qmode === 'mcq' ? (
          <div className="grid grid-cols-2 gap-2.5 w-full max-w-sm">
            {opts.map((o) => {
              const isAnswer = o === q[2];
              const style = feedback
                ? isAnswer
                  ? { background: 'color-mix(in srgb, var(--ok) 15%, transparent)', border: '1px solid var(--ok)', color: 'var(--text-primary)' }
                  : { background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }
                : { background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' };
              return (
                <button key={o} disabled={!!feedback} onClick={() => grade(o === q[2])}
                  className="rounded-lg py-3 font-semibold text-lg disabled:cursor-default"
                  style={style}>{o}</button>
              );
            })}
          </div>
        ) : (
          <div className="w-full max-w-xs">
            <input ref={inputRef} autoFocus value={answer} disabled={!!feedback}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && answer.trim()) grade(answer.trim().toLowerCase() === q[2]); }}
              placeholder="type the romaji…"
              className="w-full text-center text-lg rounded-lg px-4 py-3 outline-none"
              style={{
                border: `1px solid ${feedback === 'wrong' ? 'var(--bad)' : feedback === 'right' ? 'var(--ok)' : 'var(--border)'}`,
                background: 'var(--bg-panel-elev)', color: 'var(--text-primary)',
              }} />
            {!feedback && (
              <button onClick={() => { if (answer.trim()) grade(answer.trim().toLowerCase() === q[2]); }}
                className="w-full mt-2.5 py-2.5 rounded-lg font-semibold text-sm"
                style={{ background: 'var(--accent)', color: 'var(--on-accent)', border: 'none' }}>
                Check
              </button>
            )}
          </div>
        )}

        <div className="h-6 text-sm font-medium">
          {feedback === 'right' && <span style={{ color: 'var(--ok)' }}>◎ correct — {q[idx]} = {q[2]}</span>}
          {feedback === 'wrong' && <span style={{ color: 'var(--bad)' }}>✕ {q[idx]} = {q[2]}</span>}
        </div>
      </div>
    </div>
  );
}
