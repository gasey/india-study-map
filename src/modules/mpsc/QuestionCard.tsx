import { useState } from 'react';
import { isMcqQuestion, type BankQuestion, type ExamPaper } from '@/data/banks/types';
import type { Correction } from '@/lib/mpscApi';
import { useApp } from '@/lib/store';
import { hueForSubject, tint } from '@/lib/colorMix';
import { renderEmphasis } from '@/lib/renderEmphasis';
import { BANK_ID } from './useMpscData';
import { QuestionReviewPanel } from './QuestionReviewPanel';

// ============================================
// QUESTION CARD — one row of the bank, per components.md's <QuestionCard/>
// spec. Replaces the old plain <table>, which also hardcoded gray/slate
// Tailwind colours and so broke in the parchment/neon themes.
//
// The meta row is load-bearing, and the ANSWER-SOURCE pill most of all —
// README.md lists "answer source is always visible" as a requirement, not a
// preference: a learner memorising a pipeline-derived answer they can't
// check is the worst outcome this app can produce. `answerSource` is absent
// on every MPSC row (the API doesn't return it and the column doesn't
// exist), and per BankQuestion's own doc absent means 'derived' — which is
// true: this bank was solved by the extraction pipeline, not from published
// keys. So it honestly reads "Derived" throughout rather than being hidden.
//
// Deliberately NOT ported from the design: the "★ Save" action (no bookmark
// feature exists for bank questions — a button that does nothing is worse
// than an absent one), the "Diagram" pill (no has_diagram column), and the
// cross-user stats ("68% got this wrong", "attempted 412 times") which need
// other users' answers. The stat line shows only what's really known: this
// device's own attempts, from bankProgress.
// ============================================

const DIFFICULTY_LABEL: Record<string, string> = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };

function pillStyle(color: string, solid = false): React.CSSProperties {
  return {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    padding: '2px 7px',
    borderRadius: 5,
    whiteSpace: 'nowrap',
    border: `1px solid ${solid ? 'transparent' : color}`,
    background: solid ? color : 'transparent',
    color: solid ? 'var(--on-accent)' : color,
  };
}

interface QuestionCardProps {
  q: BankQuestion;
  paper?: ExamPaper;
  correction?: Correction;
  showAnswer: boolean;
}

export function QuestionCard({ q, paper, correction, showAnswer }: QuestionCardProps) {
  const [reviewOpen, setReviewOpen] = useState(false);
  const bankProgress = useApp((s) => s.bankProgress);

  const subjectHue = hueForSubject(q.subject);
  const mcq = isMcqQuestion(q);
  // Absent answerSource means 'derived' — see BankQuestion's own doc comment.
  const official = q.answerSource === 'official';

  const progress = bankProgress[BANK_ID];
  const myAttempts = progress?.attempts[q.id]?.length ?? 0;
  const mastered = progress?.mastered.includes(q.id) ?? false;
  const stat = mastered
    ? 'mastered by you'
    : myAttempts > 0
      ? `you attempted this ${myAttempts}×`
      : '';

  const paperLabel = [paper?.examName, paper?.year, paper?.paperNumber].filter(Boolean).join(' · ');

  // An admin correction overrides the extraction at read time — it never
  // overwrites the original row (see api-contract.md), so the override has
  // to be applied here, at render.
  const options = mcq ? (correction?.options ?? q.options) : [];
  const answerIndex = correction?.answerIndex ?? (mcq ? q.answerIndex : -1);

  return (
    <div className="rounded-lg" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', padding: '15px 17px' }}>
      <div className="flex items-center gap-1.5 flex-wrap mb-2.5">
        <span className="font-mono text-[10px] whitespace-nowrap" style={{ color: 'var(--text-muted)' }} title={q.id}>
          Q-{q.id.slice(0, 8)}
        </span>
        {/* Subject, not topicLabel: for this bank topicLabel is the raw
            source filename ("PAPER-IV- TECHNICAL PAPER-II (CARPENTER)..PDF"),
            which is neither a topic nor readable in a pill. */}
        <span style={{ ...pillStyle(subjectHue), background: tint(subjectHue, 12) }}>{q.subject}</span>
        <span style={pillStyle('var(--text-secondary)')}>{DIFFICULTY_LABEL[q.difficulty] ?? q.difficulty}</span>
        <span style={pillStyle(official ? 'var(--ok)' : 'var(--warn)', official)}>
          {official ? 'Official key' : 'Derived'}
        </span>
        {correction && <span style={pillStyle('var(--ok)')}>✓ Corrected</span>}
        {q.compensated && <span style={pillStyle('var(--info)')}>Compensated</span>}
        {q.figureBased && <span style={pillStyle('var(--info)')}>Figure-based</span>}
        {!mcq && <span style={pillStyle('var(--plum)')}>Descriptive</span>}
        {paperLabel && (
          <span className="ml-auto text-[11px] min-w-0 truncate" style={{ color: 'var(--text-secondary)' }} title={paperLabel}>
            {paperLabel}
          </span>
        )}
      </div>

      {q.passage && (
        <details className="mb-2">
          <summary className="text-xs cursor-pointer select-none" style={{ color: 'var(--accent)' }}>📄 Show passage</summary>
          <p className="text-xs mt-1 p-2 rounded whitespace-pre-wrap" style={{ background: 'var(--bg-panel-elev)', color: 'var(--text-secondary)' }}>
            {q.passage}
          </p>
        </details>
      )}

      <div className="text-sm font-medium mb-2.5" style={{ lineHeight: 1.45, textWrap: 'pretty', color: 'var(--text-primary)' }}>
        {renderEmphasis(correction?.stem ?? q.question)}
      </div>

      {mcq && options.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-[7px] mb-2.5">
          {options.map((text, i) => {
            const correct = showAnswer && i === answerIndex;
            return (
              <div
                key={i}
                className="rounded-lg flex gap-2 items-start text-[13px]"
                style={{
                  border: `1px solid ${correct ? 'var(--ok)' : 'var(--border)'}`,
                  background: correct ? tint('var(--ok)', 10) : 'transparent',
                  padding: '7px 10px',
                  color: 'var(--text-primary)',
                }}
              >
                <span className="font-mono text-[11px] font-bold shrink-0" style={{ color: correct ? 'var(--ok)' : 'var(--text-muted)' }}>
                  {'abcd'[i] ?? i + 1}
                </span>
                <span className="min-w-0">{text}</span>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center gap-3.5 pt-2.5" style={{ borderTop: '1px dashed var(--border)' }}>
        <button onClick={() => setReviewOpen((o) => !o)} className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          🚩 {reviewOpen ? 'Close' : 'Flag an issue'}
        </button>
        <button onClick={() => setReviewOpen((o) => !o)} className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          💬 Discuss
        </button>
        <button onClick={() => setReviewOpen((o) => !o)} className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          📝 Note
        </button>
        {stat && <span className="ml-auto font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>{stat}</span>}
      </div>

      {reviewOpen && (
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          <QuestionReviewPanel bankId={BANK_ID} questionId={q.id} options={mcq ? q.options : undefined} />
        </div>
      )}
    </div>
  );
}
