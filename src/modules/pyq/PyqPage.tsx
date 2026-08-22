import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as api from '@/lib/mpscApi';
import type { Correction } from '@/lib/mpscApi';
import { banks } from '@/data/banks';
import { isMcqQuestion } from '@/data/banks/types';
import type { BankQuestion } from '@/data/banks/types';
import { chapters } from '@/data';
import { useApp } from '@/lib/store';
import { ModuleSwitcher } from '@/modules/ModuleSwitcher';
import { HomeBackLink } from '@/components/shell/HomeBackLink';
import { useHasDesktopChrome } from '@/lib/useShellChrome';
import { QuestionReviewPanel } from '@/modules/mpsc/QuestionReviewPanel';
import { renderEmphasis } from '@/lib/renderEmphasis';

// ============================================
// PYQ PRACTICE — bank-driven question drill.
// Works off src/data/banks/*; knows nothing about Leaflet.
// Map cross-links are tag-based and optional.
// ============================================

const ALL = 'all';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Map chapters sharing a tag with this question — "View on map". */
function relatedChapters(q: BankQuestion) {
  if (!q.tags?.length) return [];
  return chapters.filter((c) => c.tags?.some((t) => q.tags!.includes(t))).slice(0, 3);
}

export function PyqPage() {
  const { theme, toggleTheme, bankProgress, recordBankAttempt, resetBankProgress, setChapter } = useApp();
  const navigate = useNavigate();

  const [bankId, setBankId] = useState(banks[0]?.id ?? '');
  const bank = banks.find((b) => b.id === bankId) ?? banks[0];

  const [subject, setSubject] = useState(ALL);
  const [topic, setTopic] = useState(ALL);
  const [difficulty, setDifficulty] = useState(ALL);
  const [seed, setSeed] = useState(0); // bump to reshuffle

  // Both dropdowns are built from the MCQ pool only — the same pool `filtered`
  // draws from. Deriving them from bank.questions instead would advertise
  // subjects/topics that exist only on descriptive questions and so can never
  // match here, leaving the user on "No questions match these filters" with no
  // hint why (the Statistical Handbook bank's essay topic did exactly that).
  const mcqPool = useMemo(() => bank.questions.filter(isMcqQuestion), [bank]);

  // Admin corrections overlaid at render time — the static bank file is
  // never rewritten (see StateTaxOfficerEnhanced.tsx for the original of
  // this pattern). Refetched whenever the bank changes; a bank with no
  // corrections yet (or a backend hiccup) just falls back to the raw pool.
  const [corrections, setCorrections] = useState<Record<string, Correction>>({});
  useEffect(() => {
    setCorrections({});
    api.getCorrections(bankId).then(setCorrections).catch(() => {});
  }, [bankId]);

  const correctedPool = useMemo(() => {
    if (Object.keys(corrections).length === 0) return mcqPool;
    return mcqPool.map((q) => {
      const c = corrections[q.id];
      if (!c) return q;
      return {
        ...q,
        question: c.stem ?? q.question,
        options: c.options ?? q.options,
        answerIndex: c.answerIndex ?? q.answerIndex,
        explanation: c.explanation ?? q.explanation,
      };
    });
  }, [mcqPool, corrections]);

  const subjects = useMemo(() => [...new Set(correctedPool.map((q) => q.subject))], [correctedPool]);
  const topics = useMemo(() => {
    const pool = correctedPool.filter((q) => subject === ALL || q.subject === subject);
    const seen = new Map<string, string>();
    pool.forEach((q) => seen.set(q.topic, q.topicLabel));
    return [...seen.entries()];
  }, [correctedPool, subject]);

  const filtered = useMemo(() => {
    // Descriptive questions (essay/case-study, no single answer) don't fit
    // this drill's answer-and-score loop.
    const pool = correctedPool.filter(
      (q) =>
        (subject === ALL || q.subject === subject) &&
        (topic === ALL || q.topic === topic) &&
        (difficulty === ALL || q.difficulty === difficulty)
    );
    return shuffle(pool);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [correctedPool, subject, topic, difficulty, seed]);

  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [session, setSession] = useState({ right: 0, wrong: 0 });

  // Reset the run whenever the filtered pool changes.
  const poolKey = `${bankId}|${subject}|${topic}|${difficulty}|${seed}`;
  const [lastKey, setLastKey] = useState(poolKey);
  if (poolKey !== lastKey) {
    setLastKey(poolKey);
    setIdx(0);
    setPicked(null);
    setSession({ right: 0, wrong: 0 });
  }

  const q = filtered[idx];
  const prog = bankProgress[bankId];
  const mastered = prog?.mastered.length ?? 0;

  // Soft, session-local "want to sit with this?" nudge — not persisted, not
  // shaming. A quick answer (picked within a couple seconds of the question
  // appearing) isn't inherently bad, but a run of them in a row is a decent
  // proxy for "answering before really looking" rather than genuine fast
  // recall. See DEVLOG for why this is scoped to PYQ Practice only.
  const shownAtRef = useRef(Date.now());
  const [quickStreak, setQuickStreak] = useState(0);
  const [nudgeDismissed, setNudgeDismissed] = useState(false);
  useEffect(() => {
    shownAtRef.current = Date.now();
  }, [idx, poolKey]);

  const answer = (i: number) => {
    if (picked !== null || !q) return;
    setPicked(i);
    const correct = i === q.answerIndex;
    setSession((s) => ({ right: s.right + (correct ? 1 : 0), wrong: s.wrong + (correct ? 0 : 1) }));
    recordBankAttempt(bankId, q.id, correct);
    api.logAttempt({ subject: q.subject, topic: q.topic, topicLabel: q.topicLabel, source: `bank:${bankId}`, correct });

    const elapsed = Date.now() - shownAtRef.current;
    setQuickStreak((n) => (elapsed < 3000 ? n + 1 : 0));
  };

  const showNudge = quickStreak >= 2 && !nudgeDismissed;

  const next = () => {
    setPicked(null);
    setIdx((i) => i + 1);
  };

  const jumpToChapter = (chapterId: string) => {
    setChapter(chapterId);
    navigate('/');
  };

  const selectCls = 'px-2 py-1.5 rounded-md text-sm';
  const selectStyle = { background: 'var(--bg-panel-elev)', color: 'var(--text-primary)', border: '1px solid var(--border)' } as const;
  const hasDesktopChrome = useHasDesktopChrome('home');

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--bg-app)', color: 'var(--text-primary)' }}>
      {/* Header — hidden at desktop widths: AppHeader (the persistent
          shell header) already covers the title there, and this page's
          own back-link/switcher/theme-toggle are already desktop-hidden. */}
      <header
        className="lg:hidden safe-top h-12 shrink-0 border-b flex items-center justify-between px-5 gap-3"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-panel)' }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <HomeBackLink hasDesktopChrome={hasDesktopChrome} />
          <span className={hasDesktopChrome ? 'lg:hidden' : ''}><ModuleSwitcher /></span>
          <span className="label-eyebrow hidden md:inline">PYQ Practice</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {mastered}/{bank.questions.length} mastered
          </span>
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

      {/* Filters */}
      <div className="shrink-0 flex flex-wrap items-center gap-2 px-5 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <select value={bankId} onChange={(e) => setBankId(e.target.value)} className={selectCls} style={selectStyle}>
          {banks.map((b) => (
            <option key={b.id} value={b.id}>{b.title} ({b.questions.length})</option>
          ))}
        </select>
        <select value={subject} onChange={(e) => { setSubject(e.target.value); setTopic(ALL); }} className={selectCls} style={selectStyle}>
          <option value={ALL}>All subjects</option>
          {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={topic} onChange={(e) => setTopic(e.target.value)} className={selectCls} style={selectStyle}>
          <option value={ALL}>All topics</option>
          {topics.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
        </select>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className={selectCls} style={selectStyle}>
          <option value={ALL}>All levels</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <button
          onClick={() => setSeed((s) => s + 1)}
          className="px-2.5 py-1.5 rounded-md text-sm hover:bg-[var(--bg-panel-elev)] transition-colors"
          style={{ border: '1px solid var(--border)' }}
        >
          ⟳ Shuffle
        </button>
        <div className="ml-auto text-xs" style={{ color: 'var(--text-secondary)' }}>
          {mastered}/{bank.questions.length} mastered · Session: <span style={{ color: '#2e7d5b' }}>{session.right} ✓</span> · <span style={{ color: '#a5504a' }}>{session.wrong} ✗</span>
        </div>
      </div>

      {/* Question card */}
      <main className="scroll-panel flex-1 min-h-0 overflow-y-auto px-5 py-6 flex justify-center">
        <div className="w-full max-w-2xl">
          {!q ? (
            <div className="rounded-xl p-8 text-center fact-in" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
              {filtered.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No questions match these filters.</p>
              ) : (
                <>
                  <div className="text-3xl mb-2">🏁</div>
                  <p className="font-medium mb-1">Run complete — {session.right}/{filtered.length} correct.</p>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Shuffle to run this set again, or change filters.</p>
                  <button
                    onClick={() => setSeed((s) => s + 1)}
                    className="px-4 py-2 rounded-md text-sm font-medium"
                    style={{ background: 'var(--accent)', color: '#fff' }}
                  >
                    Run again
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="rounded-xl p-6 fact-in" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }} key={q.id}>
              <div className="flex items-center gap-2 mb-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <span className="px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-panel-elev)' }}>{q.topicLabel}</span>
                <span className="px-1.5 py-0.5 rounded capitalize" style={{ background: 'var(--bg-panel-elev)' }}>{q.difficulty}</span>
                {q.year && <span className="px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-panel-elev)' }}>{q.source ?? 'PYQ'} {q.year}</span>}
                {corrections[q.id] && (
                  <span className="px-1.5 py-0.5 rounded" style={{ color: '#2e7d5b', border: '1px solid #2e7d5b' }}>✓ corrected by admin</span>
                )}
                <span className="ml-auto">{idx + 1} / {filtered.length}</span>
              </div>

              <p className="font-medium mb-4 leading-relaxed">{renderEmphasis(q.question)}</p>

              <div className="space-y-2">
                {q.options.map((opt, i) => {
                  const isAnswer = i === q.answerIndex;
                  const isPicked = i === picked;
                  let style: React.CSSProperties = { background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' };
                  let cls = '';
                  if (picked !== null) {
                    if (isAnswer) { style = { background: 'rgba(46,125,91,0.14)', border: '1px solid #2e7d5b', color: 'var(--text-primary)' }; cls = isPicked ? 'anim-correct' : ''; }
                    else if (isPicked) { style = { background: 'rgba(165,80,74,0.12)', border: '1px solid #a5504a', color: 'var(--text-primary)' }; cls = 'anim-shake'; }
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => answer(i)}
                      disabled={picked !== null}
                      className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm transition-colors ${picked === null ? 'hover:bg-[var(--bg-panel-elev)]' : ''} ${cls}`}
                      style={style}
                    >
                      <span className="opacity-60 mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
                    </button>
                  );
                })}
              </div>

              {picked !== null && (
                <div className="mt-4 fact-in">
                  <div className="rounded-lg px-4 py-3 text-sm leading-relaxed" style={{ background: 'var(--bg-panel-elev)', color: 'var(--text-secondary)' }}>
                    {q.explanation}
                  </div>
                  {corrections[q.id]?.note && (
                    <div className="mt-2 rounded-lg px-4 py-2.5 text-xs leading-relaxed" style={{ background: 'rgba(46,125,91,0.10)', border: '1px solid #2e7d5b' }}>
                      <strong>Admin note:</strong> {corrections[q.id].note}
                    </div>
                  )}
                  {q.disputeNote && (
                    <div className="mt-2 rounded-lg px-4 py-2.5 text-xs leading-relaxed" style={{ background: 'rgba(165,80,74,0.10)', border: '1px solid #a5504a' }}>
                      <strong>Disputed:</strong> {q.disputeNote}
                    </div>
                  )}
                  {q.sourceNote && (
                    <div className="mt-2 rounded-lg px-4 py-2.5 text-xs leading-relaxed" style={{ background: 'rgba(200,150,40,0.12)', border: '1px solid #c8962a' }}>
                      <strong>⚠ Source note — the reference disagrees with itself:</strong> {q.sourceNote}
                    </div>
                  )}
                  <QuestionReviewPanel bankId={bankId} questionId={q.id} options={q.options} />
                  {relatedChapters(q).length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                      <span style={{ color: 'var(--text-secondary)' }}>On the map:</span>
                      {relatedChapters(q).map((c) => (
                        <button
                          key={c.id}
                          onClick={() => jumpToChapter(c.id)}
                          className="px-2 py-1 rounded-md hover:opacity-80 transition-opacity"
                          style={{ border: '1px solid var(--accent)', color: 'var(--accent)' }}
                        >
                          🗺️ {c.title}
                        </button>
                      ))}
                    </div>
                  )}
                  {showNudge && (
                    <div className="mt-4 rounded-lg px-3.5 py-2.5 flex items-center justify-between gap-3 text-xs" style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        You may be escaping uncertainty. Want to sit with one for 2 minutes?
                      </span>
                      <div className="flex items-center gap-3 shrink-0">
                        <Link to="/mindset" style={{ color: 'var(--accent)' }} className="hover:underline">Sit with it →</Link>
                        <button onClick={() => setNudgeDismissed(true)} style={{ color: 'var(--text-muted)' }}>Dismiss</button>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={next}
                      className="px-4 py-2 rounded-md text-sm font-medium"
                      style={{ background: 'var(--accent)', color: '#fff' }}
                    >
                      {idx + 1 < filtered.length ? 'Next →' : 'Finish'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
            <Link to="/map" className="hover:underline">← Back to Study Map</Link>
            <button onClick={() => resetBankProgress(bankId)} className="hover:underline">Reset bank progress</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PyqPage;
