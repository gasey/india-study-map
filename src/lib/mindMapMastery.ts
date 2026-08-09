import { getChapter } from '@/data';
import type { AppState } from './store';
import { MIN_ATTEMPTS } from './weakTopics';

// ============================================
// MIND MAP MASTERY — real per-chapter accuracy for Mind Map nodes, from the
// exact same attempt history weakTopics.ts draws on (progress[chapterId]).
//
// Deliberately node-scoped, not tree-wide: only a node carrying a chapterId
// has a real quiz + attempt log behind it. Most branch/leaf nodes don't
// (they're a lecture outline, not a chapter) — those get `null` here and the
// UI must show no state/accuracy for them rather than inventing one. See
// commit adc43e0 and DEVLOG — node-level granularity below chapter is an
// architectural gap (bank topics don't tag to individual outline points),
// not something to paper over with placeholder numbers.
// ============================================

export type MasteryState = 'done' | 'weak' | 'new';

export interface ChapterMastery {
  state: MasteryState;
  /** null until MIN_ATTEMPTS is reached — same gate as weakTopics.ts. */
  accuracyPct: number | null;
  attempts: number;
  quizTotal: number;
}

export function chapterMastery(chapterId: string, progress: AppState['progress']): ChapterMastery | null {
  const chapter = getChapter(chapterId);
  if (!chapter) return null;

  const lists = Object.values(progress[chapterId]?.attempts ?? {});
  const attempts = lists.reduce((n, l) => n + l.length, 0);
  const correct = lists.reduce((n, l) => n + l.filter((a) => a.correct).length, 0);

  const accuracyPct = attempts >= MIN_ATTEMPTS ? Math.round((correct / attempts) * 100) : null;
  const state: MasteryState = accuracyPct === null ? 'new' : accuracyPct >= 70 ? 'done' : 'weak';

  return { state, accuracyPct, attempts, quizTotal: chapter.quiz.length };
}
