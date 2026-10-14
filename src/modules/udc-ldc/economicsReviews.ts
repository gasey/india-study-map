import type { BankQuestion } from '@/data/banks/types';
import answerReviews from '../../../tools/udc-ldc-build/economics-answer-reviews.json';
import workedExplanations from '../../../tools/udc-ldc-build/economics-worked-explanations.json';
import disputes from '../../../tools/udc-ldc-build/economics-disputes.json';
import descriptiveNotes from '../../../tools/udc-ldc-build/economics-descriptive-notes.json';

type AnswerReview = {
  id: string;
  expectedStem: string;
  expectedOptions: string[];
  correctedOptions?: string[];
  correctedStem?: string;
  status: string;
  answerIndex: number | null;
  explanation: string;
  sourceHref: string;
  printedPage: number;
};

const reviewedById = new Map((answerReviews.items as AnswerReview[]).map(row => [row.id, row]));
const explanationsById = workedExplanations.items as Record<string, {
  expectedStem: string;
  expectedOptions?: string[];
  expectedAnswerIndex: number;
  explanation: string;
  mode?: string;
}>;
type Dispute = {
  id: string;
  expectedStem: string;
  expectedOptions: string[];
  expectedAnswerIndex: number;
  status: string;
  explanation: string;
  replacementAnswerIndex?: number | null;
  correctedStem?: string;
  correctedOptions?: string[];
  sourceHref?: string;
};
const disputesById = new Map((disputes.items as Dispute[]).map(row => [row.id, row]));
const descriptiveById = descriptiveNotes.items as Record<string, { expectedStem: string; explanation: string }>;

function checkedPageHref(q: BankQuestion, page: number): string | undefined {
  return q.sourceHref?.startsWith('/papers/')
    ? `${q.sourceHref.split('#')[0]}#page=${page}`
    : q.sourceHref;
}

/** Preserve source and key gates while applying stem-checked study reviews. */
export function withEconomicsReview(q: BankQuestion): BankQuestion {
  const descriptive = descriptiveById[q.id];
  if (descriptive && q.type === 'descriptive' && q.question === descriptive.expectedStem) {
    return { ...q, explanation: descriptive.explanation };
  }
  const dispute = disputesById.get(q.id);
  if (dispute && q.type !== 'descriptive' && q.question === dispute.expectedStem
      && JSON.stringify(q.options) === JSON.stringify(dispute.expectedOptions)
      && q.answerIndex === dispute.expectedAnswerIndex) {
    const base = {
      ...q,
      question: dispute.correctedStem ?? q.question,
      options: dispute.correctedOptions ?? q.options,
      sourceHref: dispute.sourceHref ?? q.sourceHref,
      sourceReviewed: true,
      explanation: dispute.explanation,
    };
    if (dispute.status === 'official_repaired') return base;
    if (dispute.status === 'corrected' && dispute.replacementAnswerIndex !== null
        && dispute.replacementAnswerIndex !== undefined) {
      return { ...base, answerIndex: dispute.replacementAnswerIndex,
        answerSource: 'derived', answerConfidence: 'medium', disputeNote: dispute.explanation };
    }
    return { ...base, answerIndex: -1, sourceReview: true,
      officialAnswerCandidates: q.answerSource === 'official' ? [q.answerIndex] : q.officialAnswerCandidates,
      disputeNote: dispute.explanation };
  }
  const review = reviewedById.get(q.id);
  if (review && q.type !== 'descriptive' && q.question === review.expectedStem
      && JSON.stringify(q.options) === JSON.stringify(review.expectedOptions)
      && (q.answerIndex < 0 || q.answerIndex === review.answerIndex)) {
    if ((review.status === 'solved' || review.status === 'official_restored') && review.answerIndex !== null) {
      return {
        ...q,
        question: review.correctedStem ?? q.question,
        options: review.correctedOptions ?? q.options,
        sourceHref: checkedPageHref(q, review.printedPage),
        answerIndex: review.answerIndex,
        answerSource: review.status === 'official_restored' ? 'official' : 'derived',
        answerConfidence: review.status === 'official_restored' ? undefined : 'medium',
        sourceReview: false,
        sourceReviewed: true,
        explanation: review.explanation,
      };
    }
    return {
      ...q,
      question: review.correctedStem ?? q.question,
      options: review.correctedOptions ?? q.options,
      sourceHref: checkedPageHref(q, review.printedPage),
      answerIndex: -1,
      sourceReview: true,
      sourceReviewed: true,
      disputeNote: review.explanation,
      explanation: review.explanation,
    };
  }
  const worked = explanationsById[q.id];
  if (worked && q.type !== 'descriptive' && q.question === worked.expectedStem
      && q.answerIndex === worked.expectedAnswerIndex
      && (!worked.expectedOptions || JSON.stringify(q.options) === JSON.stringify(worked.expectedOptions))
      && (worked.mode === 'brief' ? q.explanation.length < 90
        : worked.mode === 'long' ? true
          : q.answerSource === 'official' && q.explanation?.includes('not a worked derivation'))) {
    return { ...q, explanation: worked.explanation };
  }
  return q;
}
