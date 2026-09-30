import { useEffect, useMemo, useState } from 'react';
import type { BankQuestion } from '@/data/banks/types';
import { isMcqQuestion } from '@/data/banks/types';
import type { ProgressMap } from './useProgress';
import { isAnswerable, optionLetter } from './filters';
import { QuestionText } from './QuestionText';

// ============================================
// Practice drill — answer, get told, move on.
//
// Only serves questions that can actually be MARKED (see isAnswerable): a drill
// that accepts your answer and then cannot say whether it was right is worse
// than one that admits the question isn't ready — it teaches nothing and quietly
// implies a verdict. The filter rail can still surface those; this view refuses
// them and says why.
//
// Nearly all of the bank is now markable: of 1,800 questions only a handful lack
// an answer, and they are the genuinely unrecoverable ones (a mirror-image item
// whose figures scanned as a black block). Most answers are DERIVED rather than
// official, which is a separate caveat carried by the confidence badge, not by
// this view.
// ============================================

interface Props {
  questions: BankQuestion[];
  progress: ProgressMap;
  onAnswer: (questionId: string, correct: boolean) => void;
}

export function PracticeView({ questions, progress, onAnswer }: Props) {
  const pool = useMemo(() => questions.filter(isAnswerable), [questions]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [session, setSession] = useState({ done: 0, right: 0 });

  // Filters changing under the drill would otherwise leave `i` past the end.
  useEffect(() => {
    setI(0);
    setPicked(null);
  }, [pool.length]);

  if (!pool.length) {
    const unmarkable = questions.length;
    // Distinguish "we could not establish an answer" from "this question has
    // no answer to establish". A written prompt is not a gap in the data, and
    // saying the scan let us down when the candidate is looking at an essay
    // question describes a defect that does not exist.
    const written = questions.filter((q) => !isMcqQuestion(q)).length;
    const allWritten = unmarkable > 0 && written === unmarkable;
    return (
      <div
        style={{
          border: '1px solid var(--border, #dcdce3)', borderRadius: 10,
          padding: '18px 20px', fontSize: 14, lineHeight: 1.6,
        }}
      >
        <strong>
          {allWritten ? 'These are written questions.' : 'Nothing here can be marked yet.'}
        </strong>
        <p style={{ margin: '8px 0 0', opacity: 0.85 }}>
          {allWritten
            ? `All ${unmarkable} of them ask for prose — an essay, a précis, a comprehension answer — so there is nothing for a drill to mark. Read them in Browse, where each one shows the marks the paper allots it.`
            : unmarkable > 0
              ? `${unmarkable} question${unmarkable === 1 ? '' : 's'} match your filters, but none of them can be marked — either no answer could be established, or the printed options are figures the scan did not capture. A drill could not tell you whether you were right.`
              : 'No questions match your filters.'}{' '}
          {allWritten
            ? <>Set <em>Question type → Multiple choice</em> to practise.</>
            : <>Set <em>Answer → Has an answer</em> to practise what is ready.</>}
        </p>
      </div>
    );
  }

  const q = pool[Math.min(i, pool.length - 1)];
  if (!isMcqQuestion(q)) return null;
  const answered = picked !== null;
  const correct = answered && picked === q.answerIndex;
  const prior = progress[q.id];

  const choose = (idx: number) => {
    if (answered) return;
    setPicked(idx);
    const ok = idx === q.answerIndex;
    onAnswer(q.id, ok);
    setSession((s) => ({ done: s.done + 1, right: s.right + (ok ? 1 : 0) }));
  };

  const next = () => {
    setPicked(null);
    setI((v) => (v + 1) % pool.length);
  };

  return (
    <div>
      <div
        style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontSize: 13, marginBottom: 10, flexWrap: 'wrap', gap: 8,
        }}
      >
        <span style={{ opacity: 0.75 }}>
          Question {Math.min(i, pool.length - 1) + 1} of {pool.length}
          {prior && (
            <span style={{ marginLeft: 8, opacity: 0.8 }}>
              · seen {prior.n}×, last time {prior.lastCorrect ? 'right' : 'wrong'}
            </span>
          )}
        </span>
        {session.done > 0 && (
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>
            This session: <strong>{session.right}/{session.done}</strong>
          </span>
        )}
      </div>

      <div
        style={{
          border: '1px solid var(--border, #dcdce3)', borderRadius: 10, padding: '18px 20px',
        }}
      >
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 6 }}>{q.topicLabel}</div>
        <div style={{ fontSize: 15.5, marginBottom: 14, lineHeight: 1.5 }}><QuestionText text={q.question} /></div>

        <div style={{ display: 'grid', gap: 8 }}>
          {q.options.map((o, idx) => {
            const isAnswer = idx === q.answerIndex;
            const isPick = idx === picked;
            let border = 'var(--border, #dcdce3)';
            let bg = 'transparent';
            if (answered && isAnswer) {
              border = 'var(--ok, #2e9e5b)';
              bg = 'color-mix(in srgb, var(--ok, #2e9e5b) 12%, transparent)';
            } else if (answered && isPick) {
              border = 'var(--bad, #c4462f)';
              bg = 'color-mix(in srgb, var(--bad, #c4462f) 12%, transparent)';
            }
            return (
              <button
                key={idx}
                type="button"
                onClick={() => choose(idx)}
                disabled={answered}
                style={{
                  textAlign: 'left', font: 'inherit', fontSize: 14.5, padding: '12px 13px',
                  borderRadius: 11, border: `1.5px solid ${border}`, background: bg,
                  color: 'inherit', cursor: answered ? 'default' : 'pointer',
                  display: 'flex', gap: 11, alignItems: 'flex-start', lineHeight: 1.4,
                  transition: 'border-color .15s, background .15s',
                }}
              >
                {/* The letter as a filled marker rather than a dim character --
                    this is the "radio button" read. It also carries the verdict
                    once answered, so the row and its key never disagree. */}
                <span
                  style={{
                    flex: 'none', width: 24, height: 24, borderRadius: '50%',
                    border: `1.5px solid ${answered && (isAnswer || isPick) ? border : 'var(--border, #c9c2af)'}`,
                    background: answered && isAnswer ? 'var(--ok, #2e9e5b)'
                      : answered && isPick ? 'var(--bad, #c4462f)' : 'transparent',
                    color: answered && (isAnswer || isPick) ? '#fff' : 'var(--text-secondary, #6b7180)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11.5, fontWeight: 700, marginTop: 1, textTransform: 'uppercase',
                  }}
                >
                  {optionLetter(idx)}
                </span>
                <span style={{ paddingTop: 2 }}>{o}</span>
              </button>
            );
          })}
        </div>

        {answered && (
          <div style={{ marginTop: 14 }}>
            <div style={{ fontWeight: 700, color: correct ? 'var(--ok, #2e9e5b)' : 'var(--bad, #c4462f)' }}>
              {correct ? 'Correct' : `Not quite — the answer is (${optionLetter(q.answerIndex)})`}
            </div>
            {q.explanation && (
              <p style={{ margin: '6px 0 0', fontSize: 13.5, lineHeight: 1.55, opacity: 0.9 }}>
                {q.explanation}
              </p>
            )}
            {q.answerAsOf && (
              /* Current affairs. The answer was right at the SITTING and may be
                 wrong today — an office-holder, an award, an index ranking. Sits
                 directly under the verdict, because the caption is the whole
                 point: without it this reads as a statement about the present,
                 and on a 2016 paper it very often is not one. */
              <p style={{ margin: '6px 0 0', fontSize: 12.5, color: 'var(--warn, #b06f1a)' }}>
                <strong>Current affairs.</strong> This was the answer as of{' '}
                {q.answerAsOf} — it may since have changed. Worth knowing as the
                kind of thing MPSC asks, not as a fact to memorise.
              </p>
            )}
            {q.disputeNote && (
              /* The marked answer above is unchanged — for an official key it
                 is what the Commission would credit, and that is the thing
                 worth memorising. Say so explicitly, or "Disputed" reads as
                 "we corrected this for you" and the candidate learns the
                 defensible answer instead of the scoring one. */
              <p style={{ margin: '6px 0 0', fontSize: 12.5, color: 'var(--bad, #c4462f)' }}>
                <strong>Disputed:</strong> {q.disputeNote}
                {q.answerKeyRef
                  ? ' The marked answer is still the one MPSC published.'
                  : ''}
              </p>
            )}
            {q.answerKeyRef ? (
              <p style={{ margin: '6px 0 0', fontSize: 11.5, opacity: 0.6 }}>
                Source: {q.answerKeyRef}
              </p>
            ) : q.answerSource === 'transcribed' ? (
              /* Not ours and not the Commission's: a transcription of the
                 printed paper with the answer marked. Worth distinguishing —
                 checked against the one sitting where an official key also
                 exists, it agreed on 158 of 159. Saying "worked out" here would
                 undersell it; saying "official" would oversell it. */
              <p style={{ margin: '6px 0 0', fontSize: 11.5, opacity: 0.6 }}>
                MPSC published no key for this paper. This answer comes from a
                transcription of the paper with the answers marked — measured at
                99.4% against the one sitting that does have an official key.
              </p>
            ) : (
              /* No published key for this sitting — say so, and say how sure
                 the solver was. Graded accuracy: high 97-98%, medium 44%. */
              <p style={{ margin: '6px 0 0', fontSize: 11.5, opacity: 0.6 }}>
                No MPSC key exists for this paper — this answer was worked out
                {q.answerConfidence ? `, stated confidence: ${q.answerConfidence}` : ''}.
              </p>
            )}
            <button
              type="button"
              onClick={next}
              style={{
                marginTop: 12, font: 'inherit', fontSize: 13.5, fontWeight: 600,
                padding: '7px 16px', borderRadius: 999, cursor: 'pointer',
                border: 0, background: 'var(--info, #3b7dd8)', color: '#fff',
              }}
            >
              Next question
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
