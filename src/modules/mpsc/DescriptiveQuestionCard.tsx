import type { DescriptiveBankQuestion, DescriptiveSubpart } from '@/data/banks/types';
import type { Correction } from '@/lib/mpscApi';
import { QuestionReviewPanel } from './QuestionReviewPanel';

/**
 * The one global rendering format for descriptive questions (essay/précis
 * prompts, or a case-study/comprehension item broken into lettered
 * sub-parts a..z). `formatVariant` is a stub extension point for future
 * alternate layouts — only 'standard' exists today.
 */
interface Props {
  bankId: string;
  question: DescriptiveBankQuestion;
  correction?: Correction;
  renderEmphasis: (text: string) => React.ReactNode;
  subjectClass?: (topic: string | undefined) => string;
  meta?: React.ReactNode;
  formatVariant?: 'standard';
}

export function DescriptiveQuestionCard({ bankId, question, correction, renderEmphasis, subjectClass, meta }: Props) {
  // Correction overrides only text/model-answer per lettered sub-part —
  // guidance/word-limit/marks always come from the original question.
  const correctedByLabel = new Map((correction?.subparts ?? []).map((cs) => [cs.label, cs]));
  const subparts: DescriptiveSubpart[] | undefined = question.subparts?.map((sp) => {
    const c = correctedByLabel.get(sp.label);
    return c ? { ...sp, text: c.text, modelAnswer: c.modelAnswer ?? sp.modelAnswer } : sp;
  });

  return (
    <div className="sto-card space-y-2">
      <div className="flex items-center gap-2 flex-wrap text-xs">
        {subjectClass && (
          <span className={`sto-pill sto-subject ${subjectClass(question.topic)}`}>{question.topic?.replace(/_/g, ' ')}</span>
        )}
        {correction && <span className="sto-pill" style={{ color: '#2e7d4f', borderColor: '#2e7d4f' }}>✓ corrected by admin</span>}
        {meta && <span className="ml-auto" style={{ color: 'var(--text-secondary)' }}>{meta}</span>}
      </div>

      <p className="text-sm font-medium">{renderEmphasis(correction?.stem ?? question.question)}</p>

      {question.options && question.options.some((o) => o.trim().length > 0) && (
        <ul className="text-sm ml-4 list-disc" style={{ color: 'var(--text-secondary)' }}>
          {question.options.filter((o) => o.trim()).map((o, j) => <li key={j}>{o}</li>)}
        </ul>
      )}

      {subparts && subparts.length > 0 && (
        <div className="space-y-2.5 ml-1">
          {subparts.map((sp) => (
            <div key={sp.label} className="pl-3" style={{ borderLeft: '2px solid var(--border)' }}>
              <p className="text-sm">
                <span className="font-semibold mr-1.5">{sp.label})</span>
                {renderEmphasis(sp.text)}
              </p>
              {(sp.guidance || sp.wordLimit || sp.marks) && (
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                  {sp.guidance}
                  {sp.wordLimit ? ` · ~${sp.wordLimit} words` : ''}
                  {sp.marks ? ` · ${sp.marks} marks` : ''}
                </p>
              )}
              {sp.modelAnswer && (
                <details className="mt-1">
                  <summary className="text-xs cursor-pointer" style={{ color: 'var(--accent)' }}>Study pointer</summary>
                  <p className="text-xs mt-1 p-2 rounded" style={{ background: 'var(--bg-app)', color: 'var(--text-secondary)' }}>{sp.modelAnswer}</p>
                </details>
              )}
              <QuestionReviewPanel bankId={bankId} questionId={question.id} subpartLabel={sp.label} />
            </div>
          ))}
        </div>
      )}

      {correction?.note && (
        <div className="text-xs p-2 rounded" style={{ background: 'var(--accent-soft)', color: 'var(--text-primary)' }}>
          <strong>Admin note:</strong> {correction.note}
        </div>
      )}

      <QuestionReviewPanel bankId={bankId} questionId={question.id} />
    </div>
  );
}
