import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApp } from '@/lib/store';
import { ModuleSwitcher } from '@/modules/ModuleSwitcher';
import { useHasDesktopChrome } from '@/lib/useShellChrome';
import type { CurrentAffairsDay, OptionKey } from './types';

// ============================================
// CURRENT AFFAIRS — quiz player for one day.
// Local component state drives the run (question index, picked answers);
// only the *finished* result is written to the store (caAttempts), same
// split as PYQ's session counters vs bankProgress.
// ============================================

type FetchState =
  | { status: 'loading' }
  | { status: 'not-found' }
  | { status: 'ready'; day: CurrentAffairsDay };

const OPTION_KEYS: OptionKey[] = ['a', 'b', 'c', 'd'];

export function QuizPlayerPage() {
  const { date = '' } = useParams<{ date: string }>();
  const { theme, toggleTheme, caAttempts, recordCaAttempt } = useApp();
  const hasDesktopChrome = useHasDesktopChrome('home');

  const [state, setState] = useState<FetchState>({ status: 'loading' });
  const [readFirstOpen, setReadFirstOpen] = useState(true);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<OptionKey | null>(null);
  const [answers, setAnswers] = useState<Record<string, OptionKey>>({});

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading' });
    setIdx(0);
    setPicked(null);
    setAnswers({});
    setReadFirstOpen(true);
    fetch(`/data/current-affairs/${date}.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status}`);
        return res.json();
      })
      .then((day: CurrentAffairsDay) => {
        if (!cancelled) setState({ status: 'ready', day });
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'not-found' });
      });
    return () => {
      cancelled = true;
    };
  }, [date]);

  const day = state.status === 'ready' ? state.day : null;
  const q = day?.mcqs[idx];
  const done = !!day && idx >= day.mcqs.length;

  const answer = (key: OptionKey) => {
    if (picked !== null || !q) return;
    setPicked(key);
    setAnswers((a) => ({ ...a, [q.id]: key }));
  };

  const next = () => {
    setPicked(null);
    setIdx((i) => i + 1);
  };

  const score = day ? day.mcqs.filter((m) => answers[m.id] === m.correctAnswer).length : 0;

  useEffect(() => {
    if (done && day) {
      recordCaAttempt(day.date, { score, total: day.mcqs.length, answeredAt: Date.now(), answers });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const retry = () => {
    setIdx(0);
    setPicked(null);
    setAnswers({});
  };

  const byTopic = day
    ? day.mcqs.reduce<Record<string, { right: number; total: number }>>((acc, m) => {
        const t = acc[m.topic] ?? { right: 0, total: 0 };
        t.total += 1;
        if (answers[m.id] === m.correctAnswer) t.right += 1;
        acc[m.topic] = t;
        return acc;
      }, {})
    : {};

  const best = day ? caAttempts[day.date] : undefined;

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--bg-app)', color: 'var(--text-primary)' }}>
      <header
        className="safe-top h-12 shrink-0 border-b flex items-center justify-between px-5 gap-3"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-panel)' }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className={hasDesktopChrome ? 'lg:hidden' : ''}><ModuleSwitcher /></span>
          <span className="label-eyebrow hidden md:inline">{date}</span>
        </div>
        <div className="flex items-center gap-2">
          {day && !done && (
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {Math.min(idx + 1, day.mcqs.length)} / {day.mcqs.length}
            </span>
          )}
          <button
            onClick={toggleTheme}
            className={`${hasDesktopChrome ? 'lg:hidden' : ''} px-2 py-1 rounded-md text-sm hover:bg-[var(--bg-panel-elev)] transition-colors`}
            style={{ border: '1px solid var(--border)' }}
            title="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      {day && (
        <div className="shrink-0 h-1" style={{ background: 'var(--bg-panel-elev)' }}>
          <div
            className="h-full transition-[width] duration-300"
            style={{ background: 'var(--accent)', width: `${(Math.min(idx, day.mcqs.length) / day.mcqs.length) * 100}%` }}
          />
        </div>
      )}

      <main className="scroll-panel flex-1 min-h-0 overflow-y-auto px-5 py-6 flex justify-center">
        <div className="w-full max-w-2xl">
          {state.status === 'loading' && (
            <div className="rounded-xl p-8 text-center" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
              <p style={{ color: 'var(--text-secondary)' }}>Loading…</p>
            </div>
          )}

          {state.status === 'not-found' && (
            <div className="rounded-xl p-8 text-center fact-in" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
              <div className="text-3xl mb-2">🔍</div>
              <p className="font-medium mb-1">No quiz found for {date}.</p>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>It may not have been published yet, or the date is wrong.</p>
              <Link
                to="/current-affairs"
                className="inline-block px-4 py-2 rounded-md text-sm font-medium"
                style={{ background: 'var(--accent)', color: '#fff' }}
              >
                ← Back to archive
              </Link>
            </div>
          )}

          {day && (
            <>
              <button
                onClick={() => setReadFirstOpen((o) => !o)}
                className="w-full text-left rounded-xl p-4 mb-4 fact-in"
                style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium min-w-0">📖 Read first — {day.source.videoTitle}</span>
                  <span className="text-xs shrink-0" style={{ color: 'var(--text-secondary)' }}>{readFirstOpen ? '▾ hide' : '▸ show'}</span>
                </div>
                {readFirstOpen && (
                  <div
                    className="mt-3 text-sm leading-relaxed max-h-[40vh] overflow-y-auto pr-1"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {/* Can span 2-3 merged videos on a busy day — summary paragraphs
                        stay separated (day.summary already joins them with blank lines). */}
                    {day.summary.split('\n\n').map((para, i) => <p key={i} className="mb-3 last:mb-0">{para}</p>)}
                    <ul className="list-disc pl-5 space-y-1">
                      {day.keyFacts.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                  </div>
                )}
              </button>

              {!done && q && (
                <div className="rounded-xl p-6 fact-in" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }} key={q.id}>
                  <div className="flex items-center gap-2 mb-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <span className="px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-panel-elev)' }}>{q.topic}</span>
                    <span className="px-1.5 py-0.5 rounded capitalize" style={{ background: 'var(--bg-panel-elev)' }}>{q.difficulty}</span>
                  </div>

                  <p className="font-medium mb-4 leading-relaxed">{q.question}</p>

                  <div className="space-y-2">
                    {OPTION_KEYS.map((key) => {
                      const isAnswer = key === q.correctAnswer;
                      const isPicked = key === picked;
                      let style: React.CSSProperties = { background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' };
                      let cls = '';
                      if (picked !== null) {
                        if (isAnswer) { style = { background: 'rgba(46,125,91,0.14)', border: '1px solid #2e7d5b', color: 'var(--text-primary)' }; cls = isPicked ? 'anim-correct' : ''; }
                        else if (isPicked) { style = { background: 'rgba(165,80,74,0.12)', border: '1px solid #a5504a', color: 'var(--text-primary)' }; cls = 'anim-shake'; }
                      }
                      return (
                        <button
                          key={key}
                          onClick={() => answer(key)}
                          disabled={picked !== null}
                          className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm transition-colors ${picked === null ? 'hover:bg-[var(--bg-panel-elev)]' : ''} ${cls}`}
                          style={style}
                        >
                          <span className="opacity-60 mr-2">{key.toUpperCase()}.</span>{q.options[key]}
                        </button>
                      );
                    })}
                  </div>

                  {picked !== null && (
                    <div className="mt-4 fact-in">
                      <div className="rounded-lg px-4 py-3 text-sm leading-relaxed" style={{ background: 'var(--bg-panel-elev)', color: 'var(--text-secondary)' }}>
                        {q.explanation}
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={next}
                          className="px-4 py-2 rounded-md text-sm font-medium"
                          style={{ background: 'var(--accent)', color: '#fff' }}
                        >
                          {idx + 1 < day.mcqs.length ? 'Next →' : 'Finish'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {done && (
                <div className="rounded-xl p-8 text-center fact-in" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
                  <div className="text-3xl mb-2">🏁</div>
                  <p className="font-medium mb-1">Score: {score}/{day.mcqs.length}</p>
                  {best && best.score !== score && (
                    <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>Best so far: {best.score}/{best.total}</p>
                  )}

                  <div className="mt-4 mb-6 text-left space-y-1.5">
                    {Object.entries(byTopic).map(([topic, t]) => (
                      <div key={topic} className="flex items-center justify-between text-sm px-3 py-1.5 rounded-md" style={{ background: 'var(--bg-panel-elev)' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{topic}</span>
                        <span className="font-medium">{t.right}/{t.total}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-left mb-6 space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>Review</p>
                    {day.mcqs.map((m) => {
                      const correct = answers[m.id] === m.correctAnswer;
                      return (
                        <div key={m.id} className="text-sm px-3 py-2 rounded-md" style={{ background: 'var(--bg-panel-elev)' }}>
                          <div className="flex items-start gap-2">
                            <span>{correct ? '✅' : '❌'}</span>
                            <span className="min-w-0">{m.question}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={retry}
                      className="px-4 py-2 rounded-md text-sm font-medium"
                      style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                    >
                      ↻ Retry
                    </button>
                    <Link
                      to="/current-affairs"
                      className="px-4 py-2 rounded-md text-sm font-medium"
                      style={{ background: 'var(--accent)', color: '#fff' }}
                    >
                      ← Back to archive
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default QuizPlayerPage;
