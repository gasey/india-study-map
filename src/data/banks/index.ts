import type { BankQuestion, QuestionBank } from './types';
import { polityCodexBank } from './polity-codex';
import { mpscStateTaxOfficer } from './mpsc-state-tax-officer';
import { mizoramStatHandbook2024 } from './mizoram-statistical-handbook-2024';
import { assistantControllerOfMines2026 } from './assistant-controller-of-mines-2026';

// Register banks here — same pattern as chapters.
// Future: upsc-prelims-pyq.ts, current-affairs-2026.ts …
export const banks: QuestionBank[] = [
  {
    id: 'polity-codex',
    title: 'Polity Codex',
    description: 'Full MCQ bank mined from the Polity Codex study guide — 21 topics, colonial statutes to the Sixth Schedule.',
    questions: polityCodexBank,
  },
  mpscStateTaxOfficer,
  mizoramStatHandbook2024,
  assistantControllerOfMines2026,
];

export const allQuestions: BankQuestion[] = banks.flatMap((b) => b.questions);

export function getBank(id: string): QuestionBank | undefined {
  return banks.find((b) => b.id === id);
}

// All concept primers (Science, History, Polity, Economy, Geography, English, etc.)
// merged from every primers-*.json — see all-primers.ts for the full unit list.
export { allPrimers, PRIMER_CATEGORIES, UNIT_LABELS, type Primer } from './all-primers';
