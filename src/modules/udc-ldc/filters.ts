import type { BankQuestion, ExamPaper } from '@/data/banks/types';
import { isMcqQuestion } from '@/data/banks/types';
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

export type SectionId = 'gk' | 'english' | 'computer' | 'arithmetic' | 'reasoning';
export type AnswerState = 'any' | 'answered' | 'unanswered';
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

export interface Filters {
  posts: string[];
  papers: string[];
  sections: SectionId[];
  answer: AnswerState;
  attempt: AttemptState;
  gkKind: GkKindState;
  search: string;
}

export const EMPTY_FILTERS: Filters = {
  posts: [], papers: [], sections: [], answer: 'any', attempt: 'any',
  gkKind: 'any', search: '',
};

/** topicLabel is the only section marker that survives into the bank. */
export function sectionOf(q: BankQuestion): SectionId {
  const t = q.topicLabel.toLowerCase();
  if (t.includes('computer')) return 'computer';
  if (t.includes('arithmetic')) return 'arithmetic';
  if (t.includes('intelligence') || t.includes('reasoning')) return 'reasoning';
  if (t.includes('english')) return 'english';
  return 'gk';
}

export const SECTION_LABEL: Record<SectionId, string> = {
  gk: 'General Knowledge',
  english: 'General English',
  computer: 'Computer Knowledge',
  arithmetic: 'Simple Arithmetic',
  reasoning: 'Intelligence & Reasoning',
};

/** A question is answerable iff it has a real answer and readable options. */
export function isAnswerable(q: BankQuestion): boolean {
  return isMcqQuestion(q) && q.answerIndex >= 0 && !q.figureBased && q.options.length > 0;
}

export function applyFilters(
  questions: BankQuestion[],
  papers: ExamPaper[],
  f: Filters,
  progress: ProgressMap,
): BankQuestion[] {
  const byId = new Map(papers.map((p) => [p.id, p]));
  const needle = f.search.trim().toLowerCase();

  return questions.filter((q) => {
    const paper = q.paperId ? byId.get(q.paperId) : undefined;

    if (f.posts.length && (!paper?.post || !f.posts.includes(paper.post))) return false;
    if (f.papers.length && (!paper?.paperNumber || !f.papers.includes(paper.paperNumber))) return false;
    if (f.sections.length && !f.sections.includes(sectionOf(q))) return false;

    const answerable = isAnswerable(q);
    if (f.answer === 'answered' && !answerable) return false;
    if (f.answer === 'unanswered' && answerable) return false;

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
