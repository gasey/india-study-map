import { useEffect, useMemo, useRef, useState } from 'react';
import type { BankQuestion, ExamPaper } from '@/data/banks/types';
import { isMcqQuestion } from '@/data/banks/types';
import { mpscUdcLdcPaperMeta } from '@/data/banks/mpsc-udc-ldc';
import { SECTION_LABEL, sectionOf, type SectionId } from './filters';

// ============================================
// Exam display — sit the paper as printed.
//
// The whole paper in printed order, a real clock, and scoring under THAT
// PAPER'S OWN RULE. Negative marking arrived with Gazette Ex-582/2025 on
// 18 Aug 2025, so a February-2025 paper is not penalised and a later one is;
// scoring every paper the same way would teach the wrong exam strategy.
// The rule comes from mpscUdcLdcPaperMeta, never re-derived here.
//
// Unanswered is NOT wrong. Under the penalty regime a blank costs nothing
// while a wrong answer costs a third, which is the single most important
// strategic fact about this exam — so the result screen reports skipped
// separately and says what guessing would have cost.
// ============================================

interface Props {
  papers: ExamPaper[];
  questions: BankQuestion[];
}

type Answers = Record<string, number>;

function fmt(sec: number) {
  const s = Math.max(0, sec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  return `${h}:${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
}

export function ExamView({ papers, questions }: Props) {
  const [paperId, setPaperId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);
  const [left, setLeft] = useState(0);
  const tick = useRef<number | null>(null);

  const paper = papers.find((p) => p.id === paperId);
  const meta = paperId ? mpscUdcLdcPaperMeta[paperId] : undefined;

  const paperQs = useMemo(
    () => questions.filter((q) => q.paperId === paperId && isMcqQuestion(q)),
    [questions, paperId],
  );
  /** Questions that can be scored — a figure-only item has no answer to mark. */
  const scorable = useMemo(
    () => paperQs.filter((q) => isMcqQuestion(q) && q.answerIndex >= 0 && q.options.length > 0),
    [paperQs],
  );

  useEffect(() => {
    if (!paperId || submitted) return;
    tick.current = window.setInterval(() => setLeft((v) => v - 1), 1000);
    return () => {
      if (tick.current) window.clearInterval(tick.current);
    };
  }, [paperId, submitted]);

  useEffect(() => {
    if (left <= 0 && paperId && !submitted && left !== 0) setSubmitted(true);
  }, [left, paperId, submitted]);

  const start = (id: string) => {
    setPaperId(id);
    setAnswers({});
    setSubmitted(false);
    setLeft((mpscUdcLdcPaperMeta[id]?.durationMinutes ?? 180) * 60);
  };

  const result = useMemo(() => {
    if (!submitted || !meta) return null;
    const per = meta.marksPerQuestion;
    let right = 0, wrong = 0, skipped = 0;
    const bySection: Record<string, { right: number; wrong: number; skipped: number }> = {};
    for (const q of scorable) {
      if (!isMcqQuestion(q)) continue;
      const sec = sectionOf(q);
      bySection[sec] ??= { right: 0, wrong: 0, skipped: 0 };
      const a = answers[q.id];
      if (a === undefined) { skipped++; bySection[sec].skipped++; }
      else if (a === q.answerIndex) { right++; bySection[sec].right++; }
      else { wrong++; bySection[sec].wrong++; }
    }
    const gross = right * per;
    const penalty = wrong * per * meta.penaltyFraction;
    return {
      right, wrong, skipped, per,
      gross, penalty, net: gross - penalty,
      max: scorable.length * per,
      bySection,
      // What blind-guessing every skipped question would have been worth.
      guessEV: skipped * per * (0.25 - 0.75 * meta.penaltyFraction),
    };
  }, [submitted, meta, scorable, answers]);

  if (!paper || !meta) {
    return (
      <div>
        <p style={{ fontSize: 14, opacity: 0.8, marginBottom: 14 }}>
          Sit a full paper under exam conditions — printed order, a real clock, and
          scoring under that paper&apos;s own marking rule.
        </p>
        <div style={{ display: 'grid', gap: 8 }}>
          {papers.map((p) => {
            const m = mpscUdcLdcPaperMeta[p.id];
            const n = questions.filter((q) => q.paperId === p.id).length;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => start(p.id)}
                style={{
                  textAlign: 'left', font: 'inherit', padding: '12px 14px', borderRadius: 10,
                  border: '1px solid var(--border, #dcdce3)', background: 'transparent',
                  color: 'inherit', cursor: 'pointer',
                }}
              >
                <div style={{ fontWeight: 600 }}>{p.examName} · {p.paperNumber}</div>
                <div style={{ fontSize: 12.5, opacity: 0.75, marginTop: 3 }}>
                  {p.year} · {n} questions · {m?.marksPerQuestion ?? 2} marks each ·{' '}
                  {(m?.durationMinutes ?? 180) / 60} hours ·{' '}
                  {m?.negativeMarking
                    ? `−1/3 penalty per wrong answer`
                    : 'no negative marking'}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;

  return (
    <div>
      <div
        style={{
          position: 'sticky', top: 0, zIndex: 2, background: 'var(--bg, #fff)',
          borderBottom: '1px solid var(--border, #dcdce3)', padding: '10px 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          gap: 12, flexWrap: 'wrap',
        }}
      >
        <div style={{ fontSize: 13 }}>
          <strong>{paper.examName} · {paper.paperNumber}</strong>
          <span style={{ opacity: 0.7 }}>
            {' '}· {answeredCount}/{scorable.length} answered
          </span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {!submitted && (
            <span
              style={{
                fontVariantNumeric: 'tabular-nums', fontWeight: 700,
                color: left < 300 ? 'var(--bad, #c4462f)' : 'inherit',
              }}
            >
              {fmt(left)}
            </span>
          )}
          <button
            type="button"
            onClick={() => (submitted ? setPaperId(null) : setSubmitted(true))}
            style={{
              font: 'inherit', fontSize: 13, fontWeight: 600, padding: '6px 14px',
              borderRadius: 999, border: 0, cursor: 'pointer',
              background: submitted ? 'var(--border, #ddd)' : 'var(--info, #3b7dd8)',
              color: submitted ? 'inherit' : '#fff',
            }}
          >
            {submitted ? 'Choose another paper' : 'Submit'}
          </button>
        </div>
      </div>

      {result && (
        <div
          style={{
            border: '1px solid var(--border, #dcdce3)', borderRadius: 10,
            padding: '16px 18px', margin: '16px 0', fontSize: 14, lineHeight: 1.6,
          }}
        >
          <div style={{ fontSize: 26, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
            {result.net.toFixed(result.penalty ? 2 : 0)} / {result.max}
          </div>
          <div style={{ opacity: 0.8 }}>
            {result.right} right · {result.wrong} wrong · {result.skipped} skipped
            {result.penalty > 0 && (
              <> · penalty −{result.penalty.toFixed(2)} ({result.wrong} × {result.per}/3)</>
            )}
          </div>

          <table style={{ marginTop: 12, borderCollapse: 'collapse', fontSize: 13 }}>
            <tbody>
              {Object.entries(result.bySection).map(([sec, v]) => (
                <tr key={sec}>
                  <td style={{ padding: '3px 14px 3px 0' }}>
                    {SECTION_LABEL[sec as SectionId] ?? sec}
                  </td>
                  <td style={{ padding: '3px 14px 3px 0', fontVariantNumeric: 'tabular-nums' }}>
                    {v.right}/{v.right + v.wrong + v.skipped}
                  </td>
                  <td style={{ padding: '3px 0', opacity: 0.7 }}>
                    {v.skipped > 0 && `${v.skipped} skipped`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p style={{ margin: '12px 0 0', fontSize: 13, opacity: 0.85 }}>
            {meta.negativeMarking ? (
              <>
                This paper carries the <strong>−1/3 penalty</strong> (Gazette Ex-582/2025).
                A blank costs nothing, so guessing is only worth it when you can eliminate
                at least one option — blind-guessing your {result.skipped} skipped questions
                would have been worth about{' '}
                <strong>{result.guessEV >= 0 ? '+' : ''}{result.guessEV.toFixed(1)}</strong> marks.
              </>
            ) : (
              <>
                This paper was sat <strong>before 18 August 2025</strong>, so there is no
                negative marking — a blank and a wrong answer cost the same, and leaving{' '}
                {result.skipped} unanswered was pure loss. Papers from Aug 2025 onward
                change that.
              </>
            )}
          </p>
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        {paperQs.map((q, i) => {
          if (!isMcqQuestion(q)) return null;
          const unscorable = q.answerIndex < 0 || q.options.length === 0;
          const picked = answers[q.id];
          return (
            <div
              key={q.id}
              style={{
                padding: '14px 0', borderBottom: '1px solid var(--border, #f0f0f3)',
                opacity: unscorable ? 0.55 : 1,
              }}
            >
              <div style={{ display: 'flex', gap: 10 }}>
                <span style={{ opacity: 0.55, fontVariantNumeric: 'tabular-nums', minWidth: 26 }}>
                  {i + 1}.
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: 8 }}>{q.question}</div>
                  {unscorable ? (
                    <div style={{ fontSize: 12.5, color: 'var(--bad, #c4462f)' }}>
                      Not answerable from the source scan — excluded from the score.
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gap: 5 }}>
                      {q.options.map((o, oi) => {
                        const isRight = submitted && oi === q.answerIndex;
                        const isWrongPick = submitted && oi === picked && picked !== q.answerIndex;
                        return (
                          <label
                            key={oi}
                            style={{
                              display: 'flex', gap: 8, alignItems: 'baseline', fontSize: 14,
                              padding: '4px 8px', borderRadius: 6, cursor: submitted ? 'default' : 'pointer',
                              background: isRight
                                ? 'color-mix(in srgb, var(--ok, #2e9e5b) 14%, transparent)'
                                : isWrongPick
                                  ? 'color-mix(in srgb, var(--bad, #c4462f) 14%, transparent)'
                                  : 'transparent',
                            }}
                          >
                            <input
                              type="radio"
                              name={q.id}
                              checked={picked === oi}
                              disabled={submitted}
                              onChange={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                            />
                            <span>{'abcd'[oi]}) {o}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                  {submitted && q.explanation && (
                    <p style={{ margin: '8px 0 0', fontSize: 13, opacity: 0.85 }}>{q.explanation}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
