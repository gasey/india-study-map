import type { BankQuestion, QuestionBank } from './types';
import { polityCodexBank } from './polity-codex';
import { mpscPapers, mpscQuestions } from './mpsc-old-questions';
import { mpscStateTaxOfficer } from './mpsc-state-tax-officer';
import { sciencePrimers } from './science-guide';

// Register banks here — same pattern as chapters.
// Future: upsc-prelims-pyq.ts, current-affairs-2026.ts …
export const banks: QuestionBank[] = [
  {
    id: 'polity-codex',
    title: 'Polity Codex',
    description: 'Full MCQ bank mined from the Polity Codex study guide — 21 topics, colonial statutes to the Sixth Schedule.',
    questions: polityCodexBank,
  },
  {
    id: 'mpsc-old-questions',
    title: 'MPSC Old Questions',
    description: 'Real Mizoram PSC previous-year papers — browse by exam type, year and post, or take a full paper as a timed MCQ test.',
    questions: mpscQuestions,
    papers: mpscPapers,
  },
  mpscStateTaxOfficer,
];

export const allQuestions: BankQuestion[] = banks.flatMap((b) => b.questions);

export function getBank(id: string): QuestionBank | undefined {
  return banks.find((b) => b.id === id);
}

// Science education reference — 75 concept primers covering all major science topics
export { sciencePrimers } from './science-guide';
