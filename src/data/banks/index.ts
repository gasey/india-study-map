import type { BankQuestion, QuestionBank } from './types';
import { polityCodexBank } from './polity-codex';

// Register banks here — same pattern as chapters.
// Future: upsc-prelims-pyq.ts, mpsc-pyq.ts, current-affairs-2026.ts …
export const banks: QuestionBank[] = [
  {
    id: 'polity-codex',
    title: 'Polity Codex',
    description: 'Full MCQ bank mined from the Polity Codex study guide — 21 topics, colonial statutes to the Sixth Schedule.',
    questions: polityCodexBank,
  },
];

export const allQuestions: BankQuestion[] = banks.flatMap((b) => b.questions);

export function getBank(id: string): QuestionBank | undefined {
  return banks.find((b) => b.id === id);
}
