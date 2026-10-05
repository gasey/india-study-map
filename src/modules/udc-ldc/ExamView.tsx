import { useEffect, useMemo, useState } from 'react';
import type { BankQuestion, ExamPaper } from '@/data/banks/types';
import { isMcqQuestion } from '@/data/banks/types';
import { mpscUdcLdcPaperMeta } from '@/data/banks/mpsc-udc-ldc';
import { SECTION_LABEL, optionLetter, sectionOf, type SectionId } from './filters';
import { useAttemptState } from '@/modules/mpsc/useAttemptState';
import { QuestionText } from './QuestionText';
import { QuestionImage } from './QuestionImage';

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
//
// A SITTING SURVIVES A REFRESH. modules/mpsc/useAttemptState.ts already does
// this properly and is reused rather than reimplemented: it persists
// `startedAt` instead of a decrementing counter, so a resumed sitting
// recomputes the CORRECT remaining time rather than gifting back the seconds
// the tab was closed, and it validates a `signature` so a resume can never
// restore answers keyed to a question set that has since changed.
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

/**
 * One sitting of one paper.
 *
 * Split out and mounted with key={paperId} deliberately. useAttemptState
 * initialises its state lazily ONCE on mount — changing its `key` afterwards
 * does not reload, because it was written for a player mounted per attempt.
 * Calling it from a component that outlives the paper choice silently produced
 * a fresh empty sitting on every resume. Remounting respects that contract
 * instead of working around it.
 */
function ExamSitting({
  paper, questions, onExit,
}: { paper: ExamPaper; questions: BankQuestion[]; onExit: () => void }) {
  const paperId = paper.id;
  const [submitted, setSubmitted] = useState(false);
  /**
   * Mark each question as it is answered, rather than only at the end.
   *
   * OFF by default, and that default is the point: a mock test exists to
   * rehearse the real sitting, where nobody tells you mid-paper. Instant
   * feedback is a different exercise — useful for learning a section, useless
   * for practising pace and nerve — so it is opt-in and the UI says which one
   * you are doing. Locked once the paper starts, because switching it halfway
   * makes the score mean neither thing.
   */
  const [instant, setInstant] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const meta = mpscUdcLdcPaperMeta[paperId];

  const paperQs = useMemo(
    () => questions.filter((q) => q.paperId === paperId && isMcqQuestion(q)),
    [questions, paperId],
  );

  /** Changes whenever the question set does, so a stale resume is refused. */
  const signature = useMemo(
    () => `${paperId}:${paperQs.length}:${paperQs[0]?.id ?? ''}`,
    [paperId, paperQs],
  );
  const { state, patch, resumed, clear } = useAttemptState(
    `udc-ldc.exam.${paperId}`, signature, true,
  );
  const answers = state.answers as Answers;
  // Locked once the first answer is in: switching the marking mode halfway
  // makes the resulting score mean neither thing.
  const started = Object.keys(answers).length > 0;
  /** Questions that can be scored — a figure-only item has no answer to mark. */
  const scorable = useMemo(
    () => paperQs.filter((q) => isMcqQuestion(q) && q.answerIndex >= 0 && q.options.length > 0),
    [paperQs],
  );

  // Tick a clock value rather than a countdown: `left` is DERIVED from
  // startedAt below, so a closed tab does not hand back the time it was shut.
  useEffect(() => {
    if (submitted) return;
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [submitted]);

  const left = Math.max(
    0, meta.durationMinutes * 60 - Math.floor((now - state.startedAt) / 1000),
  );

  useEffect(() => {
    if (!submitted && left <= 0) setSubmitted(true);
  }, [left, submitted]);

  const finish = () => {
    setSubmitted(true);
    clear();          // a finished sitting must not be resumed on refresh
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

  const answeredCount = Object.keys(answers).length;

  return (
    <div>
      <div
        style={{
          position: 'sticky', top: 0, zIndex: 2, background: 'var(--bg-app, var(--bg))',
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
          {resumed && !submitted && (
            /* Say so rather than silently restoring — the clock has kept
               running, and a candidate should know why it reads what it does. */
            <span style={{ marginLeft: 8, opacity: 0.75 }}>
              · resumed, clock kept running
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {!submitted && (
            <button
              type="button"
              onClick={() => !started && setInstant((v) => !v)}
              disabled={started}
              title={started
                ? 'Locked once the paper has started — switching midway would make the score mean neither thing'
                : undefined}
              style={{
                border: `1.5px solid ${instant ? 'var(--info, #3b7dd8)' : 'var(--border, #dcdce3)'}`,
                background: instant
                  ? 'color-mix(in srgb, var(--info, #3b7dd8) 12%, transparent)' : 'transparent',
                color: instant ? 'var(--info, #3b7dd8)' : 'inherit',
                borderRadius: 999, padding: '6px 13px', font: 'inherit', fontSize: 12.5,
                fontWeight: 700, cursor: started ? 'not-allowed' : 'pointer',
                opacity: started ? 0.55 : 1,
              }}
            >
              {instant ? 'Marking as you go' : 'Mark at the end'}
            </button>
          )}
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
            onClick={() => (submitted ? onExit() : finish())}
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
              className="udc-question-card"
              style={{
                padding: '14px 0', borderBottom: '1px solid var(--border, #f0f0f3)',
                opacity: unscorable ? 0.55 : 1,
              }}
            >
              <div style={{ display: 'flex', gap: 10 }}>
                <span className="udc-question-number" style={{ opacity: 0.55, fontVariantNumeric: 'tabular-nums', minWidth: 26 }}>
                  {i + 1}.
                </span>
                <div style={{ flex: 1 }}>
                  {q.direction && (
                    <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary, #666)' }}>
                      {q.direction}
                    </div>
                  )}
                  <div className={`udc-question-stem ${q.topic === 'simple_arithmetic' ? 'udc-math-stem' : q.subject === 'reasoning' ? 'udc-reasoning-stem' : ''}`} style={{ marginBottom: 8, lineHeight: 1.55, overflowWrap: 'anywhere' }}><QuestionText text={q.question} plain={q.topic === 'simple_arithmetic'} /></div>
                  <QuestionImage path={q.imagePath} />
                  {q.figureBased && !q.imagePath && (
                    <div style={{
                      margin: '8px 0', padding: '12px', textAlign: 'center',
                      border: '1px dashed var(--border, #dcdce3)', borderRadius: 8,
                      color: 'var(--warn, #b06f1a)', fontSize: 12.5,
                    }}>
                      Figure from the source scan is unavailable; this question is not scored.
                    </div>
                  )}
                  {unscorable ? (
                    <div style={{ fontSize: 12.5, color: 'var(--bad, #c4462f)' }}>
                      Not answerable from the source scan — excluded from the score.
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gap: 5 }}>
                      {q.options.map((o, oi) => {
                        const revealed = submitted || (instant && picked !== undefined);
                        const isRight = revealed && oi === q.answerIndex;
                        const isWrongPick = revealed && oi === picked && picked !== q.answerIndex;
                        return (
                          <label
                            key={oi}
                            style={{
                              display: 'flex', gap: 8, alignItems: 'baseline', fontSize: 14,
                              padding: '4px 8px', borderRadius: 6, cursor: submitted || (instant && picked !== undefined) ? 'default' : 'pointer',
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
                              disabled={submitted || (instant && picked !== undefined)}
                              onChange={() =>
                                patch((st) => ({ answers: { ...st.answers, [q.id]: oi } }))}
                            />
                            <span className={`udc-option-label ${q.topic === 'simple_arithmetic' ? 'udc-math-option' : q.subject === 'reasoning' ? 'udc-reasoning-option' : ''}`}>{optionLetter(oi)}) <QuestionText text={o} plain={q.topic === 'simple_arithmetic'} /></span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                  {(submitted || (instant && answers[q.id] !== undefined)) && q.explanation && (
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


export function ExamView({ papers, questions }: Props) {
  const [paperId, setPaperId] = useState<string | null>(null);
  const paper = papers.find((p) => p.id === paperId);

  if (paper) {
    // key={paper.id} forces a remount per paper — see ExamSitting's note.
    return (
      <ExamSitting
        key={paper.id}
        paper={paper}
        questions={questions}
        onExit={() => setPaperId(null)}
      />
    );
  }

  return (
    <div>
      <p style={{ fontSize: 14, opacity: 0.8, marginBottom: 14 }}>
        Sit a full paper under exam conditions — printed order, a real clock, and
        scoring under that paper&apos;s own marking rule. A sitting in progress
        survives a refresh; the clock keeps running while you are away.
      </p>
      <div style={{ display: 'grid', gap: 8 }}>
        {papers.map((p) => {
          const m = mpscUdcLdcPaperMeta[p.id];
          const n = questions.filter((q) => q.paperId === p.id).length;
          const inProgress = (() => {
            try {
              return Boolean(localStorage.getItem(`jabreeze.attempt.udc-ldc.exam.${p.id}`));
            } catch {
              return false;
            }
          })();
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setPaperId(p.id)}
              style={{
                textAlign: 'left', font: 'inherit', padding: '12px 14px', borderRadius: 10,
                border: `1px solid ${inProgress ? 'var(--info, #3b7dd8)' : 'var(--border, #dcdce3)'}`,
                background: 'transparent', color: 'inherit', cursor: 'pointer',
              }}
            >
              <div style={{ fontWeight: 600 }}>
                {p.examName} · {p.paperNumber}
                {inProgress && (
                  <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--info, #3b7dd8)' }}>
                    · in progress
                  </span>
                )}
              </div>
              <div style={{ fontSize: 12.5, opacity: 0.75, marginTop: 3 }}>
                {p.year} · {n} questions · {m?.marksPerQuestion ?? 2} marks each ·{' '}
                {(m?.durationMinutes ?? 180) / 60} hours ·{' '}
                {m?.negativeMarking ? '−1/3 penalty per wrong answer' : 'no negative marking'}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
