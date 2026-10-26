import type { BankQuestion, QuestionBank } from './types';
import { polityCodexBank } from './polity-codex';
import { mpscStateTaxOfficer } from './mpsc-state-tax-officer';
import { mizoramStatHandbook2024 } from './mizoram-statistical-handbook-2024';
import { assistantControllerOfMines2026 } from './assistant-controller-of-mines-2026';
import { mpscUdcLdc } from './mpsc-udc-ldc';
import { zzrMock2026 } from './zzr-mock-2026';
import { groupBGeneralPapers, groupBGeneralQuestions } from './mpsc-group-b-general';
import { isGeneralStudyPaperSubjectTechnical } from '@/lib/technicalPosts';

// Keep specialty records and duplicate sources in their generated bank, while registering
// only the general-study pool for the UDC/LDC module and its catalog counts.
const excludedStudyPaperIds = new Set(groupBGeneralPapers
  .filter((paper) => paper.duplicateOf || isGeneralStudyPaperSubjectTechnical(paper.paperSubject, paper.id))
  .map((paper) => paper.id));
const groupBStudyPapers = groupBGeneralPapers.filter((paper) => !excludedStudyPaperIds.has(paper.id));
const groupBStudyQuestions = groupBGeneralQuestions.filter((question) =>
  !question.paperId || !excludedStudyPaperIds.has(question.paperId));

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
  zzrMock2026,
  {
    ...mpscUdcLdc,
    title: 'UDC / LDC / Group B',
    description: `${mpscUdcLdc.description} Plus ${groupBStudyQuestions.length.toLocaleString()} general and computer-knowledge question rows from the Group B archive.`,
    questions: [...mpscUdcLdc.questions, ...groupBStudyQuestions],
    papers: [...(mpscUdcLdc.papers ?? []), ...groupBStudyPapers],
  },
];

export const allQuestions: BankQuestion[] = banks.flatMap((b) => b.questions);

export function getBank(id: string): QuestionBank | undefined {
  return banks.find((b) => b.id === id);
}

// All concept primers (Science, History, Polity, Economy, Geography, English, etc.)
// merged from every primers-*.json — see all-primers.ts for the full unit list.
export { allPrimers, PRIMER_CATEGORIES, UNIT_LABELS, type Primer } from './all-primers';
