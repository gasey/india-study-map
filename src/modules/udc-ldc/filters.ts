import type { BankQuestion, ExamPaper } from '@/data/banks/types';
import { isMcqQuestion, isScorableMcq } from '@/data/banks/types';
import type { ProgressMap } from './useProgress';

// ============================================
// Filtering for the clerical bank.
//
// Three independent axes, because they answer three different questions a
// candidate actually asks:
//   post/paper  "the LDC exam" vs "the UDC exam" — different syllabi, and
//               Computer is 50 marks in one and 35 in the other
//   section     "just Computer" / "just Arithmetic"
//   state       "what have I never attempted", "what did I get wrong"
//
// ANSWER STATE IS SEPARATE FROM ATTEMPT STATE and must stay that way. 425 of
// the 525 questions have no published answer, so "never attempted" and
// "unanswerable" would otherwise blur into one bucket, and a drill would serve
// questions it cannot mark.
// ============================================

/**
 * The bank's id, and the key the review service files every flag, note and
 * comment under. Defined once and imported, because it is the join key between
 * this module and a separate backend — two copies that drift would silently
 * orphan a user's reports from the questions they were about.
 */
export const BANK_ID = 'mpsc-udc-ldc';

export type SectionId = 'gk' | 'english' | 'computer' | 'arithmetic' | 'reasoning';
export type AnswerState = 'any' | 'answered' | 'unanswered' | 'official' | 'independent' | 'disagreement' | 'review';
export type AttemptState = 'any' | 'never' | 'wrong' | 'correct';
/**
 * A fourth axis, about GK but not only about GK. Current affairs from a 2016
 * sitting is not worth memorising for a 2026 exam, and the oldest papers hold
 * most of it — 254 of 750 GK questions across this bank.
 *
 * Three distinct things a candidate actually wants, so three explicit options
 * rather than one chip whose meaning has to be guessed:
 *   'static'       revise GK that is still true            -> GK only, durable
 *   'current'      see what current affairs MPSC asks       -> GK only, current
 *   'skip-current' practise everything, minus the dead bits -> all but current GK
 *
 * An earlier cut had a single "GK type" axis that left non-GK sections
 * untouched, which composes more neatly but lies: picking "Current affairs"
 * produced a 1,301-question drill, mostly English and Arithmetic.
 */
export type GkKindState = 'any' | 'static' | 'current' | 'skip-current';
/**
 * A sixth axis: which GK sub-topic. Same GK-only shape as gkKind's
 * 'static'/'current' — picking "Polity & constitution" is a drill
 * of polity questions, not a filter that leaves Arithmetic and
 * English in the list.
 *
 * The categories are the syllabus's own GK sub-topics
 * (PLAN-UDC-LDC.md §5) plus mizoram, which the syllabus treats as
 * a subject in its own right, and 'general' — the catch-all the
 * classifier honestly reports when no keyword signal clears its
 * threshold. Content-classified, so it is a study aid, not a
 * structural fact: see gk-subtopics.json's _README for how it was
 * produced and where its boundary cases are.
 */
export type GkTopicState =
  | 'any'
  | 'current-affairs' | 'modern-indian-history' | 'art-culture'
  | 'polity-constitution' | 'geography' | 'economy'
  | 'general-science' | 'science-tech' | 'mizoram' | 'general';
/**
 * MCQ or written. A fifth axis because the written half is a real part of the
 * exam and not a footnote: the UDC/Assistant Paper-I gives Essay 20 + Précis
 * 10 + Comprehension 20 of its marks to written work, and the LDC Paper-I
 * Essay 20 + Comprehension 30. Eight of the papers here are written THROUGHOUT
 * — the pre-2018 clerical Paper-I had no MCQ at all.
 *
 * Needed in both directions. A candidate revising essay and précis prompts
 * wants only those; a candidate drilling MCQs does not want 156 unanswerable
 * prompts diluting the list. Neither is served by the answer/attempt axes,
 * which are about whether an answer EXISTS, not what kind of question it is.
 */
export type TypeState = 'any' | 'mcq' | 'written';
/**
 * Flag state, from the reader's OWN reports.
 *
 * Both directions are wanted and for different reasons: 'flagged' is "show me
 * what I reported, and what came of it", which is the collaborative-review
 * view; 'unflagged' EXCLUDES them, so a revision drill is not repeatedly
 * serving questions you have already said are broken.
 */
export type FlagState = 'any' | 'flagged' | 'unflagged' | 'pending' | 'accepted';

export interface Filters {
  paperIds: string[];
  posts: string[];
  papers: string[];
  sections: SectionId[];
  answer: AnswerState;
  attempt: AttemptState;
  gkKind: GkKindState;
  gkTopic: GkTopicState;
  type: TypeState;
  flag: FlagState;
  search: string;
}

export const EMPTY_FILTERS: Filters = {
  paperIds: [],
  posts: [], papers: [], sections: [], answer: 'any', attempt: 'any',
  gkKind: 'any', gkTopic: 'any', type: 'any', flag: 'any', search: '',
};

/**
 * Option letters, for display. Four is the norm in this cadre but nothing
 * fixes the number, and `'abcd'[idx]` renders the string "undefined" for a
 * fifth option rather than failing visibly. Exported so the three places that
 * label an option share one table.
 */
export const OPTION_LETTERS = 'abcdefgh';

export function optionLetter(i: number): string {
  return OPTION_LETTERS[i] ?? String(i + 1);
}

/**
 * The canonical section of a question, every bank resolving the same way.
 *
 * Three sources, in order of trust:
 *   1. `studySection` — the Group B bank writes its section explicitly.
 *   2. the topic id — the clerical bank's `simple_arithmetic`, the Group B
 *      bank's `simple-arithmetic`, `mensuration`, `coding_decoding`, … all
 *      named in `TOPIC_SECTION`. This is what makes the two banks uniform:
 *      both publish arithmetic under different topic ids and the same name
 *      must reach the same section, or a filter and a chip count disagree.
 *   3. the topic label, as defence for an id the table never saw.
 */
export function sectionOf(q: BankQuestion): SectionId {
  if (q.studySection) return q.studySection;
  const mapped = q.topic ? TOPIC_SECTION[q.topic] : undefined;
  if (mapped) return mapped;
  const t = q.topicLabel.toLowerCase();
  if (t.includes('computer')) return 'computer';
  if (t.includes('arithmetic')) return 'arithmetic';
  if (t.includes('intelligence') || t.includes('reasoning')) return 'reasoning';
  if (t.includes('english')) return 'english';
  return 'gk';
}

/**
 * topic id -> section. One list for both banks: the clerical bank's
 * underscore ids and the Group B bank's hyphenated ids (and its subtopic
 * taxonomy) all land on the same five sections.
 */
const TOPIC_SECTION: Record<string, SectionId> = {
  // clerical bank
  gk_general: 'gk',
  eng_general: 'english',
  simple_arithmetic: 'arithmetic',
  computer_knowledge: 'computer',
  intelligence_reasoning: 'reasoning',
  // Group B: quantitative subtopics
  'simple-arithmetic': 'arithmetic',
  mensuration: 'arithmetic',
  algebra: 'arithmetic',
  number_system: 'arithmetic',
  speed_distance_time: 'arithmetic',
  percentage: 'arithmetic',
  profit_loss: 'arithmetic',
  ratio_proportion: 'arithmetic',
  simple_compound_interest: 'arithmetic',
  average: 'arithmetic',
  data_interpretation: 'arithmetic',
  time_work: 'arithmetic',
  probability: 'arithmetic',
  age_problems: 'arithmetic',
  pipes_cisterns: 'arithmetic',
  permutation_combination: 'arithmetic',
  mixture_alligation: 'arithmetic',
  // Group B: reasoning subtopics
  'general-intelligence-&-reasoning': 'reasoning',
  coding_decoding: 'reasoning',
  calendar_clock: 'reasoning',
  alphabet_test: 'reasoning',
  direction_sense: 'reasoning',
  number_series: 'reasoning',
  analogy: 'reasoning',
  matrix_reasoning: 'reasoning',
  odd_one_out: 'reasoning',
  venn_diagram: 'reasoning',
  logical_sequence: 'reasoning',
  ranking: 'reasoning',
  figure_series: 'reasoning',
  figure_counting: 'reasoning',
  syllogism: 'reasoning',
  seating_arrangement: 'reasoning',
  blood_relation: 'reasoning',
  dice: 'reasoning',
  classification: 'reasoning',
  paper_folding: 'reasoning',
  mirror_image: 'reasoning',
  // Group B: computer
  'basic-computer-knowledge': 'computer',
};

/**
 * Visual reading mode for a stem and its options, as CSS class names.
 *
 * Quantitative stems are easier to scan when set apart from prose — operators,
 * nested brackets, fractions and units lose their shape in a running
 * paragraph, and a serif/tabular typeface keeps digits and place values
 * aligned. Reasoning gets the same controlled wrapping for matrices and
 * sequences, in a lighter accent.
 *
 * Resolved through `sectionOf`, not the raw `topic` id: the clerical bank
 * marks arithmetic as `simple_arithmetic` while the Group B bank tags whole
 * quantitative papers (AAO Arithmetic, the statistics papers) with
 * `studySection: 'arithmetic'` and hyphenated topics like `simple-arithmetic`.
 * Keying off the resolved section means every quantitative item is styled the
 * same way whatever paper it came from. `plain` also suppresses emphasis
 * markup, so an expression's `*` or `_` can never be read as emphasis.
 */
export function textMode(q: BankQuestion): { stem: string; option: string; plain: boolean } {
  const section = sectionOf(q);
  if (section === 'arithmetic') return { stem: 'udc-math-stem', option: 'udc-math-option', plain: true };
  if (section === 'reasoning') return { stem: 'udc-reasoning-stem', option: 'udc-reasoning-option', plain: false };
  return { stem: '', option: '', plain: false };
}

/**
 * One colour per section, used for the topic label, the option keys and the
 * card's left edge.
 *
 * It encodes something rather than decorating: the five sections are the axis
 * a candidate actually revises along, and at a glance down a mixed list the
 * colour says which paper-half a question came from without reading the label.
 * Chosen to stay legible on both the light parchment and the dark theme, and
 * to be distinguishable without relying on hue alone — the label text is
 * always present, so this never carries meaning by itself.
 */
export const SECTION_COLOUR: Record<SectionId, string> = {
  gk: '#2f7d6b',          // teal — General Knowledge
  english: '#8a5a2b',     // umber — General English
  computer: '#3b6fb8',    // blue — Computer Knowledge
  arithmetic: '#9a4f7a',  // plum — Simple Arithmetic
  reasoning: '#6b6420',   // olive — Intelligence & Reasoning
};

export const SECTION_LABEL: Record<SectionId, string> = {
  gk: 'General Knowledge',
  english: 'General English',
  computer: 'Computer Knowledge',
  arithmetic: 'Arithmetic & General Mathematics',
  reasoning: 'Intelligence & Reasoning',
};

/** Display names for the GK sub-topic axis. 'general' is labelled
 *  what it is — the classifier's honest catch-all — because a
 *  filter called "General" that silently means "everything the
 *  classifier could not say" would mislead. */
export const GK_TOPIC_LABEL: Record<Exclude<GkTopicState, 'any'>, string> = {
  'current-affairs': 'Current affairs',
  'modern-indian-history': 'Modern Indian history',
  'art-culture': 'Art & culture',
  'polity-constitution': 'Polity & constitution',
  geography: 'Geography',
  economy: 'Economy',
  'general-science': 'General science',
  'science-tech': 'Science & tech',
  mizoram: 'Mizoram',
  general: 'General (mixed)',
};

/** A question is answerable iff it has a real answer and readable options. */
export function isAnswerable(q: BankQuestion): boolean {
  return isScorableMcq(q);
}

// ============================================
// Filtering machinery, in two layers.
//
// applyFilters produces the filtered LIST; railCounts produces every chip's
// COUNT in one pass. Both are built from the same atomic predicates, so a chip
// can never count a pool the filter will not deliver.
// ============================================

/** The paper axis: paperIds, post and paper number are all "which paper". */
function paperScopePass(q: BankQuestion, paper: ExamPaper | undefined, f: Filters): boolean {
  if (f.paperIds.length && (!q.paperId || !f.paperIds.includes(q.paperId))) return false;
  if (f.posts.length && (!paper?.post || !f.posts.includes(paper.post))) return false;
  if (f.papers.length && (!paper?.paperNumber || !f.papers.includes(paper.paperNumber))) return false;
  return true;
}

function typePass(q: BankQuestion, f: Filters): boolean {
  if (f.type === 'mcq' && !isMcqQuestion(q)) return false;
  if (f.type === 'written' && isMcqQuestion(q)) return false;
  return true;
}

function flagPass(q: BankQuestion, f: Filters, flags: Record<string, { status: string }>): boolean {
  if (f.flag === 'any') return true;
  const fl = flags[q.id];
  if (f.flag === 'flagged') return !!fl;
  if (f.flag === 'unflagged') return !fl;
  return fl?.status === f.flag;
}

function answerPass(q: BankQuestion, f: Filters): boolean {
  if (f.answer === 'any') return true;
  const answerable = isAnswerable(q);
  if (f.answer === 'answered' && !answerable) return false;
  if (f.answer === 'unanswered' && answerable) return false;
  if (f.answer === 'official' && q.answerSource !== 'official') return false;
  if (f.answer === 'independent' && (!answerable || q.answerSource === 'official')) return false;
  if (f.answer === 'disagreement') {
    const keyAnswer = isMcqQuestion(q) && q.answerSource === 'official'
      ? q.answerIndex >= 0 ? q.answerIndex : q.officialAnswerCandidates?.length === 1 ? q.officialAnswerCandidates[0] : -1 : -1;
    if (keyAnswer < 0 || q.independentAnswerIndex === undefined || q.independentAnswerIndex === keyAnswer) return false;
  }
  if (f.answer === 'review' && !(q.disputeNote || q.sourceNote || !answerable || q.answerConfidence === 'medium' || q.answerConfidence === 'low')) return false;
  return true;
}

function gkKindPass(q: BankQuestion, f: Filters): boolean {
  if (f.gkKind === 'any') return true;
  const isGk = sectionOf(q) === 'gk';
  if (f.gkKind === 'skip-current') return !(isGk && q.gkKind === 'current');
  return isGk && q.gkKind === f.gkKind;
}

function gkTopicPass(q: BankQuestion, f: Filters): boolean {
  if (f.gkTopic === 'any') return true;
  return sectionOf(q) === 'gk' && q.gkTopic === f.gkTopic;
}

function attemptPass(q: BankQuestion, f: Filters, progress: ProgressMap): boolean {
  if (f.attempt === 'any') return true;
  const p = progress[q.id];
  if (f.attempt === 'never' && p) return false;
  if (f.attempt === 'wrong' && (!p || p.lastCorrect)) return false;
  if (f.attempt === 'correct' && (!p || !p.lastCorrect)) return false;
  return true;
}

export function applyFilters(
  questions: BankQuestion[],
  papers: ExamPaper[],
  f: Filters,
  progress: ProgressMap,
  /** questionId -> flag status, from the reader's own reports. Empty when
   *  signed out, which makes every flag filter a no-op rather than an
   *  empty list. */
  flags: Record<string, { status: string }> = {},
): BankQuestion[] {
  const byId = new Map(papers.map((p) => [p.id, p]));
  const needle = f.search.trim().toLowerCase();

  return questions.filter((q) => {
    const paper = q.paperId ? byId.get(q.paperId) : undefined;
    if (!paperScopePass(q, paper, f)) return false;
    if (f.sections.length && !f.sections.includes(sectionOf(q))) return false;
    if (!typePass(q, f)) return false;
    if (!flagPass(q, f, flags)) return false;
    if (!answerPass(q, f)) return false;
    if (!gkKindPass(q, f)) return false;
    if (!gkTopicPass(q, f)) return false;
    if (!attemptPass(q, f, progress)) return false;
    if (needle) {
      const hay = (q.question + ' ' + (isMcqQuestion(q) ? q.options.join(' ') : '')).toLowerCase();
      if (!hay.includes(needle)) return false;
    }
    return true;
  });
}

// The chip buckets a question can fall into. -ing both 'any' and the concrete
// value keeps the meet functions one-liners.
const TYPE_VALUES: TypeState[] = ['any', 'mcq', 'written'];
const FLAG_VALUES: FlagState[] = ['any', 'flagged', 'unflagged', 'pending', 'accepted'];
const ANSWER_VALUES: AnswerState[] = ['any', 'answered', 'unanswered', 'official', 'independent', 'disagreement', 'review'];
const GKKIND_VALUES: GkKindState[] = ['any', 'skip-current', 'static', 'current'];
const GKTOPIC_VALUES: GkTopicState[] = ['any', 'mizoram', 'current-affairs', 'polity-constitution', 'economy',
  'geography', 'general-science', 'science-tech', 'modern-indian-history', 'art-culture', 'general'];
const ATTEMPT_VALUES: AttemptState[] = ['any', 'never', 'wrong', 'correct'];

function flagMeets(q: BankQuestion, v: FlagState, flags: Record<string, { status: string }>): boolean {
  if (v === 'any') return true;
  const fl = flags[q.id];
  if (v === 'flagged') return !!fl;
  if (v === 'unflagged') return !fl;
  return fl?.status === v;
}

function answerMeets(q: BankQuestion, v: AnswerState): boolean {
  if (v === 'any') return true;
  const answerable = isAnswerable(q);
  if (v === 'answered') return answerable;
  if (v === 'unanswered') return !answerable;
  if (v === 'official') return q.answerSource === 'official';
  if (v === 'independent') return answerable && q.answerSource !== 'official';
  if (v === 'disagreement') {
    const keyAnswer = isMcqQuestion(q) && q.answerSource === 'official'
      ? q.answerIndex >= 0 ? q.answerIndex : q.officialAnswerCandidates?.length === 1 ? q.officialAnswerCandidates[0] : -1 : -1;
    return keyAnswer >= 0 && q.independentAnswerIndex !== undefined && q.independentAnswerIndex !== keyAnswer;
  }
  if (v === 'review') return !!(q.disputeNote || q.sourceNote || !answerable || q.answerConfidence === 'medium' || q.answerConfidence === 'low');
  return false;
}

function gkKindMeets(q: BankQuestion, v: GkKindState, section: SectionId): boolean {
  if (v === 'any') return true;
  if (v === 'skip-current') return !(section === 'gk' && q.gkKind === 'current');
  return section === 'gk' && q.gkKind === v;
}

function attemptMeets(q: BankQuestion, v: AttemptState, progress: ProgressMap): boolean {
  if (v === 'any') return true;
  const p = progress[q.id];
  if (v === 'never') return !p;
  if (v === 'wrong') return !!p && !p.lastCorrect;
  return !!p && !!p.lastCorrect; // 'correct'
}

export interface RailCounts {
  posts: Record<string, number>;
  papers: Record<string, number>;
  sections: Record<SectionId, number>;
  type: Partial<Record<TypeState, number>>;
  flag: Partial<Record<FlagState, number>>;
  answer: Partial<Record<AnswerState, number>>;
  gkKind: Partial<Record<GkKindState, number>>;
  gkTopic: Partial<Record<GkTopicState, number>>;
  attempt: Partial<Record<AttemptState, number>>;
  /** Count with the Answer axis replaced by "answered" — the footer's
   *  "X of them can be marked". */
  answerable: number;
}

/**
 * Every chip's count in a single pass over `questions`.
 *
 * Semantics match a per-chip call `applyFilters(all, papers, {...f, <axis>:
 * value}, …)`: each count keeps every OTHER axis at its current filter and
 * measures the pool the chip would produce. That is what this replaces — the
 * rail previously ran a full filter for each of ~45 chips on every render.
 * `railCounts` walks the questions once, evaluates each axis's pass once per
 * question, and accumulates all chips together.
 */
export function railCounts(
  questions: BankQuestion[],
  papers: ExamPaper[],
  f: Filters,
  progress: ProgressMap,
  flags: Record<string, { status: string }> = {},
): RailCounts {
  const byId = new Map(papers.map((p) => [p.id, p]));
  const needle = f.search.trim().toLowerCase();
  const out: RailCounts = {
    posts: {}, papers: {},
    sections: { gk: 0, english: 0, computer: 0, arithmetic: 0, reasoning: 0 },
    type: {}, flag: {}, answer: {}, gkKind: {}, gkTopic: {}, attempt: {},
    answerable: 0,
  };
  const inc = <K extends string>(m: Partial<Record<K, number>>, key: K) => {
    m[key] = (m[key] ?? 0) + 1;
  };

  for (const q of questions) {
    const paper = q.paperId ? byId.get(q.paperId) : undefined;
    const section = sectionOf(q);
    const hay = needle ? (q.question + ' ' + (isMcqQuestion(q) ? q.options.join(' ') : '')).toLowerCase() : undefined;
    const pass = [
      f.paperIds.length === 0 || (!!q.paperId && f.paperIds.includes(q.paperId)),
      f.posts.length === 0 || (!!paper?.post && f.posts.includes(paper.post)),
      f.papers.length === 0 || (!!paper?.paperNumber && f.papers.includes(paper.paperNumber)),
      f.sections.length === 0 || f.sections.includes(section),
      typePass(q, f),
      flagPass(q, f, flags),
      answerPass(q, f),
      gkKindPass(q, f),
      gkTopicPass(q, f),
      attemptPass(q, f, progress),
      !needle || (hay ?? '').includes(needle),
    ];
    // "Passes every axis except the skip-th" — a chip's count is this AND the
    // question landing in that chip's bucket.
    const others = (skip: number): boolean => {
      for (let i = 0; i < pass.length; i++) {
        if (i !== skip && !pass[i]) return false;
      }
      return true;
    };

    if (others(1) && paper?.post) inc(out.posts, paper.post);
    if (others(2) && paper?.paperNumber) inc(out.papers, paper.paperNumber);
    if (others(3)) inc(out.sections, section);

    if (others(4)) {
      for (const v of TYPE_VALUES) if (v === 'any' || (v === 'mcq' ? isMcqQuestion(q) : !isMcqQuestion(q))) inc(out.type, v);
    }
    if (others(5)) {
      for (const v of FLAG_VALUES) if (flagMeets(q, v, flags)) inc(out.flag, v);
    }
    if (others(6)) {
      for (const v of ANSWER_VALUES) if (answerMeets(q, v)) inc(out.answer, v);
    }
    if (others(7)) {
      for (const v of GKKIND_VALUES) if (gkKindMeets(q, v, section)) inc(out.gkKind, v);
    }
    if (others(8)) {
      for (const v of GKTOPIC_VALUES) if (v === 'any' || (section === 'gk' && q.gkTopic === v)) inc(out.gkTopic, v);
    }
    if (others(9)) {
      for (const v of ATTEMPT_VALUES) if (attemptMeets(q, v, progress)) inc(out.attempt, v);
    }
  }
  out.answerable = out.answer.answered ?? 0;
  return out;
}
