// ============================================
// QUESTION BANK SCHEMA
//
// Banks are content modules *decoupled* from map chapters:
// PYQ sets, mock tests, codex MCQs, current-affairs quizzes.
// Adding a bank = one file in src/data/banks/ + registering
// it in src/data/banks/index.ts — exactly like chapters.
//
// Cross-linking to the map is optional and tag-based:
// a question with tags ['mizoram'] will surface every map
// chapter sharing that tag ("View on map").
// ============================================

import type { SubjectId } from '@/types';

export type BankDifficulty = 'easy' | 'medium' | 'hard';

export interface BankQuestion {
  /** Globally unique — prefix with the bank id, e.g. 'codex-hist-001'. */
  id: string;
  subject: SubjectId | 'gk' | 'current-affairs';
  /** Machine topic id (filterable), e.g. 'fr', 'parl'. */
  topic: string;
  /** Human topic label, e.g. 'Fundamental Rights'. */
  topicLabel: string;
  difficulty: BankDifficulty;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  /** Where this question came from — 'UPSC Prelims', 'MPSC', 'Polity Codex'… */
  source?: string;
  /** Exam year for true PYQs, e.g. 2019. */
  year?: number;
  /** Concept tags shared with map chapters → enables "View on map". */
  tags?: string[];
}

export interface QuestionBank {
  id: string;
  title: string;
  description: string;
  questions: BankQuestion[];
}
