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
  /** Printed task instruction for questions whose stem is only an example or fragment. */
  direction?: string;
  question: string;
  explanation: string;
  /** Optional source figure/diagram displayed above the answer choices. */
  imagePath?: string;
  /** Where this question came from — 'UPSC Prelims', 'MPSC', 'Polity Codex'… */
  source?: string;
  /** Per-question printed source, including recovered items from another booklet. */
  sourceHref?: string;
  /** General-paper section, independent of the finer topic label. */
  studySection?: 'gk' | 'english' | 'computer' | 'arithmetic' | 'reasoning';
  /** Conventional comprehension MCQs have another mark scheme; drill only. */
  paperExamExcluded?: boolean;
  /** Printed number/section for matching a key, unaffected by filtering. */
  questionNumber?: string;
  /** Text/figure extraction remains under source review; never auto-scored. */
  sourceReview?: boolean;
  /** Printed text checked, but a defective item or unresolved key still prevents scoring. */
  sourceReviewed?: boolean;
  /** Key letters retained when incomplete text or multiple accepted choices prevent scoring. */
  officialAnswerCandidates?: number[];
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
  /**
   * `'transcribed'` is a third-party transcription of the printed paper with
   * the correct option marked — stronger than `'derived'` (which we solved) but
   * weaker than `'official'` (a published MPSC key). It is placed between them
   * on a measurement, not a guess: on the April-2024 sitting, one of only two
   * for which MPSC published a key, the transcription agreed 158/159 = 99.4%.
   * A real key still wins wherever one exists.
   */
  answerSource?: 'official' | 'derived' | 'transcribed';
  /**
   * For answerSource: 'derived' — how sure the solver was.
   *
   * Load-bearing, not decorative. Measured against the one MPSC key that
   * exists for the clerical bank, 'high' answers were 97-98% correct while
   * 'medium' ones were 44% — so a derived answer shown WITHOUT its confidence
   * implies a reliability it may not have. Render it wherever the answer is
   * rendered.
   */
  answerConfidence?: 'high' | 'medium' | 'low';
  /** For answerSource: 'official' — the notification that published the key,
   *  so a disputed answer can be traced to its source document. */
  answerKeyRef?: string;
  /** Independent solved transcription, retained beside an official answer for comparison. */
  independentAnswerIndex?: number;
  independentAnswerSource?: 'solved' | 'transcribed' | 'legacy-inferred';
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
   *
   * `'answer-not-among-options'` is the third: the correct answer is simply not
   * one of the four the Commission printed, so the answer shown is the nearest
   * survivor (MPSC Clerical: the PowerPoint duplicate-slide shortcut offered
   * without Ctrl+D; "study of the structure of the human body" offered without
   * anatomy). Recorded in mpsc-question-bank/state/option-defects.json, where
   * every entry was read back off the source page first — an option lost in
   * EXTRACTION looks identical and is our bug to fix, not the paper's. The
   * reader is warned via `disputeNote`, because a confident-looking page that
   * states a wrong fact is worse than one admitting the item is broken.
   */
  sourceDefect?: 'duplicate-options' | 'hand-transcribed-matching-table'
    | 'answer-not-among-options';
  /**
   * For General Knowledge only: whether the answer is durable.
   *
   * `'current'` means the answer was correct AT THE SITTING and may well be
   * wrong now — office-holders, award winners, summit venues, index rankings,
   * "recently launched", and survey figures that get republished. This bank
   * spans 2016–2026, so roughly a third of its GK is in that position; shown as
   * a bare fact, those items actively mislead. Always paired with
   * `answerAsOf`. `'static'` is history, geography, polity, science, Mizo
   * culture — an answer that does not move.
   *
   * The test used when tagging: *would the correct answer be different if this
   * same question were asked today?* Note that a year in the stem does not
   * decide it — "the Mizo National Front uprising of 1966" is static; the year
   * is part of the fact, not part of the news.
   *
   * Useful for more than a caption: current affairs from a 2016 sitting is not
   * worth memorising for a 2026 exam, so the drill can exclude it.
   */
  gkKind?: 'static' | 'current';
  /**
   * For General Knowledge only: which GK sub-topic the question
   * belongs to. The staged papers print no section finer than
   * "General Knowledge", so this is content-classified at build
   * time from the checked-in table in
   * tools/udc-ldc-build/gk-subtopics.json (guarded there: every
   * GK question must have an entry, and every entry must match a
   * question in the build).
   *
   * Categories follow the syllabus taxonomy in PLAN-UDC-LDC.md §5 —
   * current-affairs, modern-indian-history, art-culture,
   * polity-constitution, geography, economy, general-science,
   * science-tech — plus 'mizoram', which that taxonomy makes a
   * top-level subject of its own. 'general' is the honest catch-all:
   * a keyword classifier cannot say, and a confident wrong label
   * would be worse than none.
   */
  gkTopic?:
    | 'current-affairs' | 'modern-indian-history' | 'art-culture'
    | 'polity-constitution' | 'geography' | 'economy'
    | 'general-science' | 'science-tech' | 'mizoram' | 'general';
  /**
   * Human-readable sitting date ("June 2018") for a `gkKind: 'current'`
   * question, so its answer is never presented as being true now. Derived from
   * the paper's exam date at build time.
   */
  answerAsOf?: string;
  /**
   * The SOURCE PUBLICATION contradicts itself — two tables/sections of the
   * same reference (not an exam key vs. our judgment, that's `disputeNote`)
   * give different figures for what should be the same fact, e.g. a
   * statistical handbook's district chapter and its all-India chapter
   * printing two different population totals for the same Census. The
   * question's `answerIndex` still holds a real, individually-sourced
   * printed figure — this is a "the reference book disagrees with itself,
   * here's the other number and where it's printed" flag, shown as its own
   * badge so a learner (or an exam-setter) isn't caught out by quoting the
   * one this app didn't pick.
   */
  sourceNote?: string;
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
  /**
   * What the paper allots this written question — 25 for an essay, 10 for a
   * précis, 2 for a short-answer item. READ from the printed mark allocation
   * ("(25)", "(3x6=18)", "(10×1=10)"), never assigned by us, so it is safe to
   * show as the paper's own figure. Absent where the paper printed none.
   *
   * Worth surfacing because it is the whole case for these questions being
   * here: the written half is 50-60 of a clerical Paper-I's marks.
   */
  marks?: number;
}

export type BankQuestion = McqBankQuestion | DescriptiveBankQuestion;

/** True for anything scoreable as a flat-option MCQ — the default for any
 *  record that doesn't explicitly declare `type: 'descriptive'`. */
export function isMcqQuestion(q: BankQuestion): q is McqBankQuestion {
  return q.type !== 'descriptive';
}

/** A graded game/drill needs a readable question and a usable answer. */
export function isScorableMcq(q: BankQuestion): q is McqBankQuestion {
  return isMcqQuestion(q) && q.answerIndex >= 0 && q.answerIndex < q.options.length
    && !q.figureBased && !q.sourceReview && !q.compensated;
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
