import { useEffect, useMemo, useRef, useState } from 'react';
import type { BankQuestion } from '@/data/banks/types';
import { useApp } from '@/lib/store';
import { BANK_ID } from './useMpscData';

// ============================================
// MCQ TEST RUNNER — simulates sitting a real paper.
//
// Two phases: answering (navigate freely, flag, timer counts up) and the
// score report (per-question review with correct answers + explanations).
// Every answer also feeds recordBankAttempt so test mode advances the same
// mastery tracking as practice mode, and the finished result is saved via
// recordTestResult for the history/comparison view.
// ============================================

interface Props {
  title: string;
  /** Stable id for saving the result — a paper id or a filter-derived key. */
  targetId: string;
  questions: BankQuestion[];
  onExit: () => void;
}

function fmt(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function TestRunner({ title, targetId, questions, onExit }: Props) {
  const { recordBankAttempt, recordTestResult } = useApp();

  // Freeze the question order for the life of this test.
  const items = useMemo(() => questions, [questions]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [idx, setIdx] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(0);

  useEffect(() => {
    // Timer runs only while answering. Uses wall-clock deltas so a
    // backgrounded tab doesn't undercount.
    if (submitted) return;
    startRef.current = Date.now() - elapsed * 1000;
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startRef.current) / 1000)), 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted]);

  if (items.length === 0) {
    return (
      <div className="p-8 text-center" style={{ color: 'var(--text-secondary)' }}>
        <p className="mb-4">This test has no questions.</p>
        <button onClick={onExit} className="px-4 py-2 rounded-md text-sm font-medium" style={{ background: 'var(--accent)', color: '#fff' }}>
          Back
        </button>
      </div>
    );
  }

  const q = items[idx];
  const answeredCount = Object.keys(answers).length;

  const pick = (optionIdx: number) => {
    if (submitted) return;
    setAnswers((a) => ({ ...a, [q.id]: optionIdx }));
  };

  const toggleFlag = () => {
    setFlagged((prev) => {
      const next = new Set(prev);
      next.has(q.id) ? next.delete(q.id) : next.add(q.id);
      return next;
    });
  };

  const submit = () => {
    const score = items.reduce((n, item) => n + (answers[item.id] === item.answerIndex ? 1 : 0), 0);
    // Feed mastery tracking (only questions the student actually answered).
    for (const item of items) {
      if (item.id in answers) recordBankAttempt(BANK_ID, item.id, answers[item.id] === item.answerIndex);
    }
    recordTestResult({
      targetId,
      label: title,
      score,
      total: items.length,
      durationSec: elapsed,
      answeredAt: Date.now(),
    });
    setSubmitted(true);
    setIdx(0);
  };

  // ---- Score report ----
  if (submitted) {
    const score = items.reduce((n, item) => n + (answers[item.id] === item.answerIndex ? 1 : 0), 0);
    const pct = Math.round((score / items.length) * 100);
    const skipped = items.length - answeredCount;
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="rounded-xl p-6 mb-4 text-center fact-in" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
          <div className="text-3xl mb-1">{pct >= 40 ? '🎉' : '📘'}</div>
          <p className="text-2xl font-semibold mb-1">{score} / {items.length}</p>
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            {pct}% · {fmt(elapsed)} · {skipped > 0 ? `${skipped} skipped` : 'all answered'}
          </p>
          <div className="flex justify-center gap-2">
            <button onClick={onExit} className="px-4 py-2 rounded-md text-sm font-medium" style={{ background: 'var(--accent)', color: '#fff' }}>
              Done
            </button>
          </div>
        </div>

        <p className="label-eyebrow mb-2">Review</p>
        <div className="space-y-3">
          {items.map((item, i) => {
            const picked = answers[item.id];
            const correct = picked === item.answerIndex;
            const unanswered = !(item.id in answers);
            return (
              <div key={item.id} className="rounded-lg p-4" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
                {item.passage && (
                  <div
                    className="mb-2 ml-5 p-2 rounded text-xs leading-relaxed whitespace-pre-wrap"
                    style={{ background: 'var(--bg-panel-elev)', color: 'var(--text-secondary)' }}
                  >
                    {item.passage}
                  </div>
                )}
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{i + 1}.</span>
                  <p className="font-medium text-sm leading-relaxed flex-1">{item.question}</p>
                  <span className="text-sm shrink-0">{unanswered ? '⭘' : correct ? '✅' : '❌'}</span>
                </div>
                <div className="space-y-1 ml-5">
                  {item.options.map((opt, oi) => {
                    const isAnswer = oi === item.answerIndex;
                    const isPicked = oi === picked;
                    let style: React.CSSProperties = { color: 'var(--text-secondary)' };
                    if (isAnswer) style = { color: '#2e7d5b', fontWeight: 600 };
                    else if (isPicked) style = { color: '#a5504a', textDecoration: 'line-through' };
                    return (
                      <div key={oi} className="text-sm" style={style}>
                        <span className="opacity-60 mr-1.5">{String.fromCharCode(65 + oi)}.</span>{opt}
                        {isAnswer && ' ✓'}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2 ml-5 text-xs leading-relaxed rounded px-3 py-2" style={{ background: 'var(--bg-panel-elev)', color: 'var(--text-secondary)' }}>
                  {item.explanation}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ---- Answering ----
  const picked = answers[q.id];
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col h-full">
      {/* Test header */}
      <div className="flex items-center justify-between mb-3 gap-3">
        <div className="min-w-0">
          <p className="font-medium text-sm truncate">{title}</p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{answeredCount}/{items.length} answered</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm tabular-nums px-2 py-1 rounded" style={{ background: 'var(--bg-panel-elev)', color: 'var(--text-secondary)' }}>⏱ {fmt(elapsed)}</span>
          <button onClick={onExit} className="text-xs px-2 py-1 rounded hover:bg-[var(--bg-panel-elev)]" style={{ border: '1px solid var(--border)' }}>Exit</button>
        </div>
      </div>

      {/* Question grid navigator */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {items.map((item, i) => {
          const done = item.id in answers;
          const isCur = i === idx;
          const isFlag = flagged.has(item.id);
          return (
            <button
              key={item.id}
              onClick={() => setIdx(i)}
              className="w-7 h-7 rounded text-xs font-medium transition-colors relative"
              style={{
                background: isCur ? 'var(--accent)' : done ? 'var(--accent-soft)' : 'var(--bg-panel-elev)',
                color: isCur ? '#fff' : 'var(--text-secondary)',
                border: '1px solid var(--border)',
              }}
              title={isFlag ? 'Flagged' : undefined}
            >
              {i + 1}
              {isFlag && <span className="absolute -top-1 -right-1 text-[8px]">🚩</span>}
            </button>
          );
        })}
      </div>

      {/* Current question */}
      <div className="rounded-xl p-6 flex-1 min-h-0 fact-in" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }} key={q.id}>
        <div className="flex items-center gap-2 mb-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
          <span className="px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-panel-elev)' }}>{q.topicLabel}</span>
          <span className="px-1.5 py-0.5 rounded capitalize" style={{ background: 'var(--bg-panel-elev)' }}>{q.difficulty}</span>
          <button onClick={toggleFlag} className="ml-auto px-1.5 py-0.5 rounded hover:bg-[var(--bg-panel-elev)]" style={{ border: '1px solid var(--border)' }}>
            {flagged.has(q.id) ? '🚩 Flagged' : '⚐ Flag'}
          </button>
        </div>
        {q.passage && (
          <div
            className="mb-4 p-3 rounded-lg text-sm leading-relaxed whitespace-pre-wrap"
            style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
          >
            {q.passage}
          </div>
        )}
        <p className="font-medium mb-4 leading-relaxed">
          <span style={{ color: 'var(--text-muted)' }} className="mr-2">{idx + 1}.</span>{q.question}
        </p>
        <div className="space-y-2">
          {q.options.map((opt, i) => {
            const isPicked = i === picked;
            return (
              <button
                key={i}
                onClick={() => pick(i)}
                className="w-full text-left px-3.5 py-2.5 rounded-lg text-sm transition-colors hover:bg-[var(--bg-panel-elev)]"
                style={{
                  background: isPicked ? 'var(--accent-soft)' : 'var(--bg-panel-elev)',
                  border: isPicked ? '1px solid var(--accent)' : '1px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
              >
                <span className="opacity-60 mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Nav footer */}
      <div className="flex items-center justify-between mt-4 gap-2">
        <button
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
          disabled={idx === 0}
          className="px-3 py-2 rounded-md text-sm disabled:opacity-40"
          style={{ border: '1px solid var(--border)' }}
        >
          ← Prev
        </button>
        {idx + 1 < items.length ? (
          <button onClick={() => setIdx((i) => i + 1)} className="px-4 py-2 rounded-md text-sm font-medium" style={{ background: 'var(--accent)', color: '#fff' }}>
            Next →
          </button>
        ) : (
          <button onClick={submit} className="px-4 py-2 rounded-md text-sm font-medium" style={{ background: '#2e7d5b', color: '#fff' }}>
            Submit test
          </button>
        )}
      </div>
    </div>
  );
}

export default TestRunner;
