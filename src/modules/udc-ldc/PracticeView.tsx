import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { BankQuestion } from '@/data/banks/types';
import { isMcqQuestion } from '@/data/banks/types';
import type { ProgressMap } from './useProgress';
import { BANK_ID, SECTION_COLOUR, isAnswerable, optionLetter, sectionOf, textMode } from './filters';
import type { Confidence } from '@/lib/learning/types';
import { QuestionText } from './QuestionText';
import { QuestionContext } from './QuestionContext';
import { QuestionImage } from './QuestionImage';
import { QuestionReviewPanel } from '@/modules/mpsc/QuestionReviewPanel';
import { groupBGeneralPapers } from '@/data/banks/mpsc-group-b-general';
import { AnswerSources } from './AnswerSources';
import { useFlags } from './useFlags';

export interface PracticeAnswerMeta {
  eventId: string;
  selectedIndex: number;
  durationMs: number;
  confidence?: 'sure' | 'unsure' | 'guess';
  source: 'practice' | 'review';
}

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
  onAnswer: (questionId: string, correct: boolean, meta?: PracticeAnswerMeta) => void;
  onMistakeReason?: (eventId: string, reason: string) => void;
  onAttemptConfidence?: (eventId: string, confidence: Confidence) => void;
  onFinish?: () => void;
}

export function PracticeView({ questions, progress, onAnswer, onMistakeReason, onAttemptConfidence, onFinish }: Props) {
  const pool = useMemo(() => questions.filter(isAnswerable), [questions]);
  const latestPool = useRef(pool);
  const pendingNextId = useRef<string | null>(null);
  useLayoutEffect(() => { latestPool.current = pool; }, [pool]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [session, setSession] = useState({ done: 0, right: 0 });
  const [heldQuestion, setHeldQuestion] = useState<BankQuestion | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [mistakeReason, setMistakeReason] = useState('');
  const [attemptConfidence, setAttemptConfidence] = useState<Confidence | null>(null);
  const answerEvent = useRef<string | null>(null);
  const activeSince = useRef(Date.now());
  const visibleMs = useRef(0);
  const questionCardRef = useRef<HTMLDivElement>(null);
  const { flags } = useFlags();

  // Count foreground time only. Background tabs should not imply slow recall.
  useEffect(() => {
    const visibility = () => {
      if (document.hidden) {
        visibleMs.current += Date.now() - activeSince.current;
      } else activeSince.current = Date.now();
    };
    document.addEventListener('visibilitychange', visibility);
    return () => document.removeEventListener('visibilitychange', visibility);
  }, []);

  if (!pool.length && !heldQuestion) {
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

  // Retain feedback even when recording removes this item from a Never/Wrong
  // filter. The parent remounts the drill when the learner changes filters.
  const q = heldQuestion ?? pool[Math.min(i, pool.length - 1)];
  if (!isMcqQuestion(q)) return null;
  const accent = SECTION_COLOUR[sectionOf(q)];
  const mode = textMode(q);
  const correct = submitted && picked === q.answerIndex;
  const prior = progress[q.id];
  const groupBPaper = groupBGeneralPapers.find((paper) => paper.id === q.paperId);

  const next = () => {
    if (onFinish && i >= pool.length - 1) { onFinish(); return; }
    const currentPool = latestPool.current;
    const targetIndex = currentPool.findIndex(item => item.id === pendingNextId.current);
    const currentIndex = currentPool.findIndex(item => item.id === q.id);
    setPicked(null);
    setSubmitted(false);
    setHeldQuestion(null);
    answerEvent.current = null;
    pendingNextId.current = null;
    setMistakeReason('');
    setAttemptConfidence(null);
    visibleMs.current = 0;
    activeSince.current = Date.now();
    setI(targetIndex >= 0 ? targetIndex : currentIndex >= 0
      ? (currentIndex + 1) % Math.max(1, currentPool.length)
      : Math.min(i, Math.max(0, currentPool.length - 1)));
    requestAnimationFrame(() => questionCardRef.current?.scrollIntoView({ behavior: 'auto', block: 'start' }));
  };

  const submitAnswer = (selectedIndex: number) => {
    if (submitted || answerEvent.current) return;
    const eventId = `practice:${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}:${Math.random()}`}`;
    answerEvent.current = eventId;
    const sourceIndex = pool.findIndex(item => item.id === q.id);
    pendingNextId.current = pool[(sourceIndex + 1) % pool.length]?.id ?? null;
    setHeldQuestion(q);
    setPicked(selectedIndex);
    setSubmitted(true);
    const ok = selectedIndex === q.answerIndex;
    setSession((s) => ({ done: s.done + 1, right: s.right + (ok ? 1 : 0) }));
    onAnswer(q.id, ok, {
      eventId, selectedIndex,
      durationMs: Math.max(0, visibleMs.current + (document.hidden ? 0 : Date.now() - activeSince.current)),
      source: onFinish ? 'review' : 'practice',
    });
  };

  const choose = (idx: number) => submitAnswer(idx);

  return (
    <div className={submitted ? 'udc-practice is-answered' : 'udc-practice'}>
      <div
        style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontSize: 13, marginBottom: 10, flexWrap: 'wrap', gap: 8,
        }}
      >
        <span style={{ opacity: 0.75 }}>
          Question {Math.min(i, Math.max(0, pool.length - 1)) + 1} of {Math.max(1, pool.length)}
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
        ref={questionCardRef}
        className="udc-question-card udc-practice-card"
        style={{
          border: '1px solid var(--border, #dcdce3)',
          borderLeft: `4px solid ${accent}`,
          borderRadius: 10, padding: '18px 20px',
          background: 'var(--bg-panel, transparent)',
        }}
      >
        <div style={{
          fontSize: 11.5, fontWeight: 700, letterSpacing: '.08em',
          textTransform: 'uppercase', marginBottom: 7, color: accent,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          {q.topicLabel}
          {flags[q.id] && (
            <span
              style={{
                width: 7, height: 7, borderRadius: '50%',
                background: 'var(--bad, #c4462f)', flex: 'none',
              }}
              title={`Flagged: ${flags[q.id].issueType.replace(/_/g, ' ')}`}
            />
          )}
        </div>
        {/* Where this question came from. In a drill a question arrives with
            no paper around it, so without this there is no telling a 2016
            current-affairs item from a 2026 one — the exact distinction the
            "answer as of" caption below depends on. `source` is written by
            build_bank from the paper's own printed header. */}
        {q.source && (
          <div style={{ fontSize: 11.5, opacity: 0.65, marginBottom: 9 }}>{q.source}</div>
        )}
        {(q.sourceHref || groupBPaper?.sourceFile) && (
          <a href={q.sourceHref || groupBPaper?.sourceFile} target="_blank" rel="noreferrer" style={{ display: 'inline-block', fontSize: 12, marginBottom: 9 }}>
            Open printed paper ↗
          </a>
        )}
        <QuestionContext direction={q.direction} passage={q.passage} plain={mode.plain} />
        <div className={`udc-question-stem ${mode.stem}`} style={{ fontSize: 15.5, marginBottom: 14, lineHeight: 1.5 }}><QuestionText text={q.question} plain={mode.plain} /></div>
        <QuestionImage path={q.imagePath} />

        <div style={{ display: 'grid', gap: 8 }}>
          {q.options.map((o, idx) => {
            const isAnswer = idx === q.answerIndex;
            const isPick = idx === picked;
            // ⚠️ The accent is used NEAT, not mixed into --border. That token
            // is #241f18 — very nearly black — so `color-mix(accent 35%,
            // var(--border))` came out a dark mud indistinguishable from the
            // plain hairline. Mixing colour into near-black is how this screen
            // ended up looking uncoloured in the first place.
            let border = accent;
            // Keep neutral options white; green is reserved for the confirmed
            // answer so the click result is immediately legible.
            let bg = 'var(--bg-panel, #fff)';
            if (submitted && isAnswer) {
              border = 'var(--ok, #2e9e5b)';
              bg = 'color-mix(in srgb, var(--ok, #2e9e5b) 12%, transparent)';
            } else if (submitted && isPick) {
              border = 'var(--bad, #c4462f)';
              bg = 'color-mix(in srgb, var(--bad, #c4462f) 12%, transparent)';
            }
            return (
              <button
                key={idx}
                type="button"
                onClick={() => choose(idx)}
                disabled={submitted}
                aria-pressed={isPick}
                style={{
                  textAlign: 'left', font: 'inherit', fontSize: 14.5, padding: '12px 13px',
                  borderRadius: 11, border: `1.5px solid ${border}`, background: bg,
                  color: 'inherit', cursor: submitted ? 'default' : 'pointer',
                  outline: isPick && !submitted ? `3px solid color-mix(in srgb, ${accent} 28%, transparent)` : undefined,
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
                    border: `1.5px solid ${submitted && (isAnswer || isPick) ? border : accent}`,
                    background: submitted && isAnswer ? 'var(--ok, #2e9e5b)'
                      : submitted && isPick ? 'var(--bad, #c4462f)' : 'transparent',
                    color: submitted && (isAnswer || isPick) ? '#fff' : accent,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11.5, fontWeight: 700, marginTop: 1, textTransform: 'uppercase',
                  }}
                >
                  {optionLetter(idx)}
                </span>
                <span className={`udc-option-label ${mode.option}`} style={{ paddingTop: 2 }}><QuestionText text={o} plain={mode.plain} /></span>
              </button>
            );
          })}
        </div>

        {!submitted && <p aria-live="polite" style={{ margin: '10px 0 0', fontSize: 12.5, opacity: 0.75 }}>
          Select an option to check your answer.
        </p>}

        {submitted && (
          <div style={{ marginTop: 14 }}>
            {q.paperId?.startsWith('mpsc-group-b-') && <AnswerSources q={q} />}
            <div style={{ fontWeight: 700, color: correct ? 'var(--ok, #2e9e5b)' : 'var(--bad, #c4462f)' }}>
              {correct ? 'Correct' : `Not quite — the answer is (${optionLetter(q.answerIndex)})`}
            </div>
            {q.explanation && (
              <p style={{ margin: '6px 0 0', fontSize: 13.5, lineHeight: 1.55, opacity: 0.9 }}>
                {q.explanation}
              </p>
            )}
            {!correct && onMistakeReason && <label className="udc-mistake-reason">
              What caught you out? <span>(optional)</span>{' '}
              <select value={mistakeReason} onChange={e => {
                const value = e.target.value;
                setMistakeReason(value);
                if (answerEvent.current) onMistakeReason(answerEvent.current, value);
              }}>
                <option value="">Choose a reason</option>
                <option value="concept">Need to learn the concept</option>
                <option value="recall">Could not recall it</option>
                <option value="misread">Misread the question</option>
                <option value="calculation">Calculation slip</option>
                <option value="guess">Guessed</option>
              </select>
            </label>}
            {!correct && onAttemptConfidence && (
              <div style={{ marginTop: 9, fontSize: 12.5 }}>
                <strong>How confident were you?</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 6 }}>
                  {([['sure', 'Sure'], ['unsure', 'Unsure'], ['guess', 'Guessing']] as const).map(([value, label]) => (
                    <button key={value} type="button" onClick={() => {
                      setAttemptConfidence(value);
                      if (answerEvent.current) onAttemptConfidence(answerEvent.current, value);
                    }} aria-pressed={attemptConfidence === value} style={{ border: '1px solid var(--border, #dcdce3)', borderRadius: 999, padding: '5px 11px', background: attemptConfidence === value ? 'var(--info, #3b7dd8)' : 'var(--bg-panel, transparent)', color: attemptConfidence === value ? '#fff' : 'inherit', cursor: 'pointer', font: 'inherit' }}>{label}</button>
                  ))}
                </div>
              </div>
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
                {q.answerKeyRef.startsWith('/')
                  ? <a href={q.answerKeyRef} target="_blank" rel="noreferrer">MPSC final answer key ↗</a>
                  : `Source: ${q.answerKeyRef}`}
                {q.independentAnswerIndex !== undefined && (
                  <> · Independent solution: {optionLetter(q.independentAnswerIndex).toUpperCase()}
                    {q.independentAnswerIndex === q.answerIndex ? ' (agrees)' : ' (differs)'}</>
                )}
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
                {q.independentAnswerSource === 'transcribed'
                  ? 'No matching MPSC key is attached. This study transcription is provisional'
                  : 'No matching MPSC key is attached to this paper — this answer was worked out'}
                {q.answerConfidence ? `, stated confidence: ${q.answerConfidence}` : ''}.
              </p>
            )}
            <p style={{ marginTop: 6, fontSize: 11.5, opacity: 0.65 }} aria-live="polite">
              {correct ? 'Continue when you are ready.' : 'Confidence is optional. Continue when you are ready.'}
            </p>
          </div>
        )}
        {/* Flag / private note / comments, against the review service that
            already backs the other bank — bank-agnostic by (bankId,
            questionId), so this is wiring rather than a second system. It
            gates itself on login and says so, so a logged-out reader is not
            offered a control that would fail. */}
        <QuestionReviewPanel
          bankId={BANK_ID}
          questionId={q.id}
          options={q.options}
          compact
        />
      </div>
      {submitted && <div className="udc-practice-action-bar">
        <button type="button" className="udc-practice-next" onClick={next}>
          {onFinish && i >= pool.length - 1 ? 'Finish session' : 'Next question'} →
        </button>
      </div>}
    </div>
  );
}
