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
import type { Year } from '@/data/timeline/types';

export type BankDifficulty = 'easy' | 'medium' | 'hard';

/**
 * A real exam paper a question was pulled from — separate from BankQuestion
 * so multiple questions share one record, and so papers from the same exam
 * sitting (Paper-I, Paper-II, ...) can be grouped/compared in the UI.
 */
export interface ExamPaper {
  /** Stable slug, e.g. 'mpsc-direct-2019-general-studies-do-paper-2'. */
  id: string;
  /** Recruitment mode, e.g. 'Departmental', 'Direct', 'Direct_NG', 'LDE'. */
  examType: string;
  /** The exam/recruitment name, e.g. 'Combined Competitive Examination'. */
  examName: string;
  /** Post applied for, if the paper is post-specific, e.g. 'District Officer (DO)'. */
  post?: string;
  /** e.g. 'Paper-I', 'Paper-II' — lets Paper-I/Paper-II of the same sitting be compared. */
  paperNumber?: string;
  /** e.g. 'General Studies', 'General English'. */
  paperSubject: string;
  year: number;
  /** Original source file, relative to its archive root — for provenance/audit. */
  sourceFile?: string;
}

export interface BankQuestion {
  /** Globally unique — prefix with the bank id, e.g. 'codex-hist-001'. */
  id: string;
  subject: SubjectId | 'gk' | 'current-affairs' | 'english' | 'reasoning';
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
  /** Historical year this question is ABOUT (distinct from `year`, the exam
   *  year). Presence puts it on the Chronicle timeline. */
  about?: Year;
  /** Links back to this question's ExamPaper (see QuestionBank.papers). */
  paperId?: string;
}

export interface QuestionBank {
  id: string;
  title: string;
  description: string;
  questions: BankQuestion[];
  /** Real exam papers referenced by questions' paperId — enables browsing/
   *  comparing Paper-I vs Paper-II of the same exam sitting. */
  papers?: ExamPaper[];
}
