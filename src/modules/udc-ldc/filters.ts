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

/** topicLabel is the only section marker that survives into the bank. */
export function sectionOf(q: BankQuestion): SectionId {
  if (q.studySection) return q.studySection;
  const t = q.topicLabel.toLowerCase();
  if (t.includes('computer')) return 'computer';
  if (t.includes('arithmetic')) return 'arithmetic';
  if (t.includes('intelligence') || t.includes('reasoning')) return 'reasoning';
  if (t.includes('english')) return 'english';
  return 'gk';
}

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
    if (f.paperIds.length && (!q.paperId || !f.paperIds.includes(q.paperId))) return false;

    if (f.posts.length && (!paper?.post || !f.posts.includes(paper.post))) return false;
    if (f.papers.length && (!paper?.paperNumber || !f.papers.includes(paper.paperNumber))) return false;
    if (f.sections.length && !f.sections.includes(sectionOf(q))) return false;

    if (f.type === 'mcq' && !isMcqQuestion(q)) return false;
    if (f.type === 'written' && isMcqQuestion(q)) return false;

    if (f.flag !== 'any') {
      const fl = flags[q.id];
      if (f.flag === 'flagged' && !fl) return false;
      if (f.flag === 'unflagged' && fl) return false;
      if (f.flag === 'pending' && fl?.status !== 'pending') return false;
      if (f.flag === 'accepted' && fl?.status !== 'accepted') return false;
    }

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

    if (f.gkKind !== 'any') {
      const isGk = sectionOf(q) === 'gk';
      if (f.gkKind === 'skip-current') {
        // Everything except the GK whose answer has gone stale.
        if (isGk && q.gkKind === 'current') return false;
      } else if (!isGk || q.gkKind !== f.gkKind) {
        // 'static' and 'current' are GK-only views, so non-GK drops out too --
        // otherwise the chip says "Current affairs" and hands back a drill that
        // is mostly Arithmetic.
        return false;
      }
    }

    if (f.gkTopic !== 'any') {
      // GK-only for the same reason as gkKind's static/current: the
      // sub-topic exists only on GK questions, so a "Geography" chip
      // that also handed back Arithmetic would be lying. Composes
      // with gkKind -- "Mizoram, minus current affairs" is a drill a
      // candidate actually runs.
      if (sectionOf(q) !== 'gk' || q.gkTopic !== f.gkTopic) return false;
    }

    if (f.attempt !== 'any') {
      const p = progress[q.id];
      if (f.attempt === 'never' && p) return false;
      if (f.attempt === 'wrong' && (!p || p.lastCorrect)) return false;
      if (f.attempt === 'correct' && (!p || !p.lastCorrect)) return false;
    }

    if (needle) {
      const hay = (q.question + ' ' + (isMcqQuestion(q) ? q.options.join(' ') : '')).toLowerCase();
      if (!hay.includes(needle)) return false;
    }
    return true;
  });
}
