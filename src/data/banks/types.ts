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

export type QuestionType = 'mcq' | 'descriptive';

/**
 * One lettered sub-question (a, b, c… up to z) within a descriptive/
 * case-study question — e.g. a comprehension passage's numbered
 * sub-questions, or a multi-part written-response prompt. Each sub-part
 * is independently flaggable/correctable via QuestionReviewPanel.
 */
export interface DescriptiveSubpart {
  /** 'a'..'z', in display order. */
  label: string;
  text: string;
  guidance?: string;
  wordLimit?: number;
  marks?: number;
  /** Reference/study-pointer answer — not auto-scored, shown like the
   *  existing essay/précis "study-pointer framing" once revealed. */
  modelAnswer?: string;
}

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
  year?: number;
  /** Original source file, relative to its archive root — for provenance/audit. */
  sourceFile?: string;
}

interface BankQuestionBase {
  /** Globally unique — prefix with the bank id, e.g. 'codex-hist-001'. */
  id: string;
  subject: SubjectId | 'gk' | 'current-affairs' | 'english' | 'reasoning' | 'science' | 'economics' | 'polity' | 'geography' | 'history' | 'chemistry' | 'physics' | 'biology';
  /** Machine topic id (filterable), e.g. 'fr', 'parl'. */
  topic: string;
  /** Human topic label, e.g. 'Fundamental Rights'. */
  topicLabel: string;
  difficulty: BankDifficulty;
  /** Reading passage the question depends on (comprehension sections) —
   *  shown above the question when present. */
  passage?: string;
  question: string;
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
  /**
   * Provenance of `answerIndex` — the difference between "the Commission says
   * so" and "we worked it out".
   *   'official' — taken from a published MPSC final answer key. Authoritative.
   *   'derived'  — solved by the extraction pipeline. Can be wrong.
   * Absent means 'derived': every pre-existing record was pipeline-solved.
   * Shown as a badge, so a guess is never mistaken for a real key.
   */
  answerSource?: 'official' | 'derived';
  /** For answerSource: 'official' — the notification that published the key,
   *  so a disputed answer can be traced to its source document. */
  answerKeyRef?: string;
  /**
   * The printed options are IMAGES (picture-sequence / figure-matrix items in
   * the non-verbal reasoning sections), so there is no option text to store and
   * `options` is empty. Such a question is displayed read-only and kept out of
   * scored mock tests — it can't be answered from text alone. Flagging it beats
   * the old behaviour, where the extractor filled these with OCR debris.
   */
  figureBased?: boolean;
  /**
   * MPSC withdrew this question and awarded the mark to every candidate — the
   * published key prints "Compensated" instead of an option letter. There is no
   * correct answer, so `answerIndex` is -1 and the question is kept out of
   * scored mock tests rather than counting against the candidate.
   */
  compensated?: boolean;
  /**
   * The official key's answer looks factually wrong (this does happen with
   * current-affairs questions). `answerIndex` still holds what the Commission
   * published — that is what a real paper would have marked — but the objection
   * is recorded and shown, rather than being silently swallowed or, worse,
   * "fixed" into a disagreement with the actual exam.
   */
  disputeNote?: string;
  /**
   * The printed paper itself is defective for this question, or the question
   * has a layout the standard a/b/c/d extraction can't handle safely:
   * `'duplicate-options'`, where the same option text is offered twice (2016
   * English-II Q15 lists "has worked" as both (a) and (b); 2019 GS-III Q34
   * lists "Phosphorus" as both (a) and (d)), verified against the source PDF
   * so the text is kept as printed but the question cannot be answered as
   * set; or `'hand-transcribed-matching-table'`, a "match List-I with
   * List-II via a Codes grid" question (FC&CAS-2019 GS-I Q38/43/50/56) whose
   * real answer options are rows of a small matrix the regex-based parser
   * would otherwise mis-split — transcribed by hand instead of guessed at.
   * Both are kept out of scored mock tests rather than counting against the
   * candidate.
   */
  sourceDefect?: 'duplicate-options' | 'hand-transcribed-matching-table';
}

export interface McqBankQuestion extends BankQuestionBase {
  type?: 'mcq';
  options: string[];
  answerIndex: number;
}

/**
 * A question with no single scoreable answer — essay/précis prompts, or a
 * case-study/comprehension item broken into lettered sub-parts (a..z).
 * `options`/`answerIndex` are kept optional here too: some legacy records
 * (essay "pick one of these topics" prompts) store a plain reference list
 * in `options` for display, not as MCQ choices.
 */
export interface DescriptiveBankQuestion extends BankQuestionBase {
  type: 'descriptive';
  subparts?: DescriptiveSubpart[];
  guidance?: string;
  wordLimit?: number;
  options?: string[];
  answerIndex?: number;
}

export type BankQuestion = McqBankQuestion | DescriptiveBankQuestion;

/** True for anything scoreable as a flat-option MCQ — the default for any
 *  record that doesn't explicitly declare `type: 'descriptive'`. */
export function isMcqQuestion(q: BankQuestion): q is McqBankQuestion {
  return q.type !== 'descriptive';
}

/** Guarantees an explicit `type`, without requiring every existing static
 *  bank record to be rewritten (additive/lossless — absence means 'mcq'). */
export function normalizeQuestion(q: BankQuestion): BankQuestion {
  return q.type === 'descriptive' ? q : { ...q, type: 'mcq' };
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
