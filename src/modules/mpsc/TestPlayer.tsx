import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { McqBankQuestion } from '@/data/banks/types';
import * as api from '@/lib/mpscApi';
import { hueForSubject } from '@/lib/colorMix';
import { useApp } from '@/lib/store';
import { BANK_ID } from './useMpscData';
import { useAttemptState } from './useAttemptState';

// ============================================
// TEST PLAYER — built to build-order.md §4.1, which components.md defers to
// ("NOT DESIGNED. Do not improvise. See build-order.md §4.1"). The visual
// spec is the `Tests → Player` screen in `Jabreeze - Redesign.dc.html`.
//
// Two panes: question column + a 258px palette rail.
//   - Timer: 16px mono in a pill, --warn under 45 min, --bad under 5 min.
//     Never hidden, never animated. Counts DOWN when the test has a
//     duration, UP when it doesn't (practice drills have no time limit).
//   - Palette: 8-col grid, five states (current/answered/marked/seen/unseen);
//     the legend carries live counts, which is what tells a candidate where
//     to spend the last ten minutes.
//   - Options: 44px-minimum rows with a mono keyboard hint. Full map:
//     1–4 pick · M mark · ←/→ move · Enter saves and advances.
//   - Autosave: see useAttemptState.ts. The sitting survives a refresh and a
//     dropped connection, and resumes with the correct remaining time.
//   - Submit: confirms with the unanswered count and states that blanks
//     score zero, before it can be committed.
//
// Deliberately NOT built (would need data the platform does not have, and
// inventing it would put fictional numbers in front of someone studying for
// a real exam): the Results screen's "score vs last year's cut-off" and
// "#3 of 41 attempts" rank from §4.2 — there is no cutoff table and no
// cross-user attempt data. Everything else on Results is real.
// Pause (present in the prototype's chrome, absent from §4.1's build notes)
// is also omitted: it complicates resume-time correctness, which is the one
// thing here that must not be wrong.
// ============================================

interface Props {
  title: string;
  /** Stable id — doubles as the autosave key, so a refresh resumes. */
  targetId: string;
  questions: McqBankQuestion[];
  /** Total time in seconds. Omit for an untimed practice drill (counts up). */
  durationS?: number;
  /** Marks deducted per wrong answer. 0 = no negative marking. */
  negative?: number;
  onExit: () => void;
}

// Subject hues live in lib/colorMix.ts so the bank's QuestionCard and this
// player can't drift apart on what colour a subject is.
const hueFor = hueForSubject;

function fmtClock(sec: number): string {
  const s = Math.max(0, sec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  const mm = h > 0 ? String(m).padStart(2, '0') : String(m);
  return h > 0 ? `${h}:${mm}:${String(ss).padStart(2, '0')}` : `${mm}:${String(ss).padStart(2, '0')}`;
}

function fmtAgo(ms: number): string {
  const s = Math.floor(ms / 1000);
  if (s < 5) return 'just now';
  if (s < 60) return `${s} seconds ago`;
  const m = Math.floor(s / 60);
  return m === 1 ? 'a minute ago' : `${m} minutes ago`;
}

type PaletteState = 'now' | 'answered' | 'marked' | 'seen' | 'unseen';

const PALETTE_STYLE: Record<PaletteState, { bd: string; bg: string; fg: string; title: string }> = {
  now: { bd: 'var(--accent)', bg: 'var(--accent)', fg: 'var(--on-accent)', title: 'Current question' },
  answered: { bd: 'color-mix(in srgb, var(--ok) 45%, transparent)', bg: 'color-mix(in srgb, var(--ok) 20%, transparent)', fg: 'var(--ok)', title: 'Answered' },
  marked: { bd: 'var(--warn)', bg: 'color-mix(in srgb, var(--warn) 20%, transparent)', fg: 'var(--warn)', title: 'Marked for review' },
  seen: { bd: 'var(--line-strong)', bg: 'var(--sunk)', fg: 'var(--muted)', title: 'Seen, not answered' },
  unseen: { bd: 'var(--line)', bg: 'transparent', fg: 'var(--faint)', title: 'Not seen' },
};

export function TestPlayer({ title, targetId, questions, durationS, negative = 0, onExit }: Props) {
  const { recordBankAttempt, recordTestResult } = useApp();

  // Freeze question order for the life of the sitting: re-shuffling under a
  // resumed attempt would repoint every saved answer at a different question.
  const items = useMemo(() => questions, [questions]);

  // Identifies this exact paper, so a resumed sitting can't restore a clock
  // and answers belonging to a different random draw (see useAttemptState).
  const signature = useMemo(() => `${items.length}:${items.map((i) => i.id).join(',')}`, [items]);

  const { state, patch, savedAt, resumed, clear } = useAttemptState(targetId, signature, items.length > 0);
  const { answers, idx, startedAt } = state;
  const marked = useMemo(() => new Set(state.marked), [state.marked]);
  const seen = useMemo(() => new Set(state.seen), [state.seen]);

  const [submitted, setSubmitted] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [finalElapsed, setFinalElapsed] = useState(0);
  const [now, setNow] = useState(() => Date.now());

  const q = items[idx];
  const answeredCount = Object.keys(answers).length;

  // Wall-clock derived, never a decremented counter — a backgrounded tab or a
  // refresh must not gift back time.
  const elapsed = Math.floor((now - startedAt) / 1000);
  const remaining = durationS !== undefined ? durationS - elapsed : null;
  const timeUp = remaining !== null && remaining <= 0;

  useEffect(() => {
    if (submitted) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [submitted]);

  // Mark the current question seen as soon as it is on screen.
  useEffect(() => {
    if (!q || submitted) return;
    if (!seen.has(q.id)) patch((s) => ({ seen: [...s.seen, q.id] }));
  }, [q, seen, patch, submitted]);

  const score = useMemo(() => {
    let correct = 0, wrong = 0;
    for (const item of items) {
      if (!(item.id in answers)) continue;
      if (answers[item.id] === item.answerIndex) correct += 1;
      else wrong += 1;
    }
    return { correct, wrong, blank: items.length - correct - wrong, marks: correct - wrong * negative };
  }, [items, answers, negative]);

  const submit = useCallback(() => {
    for (const item of items) {
      if (item.id in answers) {
        const correct = answers[item.id] === item.answerIndex;
        recordBankAttempt(BANK_ID, item.id, correct);
        api.logAttempt({ subject: item.subject, topic: item.topic, topicLabel: item.topicLabel, source: `bank:${BANK_ID}`, correct });
      }
    }
    recordTestResult({
      targetId,
      label: title,
      score: score.correct,
      total: items.length,
      durationSec: Math.floor((Date.now() - startedAt) / 1000),
      answeredAt: Date.now(),
    });
    setFinalElapsed(Math.floor((Date.now() - startedAt) / 1000));
    setSubmitted(true);
    setConfirming(false);
    clear(); // the sitting is over — don't resume a finished attempt
  }, [items, answers, recordBankAttempt, recordTestResult, targetId, title, score.correct, startedAt, clear]);

  // Auto-submit the moment the clock runs out, exactly like a real hall.
  useEffect(() => {
    if (timeUp && !submitted) submit();
  }, [timeUp, submitted, submit]);

  const pick = useCallback((optionIdx: number) => {
    if (submitted || !q) return;
    patch((s) => ({ answers: { ...s.answers, [q.id]: optionIdx } }));
  }, [submitted, q, patch]);

  const clearAnswer = useCallback(() => {
    if (submitted || !q) return;
    patch((s) => {
      const next = { ...s.answers };
      delete next[q.id];
      return { answers: next };
    });
  }, [submitted, q, patch]);

  const toggleMark = useCallback(() => {
    if (submitted || !q) return;
    patch((s) => ({ marked: s.marked.includes(q.id) ? s.marked.filter((m) => m !== q.id) : [...s.marked, q.id] }));
  }, [submitted, q, patch]);

  const go = useCallback((next: number) => {
    patch({ idx: Math.max(0, Math.min(items.length - 1, next)) });
  }, [patch, items.length]);

  // ---- Keyboard map: 1–4 pick · M mark · ←/→ move · Enter save & next ----
  useEffect(() => {
    if (submitted || confirming) return;
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key >= '1' && e.key <= '9') {
        const n = Number(e.key) - 1;
        if (q && n < q.options.length) { e.preventDefault(); pick(n); }
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault(); toggleMark();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault(); go(idx - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault(); go(idx + 1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (idx + 1 < items.length) go(idx + 1); else setConfirming(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [submitted, confirming, q, idx, items.length, pick, toggleMark, go]);

  if (items.length === 0) {
    return (
      <div className="p-8 text-center" style={{ color: 'var(--text-secondary)' }}>
        <p className="mb-4">This test has no questions.</p>
        <button onClick={onExit} className="px-4 py-2 rounded-md text-sm font-medium" style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}>Back</button>
      </div>
    );
  }

  // ---- Results ----
  if (submitted) {
    return (
      <ResultsView
        title={title}
        items={items}
        answers={answers}
        score={score}
        negative={negative}
        elapsedSec={finalElapsed}
        onExit={onExit}
      />
    );
  }

  const picked = answers[q.id];
  const paletteCounts = {
    answered: items.filter((i) => i.id in answers && !marked.has(i.id)).length,
    marked: marked.size,
    seen: items.filter((i) => seen.has(i.id) && !(i.id in answers) && !marked.has(i.id)).length,
    unseen: items.filter((i) => !seen.has(i.id)).length,
  };
  const timerColor = remaining === null ? 'var(--muted)' : remaining < 300 ? 'var(--bad)' : remaining < 2700 ? 'var(--warn)' : 'var(--muted)';

  return (
    <div className="flex h-full min-h-0" style={{ background: 'var(--bg-app)' }}>
      {/* ---- Question column ---- */}
      <div className="flex-1 min-w-0 flex flex-col min-h-0">
        <div
          className="shrink-0 flex items-center gap-3.5 px-6 py-3.5"
          style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-panel)' }}
        >
          <div className="min-w-0">
            <div className="font-mono text-[9px] uppercase" style={{ letterSpacing: '0.12em', color: 'var(--text-muted)' }}>
              Question {idx + 1} of {items.length}
            </div>
            <div className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{title}</div>
          </div>
          <div className="flex-1" />
          <div
            className="flex items-center gap-2 rounded-full"
            style={{ padding: '7px 13px 7px 11px', border: `1px solid ${timerColor}`, background: `color-mix(in srgb, ${timerColor} 10%, transparent)` }}
            title={remaining === null ? 'Time elapsed' : 'Time remaining'}
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke={timerColor} strokeWidth="1.8" strokeLinecap="round">
              <path d="M10 4.5a5.5 5.5 0 105.5 5.5A5.5 5.5 0 0010 4.5zM10 7v3l2 1.5" />
            </svg>
            <span className="font-mono text-[16px] font-semibold tabular-nums" style={{ color: timerColor, letterSpacing: '-0.01em' }}>
              {fmtClock(remaining === null ? elapsed : remaining)}
            </span>
          </div>
          <button
            onClick={onExit}
            className="px-3 py-2 rounded-md text-xs whitespace-nowrap"
            style={{ border: '1px solid var(--border)', background: 'var(--bg-panel)', color: 'var(--text-primary)' }}
          >
            Exit
          </button>
          <button
            onClick={() => setConfirming(true)}
            className="px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap"
            style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}
          >
            Submit
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto scroll-panel px-6 pt-6 pb-8">
          <div className="max-w-[720px] mx-auto">
            <div className="flex items-center flex-wrap gap-x-[7px] gap-y-[9px] mb-4">
              <span
                className="text-[9px] font-bold uppercase px-[7px] py-0.5 rounded-[5px]"
                style={{ letterSpacing: '0.04em', border: `1px solid ${hueFor(q.subject)}`, color: hueFor(q.subject) }}
              >
                {q.topicLabel}
              </span>
              <span
                className="text-[9px] font-bold uppercase px-[7px] py-0.5 rounded-[5px] capitalize"
                style={{ letterSpacing: '0.04em', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
              >
                {q.difficulty}
              </span>
              <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>
                +1 correct{negative > 0 ? ` · −${negative} wrong` : ' · no negative marking'}
              </span>
              <button
                onClick={toggleMark}
                className="ml-auto flex items-center gap-1.5 px-[11px] py-[5px] rounded-full text-[11px] font-semibold whitespace-nowrap shrink-0"
                style={marked.has(q.id)
                  ? { border: '1px solid var(--warn)', background: 'color-mix(in srgb, var(--warn) 12%, transparent)', color: 'var(--warn)' }
                  : { border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)' }}
              >
                <span className="text-[12px] leading-none">⚑</span> {marked.has(q.id) ? 'Marked for review' : 'Mark for review'}
              </button>
            </div>

            {q.passage && (
              <div
                className="mb-5 p-3.5 rounded-lg text-sm leading-relaxed whitespace-pre-wrap"
                style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
              >
                {q.passage}
              </div>
            )}

            <div className="text-[18px] font-medium leading-[1.5] mb-5" style={{ color: 'var(--text-primary)', textWrap: 'pretty' } as React.CSSProperties}>
              {q.question}
            </div>

            <div className="flex flex-col gap-[9px]">
              {q.options.map((opt, i) => {
                const isPicked = i === picked;
                return (
                  <button
                    key={i}
                    onClick={() => pick(i)}
                    className="flex items-center gap-[13px] px-4 py-3.5 rounded-[10px] text-left"
                    style={{
                      minHeight: 44,
                      boxSizing: 'border-box',
                      border: `1px solid ${isPicked ? 'var(--accent)' : 'var(--border)'}`,
                      background: isPicked ? 'var(--accent-soft)' : 'transparent',
                    }}
                  >
                    <span
                      className="w-[26px] h-[26px] rounded-full font-mono text-[12px] font-bold flex items-center justify-center shrink-0"
                      style={isPicked
                        ? { border: '1px solid var(--accent)', background: 'var(--accent)', color: 'var(--on-accent)' }
                        : { border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)' }}
                    >
                      {String.fromCharCode(97 + i)}
                    </span>
                    <span className="text-sm flex-1 min-w-0" style={{ color: 'var(--text-primary)' }}>{opt}</span>
                    <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>{i + 1}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2.5 mt-[22px] pt-4" style={{ borderTop: '1px solid var(--border)' }}>
              <button
                onClick={() => go(idx - 1)}
                disabled={idx === 0}
                className="px-4 py-2.5 rounded-lg text-[13px] disabled:opacity-40"
                style={{ minHeight: 44, border: '1px solid var(--border)', background: 'var(--bg-panel)', color: 'var(--text-primary)' }}
              >
                ← Previous
              </button>
              <button
                onClick={clearAnswer}
                disabled={picked === undefined}
                className="px-4 py-2.5 rounded-lg text-[13px] disabled:opacity-40"
                style={{ minHeight: 44, border: '1px solid var(--border)', background: 'var(--bg-panel)', color: 'var(--text-secondary)' }}
              >
                Clear answer
              </button>
              <div className="flex-1" />
              <span className="font-mono text-[10px] hidden sm:block" style={{ color: 'var(--text-muted)' }}>
                1–4 pick · M mark · ← → move
              </span>
              <button
                onClick={() => (idx + 1 < items.length ? go(idx + 1) : setConfirming(true))}
                className="px-5 py-2.5 rounded-lg text-[13px] font-semibold"
                style={{ minHeight: 44, background: 'var(--accent)', color: 'var(--on-accent)' }}
              >
                {idx + 1 < items.length ? 'Save & next →' : 'Review & submit'}
              </button>
            </div>

            <div className="mt-[18px] flex items-center gap-[9px] text-[11px]" style={{ color: 'var(--text-muted)' }}>
              <span className="w-1.5 h-1.5 rounded-full block" style={{ background: 'var(--ok)' }} />
              {savedAt ? `Saved ${fmtAgo(now - savedAt)}` : 'Saving…'} · this sitting survives a refresh or a dropped connection
              {resumed && ' · resumed'}
            </div>
          </div>
        </div>
      </div>

      {/* ---- Palette rail ---- */}
      <aside
        className="w-[258px] shrink-0 overflow-y-auto scroll-panel hidden lg:block"
        style={{ borderLeft: '1px solid var(--border)', background: 'var(--bg-panel)', padding: '18px 16px 32px 16px' }}
      >
        <div className="font-mono text-[9px] uppercase mb-3" style={{ letterSpacing: '0.12em', color: 'var(--text-muted)' }}>
          Question palette
        </div>
        <div className="grid gap-[5px] mb-4" style={{ gridTemplateColumns: 'repeat(8, 1fr)' }}>
          {items.map((item, i) => {
            const st: PaletteState = i === idx ? 'now'
              : marked.has(item.id) ? 'marked'
              : item.id in answers ? 'answered'
              : seen.has(item.id) ? 'seen'
              : 'unseen';
            const s = PALETTE_STYLE[st];
            return (
              <button
                key={item.id}
                onClick={() => go(i)}
                title={`${i + 1} — ${s.title}`}
                className="rounded-[5px] font-mono text-[9px] font-semibold flex items-center justify-center"
                style={{ aspectRatio: '1', border: `1px solid ${s.bd}`, background: s.bg, color: s.fg }}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
        <div className="flex flex-col gap-2 pt-3.5" style={{ borderTop: '1px solid var(--border)' }}>
          {([
            ['answered', 'Answered', paletteCounts.answered],
            ['marked', 'Marked for review', paletteCounts.marked],
            ['seen', 'Seen, not answered', paletteCounts.seen],
            ['unseen', 'Not seen', paletteCounts.unseen],
          ] as [PaletteState, string, number][]).map(([st, label, count]) => (
            <div key={st} className="flex items-center gap-[9px]">
              <span
                className="w-3.5 h-3.5 rounded shrink-0"
                style={{ border: `1px solid ${PALETTE_STYLE[st].bd}`, background: PALETTE_STYLE[st].bg }}
              />
              <span className="text-[11px] flex-1" style={{ color: 'var(--text-secondary)' }}>{label}</span>
              <span className="font-mono text-[11px] font-semibold" style={{ color: PALETTE_STYLE[st].fg }}>{count}</span>
            </div>
          ))}
        </div>
      </aside>

      {confirming && (
        <SubmitConfirm
          total={items.length}
          answered={answeredCount}
          marked={marked.size}
          negative={negative}
          onCancel={() => setConfirming(false)}
          onConfirm={submit}
        />
      )}
    </div>
  );
}

// ---- Submit confirmation: the unanswered count in a --warn panel, and an
// explicit statement of what a blank costs, before anything is committed.
function SubmitConfirm({
  total, answered, marked, negative, onCancel, onConfirm,
}: { total: number; answered: number; marked: number; negative: number; onCancel: () => void; onConfirm: () => void }) {
  const blank = total - answered;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'color-mix(in srgb, var(--bg-app) 78%, transparent)' }}>
      <div className="w-full max-w-[440px] rounded-xl p-5" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', boxShadow: 'var(--sh-3)' }}>
        <div className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Submit this test?</div>
        <div className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>You cannot return to it after submitting.</div>

        {blank > 0 && (
          <div
            className="rounded-lg p-3 mb-3 text-[13px]"
            style={{ border: '1px solid var(--warn)', background: 'color-mix(in srgb, var(--warn) 12%, transparent)', color: 'var(--text-primary)' }}
          >
            <strong>{blank} of {total} questions are unanswered.</strong>{' '}
            Blanks score zero{negative > 0 ? ' — but they cost no marks either, unlike a wrong answer.' : '.'}
          </div>
        )}
        {marked > 0 && (
          <div className="text-[13px] mb-3" style={{ color: 'var(--text-secondary)' }}>
            {marked} still marked for review.
          </div>
        )}
        <div className="font-mono text-[11px] mb-4" style={{ color: 'var(--text-muted)' }}>
          {answered} answered · {blank} blank{negative > 0 ? ` · −${negative} per wrong answer` : ' · no negative marking'}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={onCancel} className="px-4 py-2.5 rounded-lg text-[13px] flex-1" style={{ minHeight: 44, border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
            Keep working
          </button>
          <button onClick={onConfirm} className="px-4 py-2.5 rounded-lg text-[13px] font-semibold flex-1" style={{ minHeight: 44, background: 'var(--accent)', color: 'var(--on-accent)' }}>
            Submit test
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- Results (build-order.md §4.2, minus the two panels that would need
// data this platform does not have — see the header note).
function ResultsView({
  title, items, answers, score, negative, elapsedSec, onExit,
}: {
  title: string;
  items: McqBankQuestion[];
  answers: Record<string, number>;
  score: { correct: number; wrong: number; blank: number; marks: number };
  negative: number;
  elapsedSec: number;
  onExit: () => void;
}) {
  const bySubject = useMemo(() => {
    const map = new Map<string, { subject: string; correct: number; total: number }>();
    for (const item of items) {
      const row = map.get(item.subject) ?? { subject: item.subject, correct: 0, total: 0 };
      row.total += 1;
      if (answers[item.id] === item.answerIndex) row.correct += 1;
      map.set(item.subject, row);
    }
    return [...map.values()].sort((a, b) => b.correct / b.total - a.correct / a.total);
  }, [items, answers]);

  const wrongIds = items.filter((i) => i.id in answers && answers[i.id] !== i.answerIndex);
  const pct = Math.round((score.correct / items.length) * 100);

  return (
    <div className="h-full overflow-y-auto scroll-panel">
      <div className="max-w-[760px] mx-auto px-6 py-8 flex flex-col gap-4">
        <div>
          <div className="font-mono text-[9px] uppercase" style={{ letterSpacing: '0.12em', color: 'var(--text-muted)' }}>Result</div>
          <h1 className="text-xl font-medium tracking-tight" style={{ color: 'var(--text-primary)' }}>{title}</h1>
        </div>

        <div className="rounded-xl p-5" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
          <div className="flex items-end gap-3 mb-1">
            <span className="font-mono font-semibold tabular-nums" style={{ fontSize: 40, lineHeight: 1, color: 'var(--text-primary)' }}>
              {score.marks % 1 === 0 ? score.marks : score.marks.toFixed(2)}
            </span>
            <span className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
              marks of {items.length} · {pct}% correct · {fmtClock(elapsedSec)}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
            {[
              { value: score.correct, label: 'correct', color: 'var(--ok)' },
              { value: score.wrong, label: negative > 0 && score.wrong > 0 ? `wrong · −${(score.wrong * negative).toFixed(2)}` : 'wrong', color: 'var(--bad)' },
              { value: score.blank, label: 'left blank', color: 'var(--muted)' },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-mono text-[22px] font-semibold tabular-nums" style={{ color: s.color }}>{s.value}</div>
                <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* By subject — every row opens those questions as a bank filter.
            That link is the entire point of this screen (§4.2). */}
        <div className="rounded-xl p-5" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
          <div className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>By subject</div>
          <div className="flex flex-col gap-2">
            {bySubject.map((row) => {
              const rowPct = Math.round((row.correct / row.total) * 100);
              const weak = rowPct < 65;
              return (
                <Link
                  key={row.subject}
                  to={`/mpsc?tab=browser&subject=${encodeURIComponent(row.subject)}`}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg"
                  style={{ border: '1px solid var(--border)' }}
                >
                  <span className="w-1.5 h-6 rounded-full shrink-0" style={{ background: hueFor(row.subject) }} />
                  <span className="text-[13px] flex-1 capitalize" style={{ color: 'var(--text-primary)' }}>{row.subject.replace('-', ' ')}</span>
                  <span className="font-mono text-[11px]" style={{ color: 'var(--text-secondary)' }}>{row.correct} / {row.total}</span>
                  <span className="font-mono text-[13px] font-semibold w-12 text-right" style={{ color: weak ? 'var(--bad)' : 'var(--ok)' }}>{rowPct}%</span>
                  <span className="text-[11px] w-12 text-right" style={{ color: 'var(--accent)' }}>{weak ? 'drill →' : 'review →'}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {wrongIds.length > 0 && (
          <Link
            to={`/mpsc?tab=browser&subject=${encodeURIComponent(bySubject[bySubject.length - 1]?.subject ?? '')}`}
            className="rounded-xl p-4 flex items-center gap-3"
            style={{ background: 'var(--bg-panel)', border: '1px solid var(--accent)' }}
          >
            <div className="flex-1">
              <div className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                Weakest area: {bySubject[bySubject.length - 1]?.subject.replace('-', ' ')}
              </div>
              <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Generated from this attempt · opens as a bank filter</div>
            </div>
            <span style={{ color: 'var(--accent)' }}>→</span>
          </Link>
        )}

        <div className="text-sm font-semibold mt-2" style={{ color: 'var(--text-primary)' }}>Review</div>
        <div className="flex flex-col gap-2.5">
          {items.map((item, i) => {
            const p = answers[item.id];
            const unanswered = !(item.id in answers);
            const correct = p === item.answerIndex;
            return (
              <div key={item.id} className="rounded-lg p-4" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
                <div className="flex items-start gap-2 mb-2">
                  <span className="font-mono text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{i + 1}.</span>
                  <p className="text-sm font-medium leading-relaxed flex-1" style={{ color: 'var(--text-primary)' }}>{item.question}</p>
                  <span className="text-sm shrink-0">{unanswered ? '⭘' : correct ? '✅' : '❌'}</span>
                </div>
                <div className="flex flex-col gap-1 ml-6">
                  {item.options.map((opt, oi) => {
                    const isAnswer = oi === item.answerIndex;
                    const isPicked = oi === p;
                    const style: React.CSSProperties = isAnswer
                      ? { color: 'var(--ok)', fontWeight: 600 }
                      : isPicked ? { color: 'var(--bad)', textDecoration: 'line-through' }
                      : { color: 'var(--text-secondary)' };
                    return (
                      <div key={oi} className="text-[13px]" style={style}>
                        <span className="opacity-60 mr-1.5 font-mono">{String.fromCharCode(97 + oi)}.</span>{opt}{isAnswer && ' ✓'}
                      </div>
                    );
                  })}
                </div>
                {item.explanation && (
                  <div className="mt-2 ml-6 text-[12px] leading-relaxed rounded px-3 py-2" style={{ background: 'var(--bg-panel-elev)', color: 'var(--text-secondary)' }}>
                    {item.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button onClick={onExit} className="self-start px-4 py-2.5 rounded-lg text-[13px] font-semibold mt-2" style={{ minHeight: 44, background: 'var(--accent)', color: 'var(--on-accent)' }}>
          Done
        </button>
      </div>
    </div>
  );
}

export default TestPlayer;
