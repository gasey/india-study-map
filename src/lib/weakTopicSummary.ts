import { getChapter } from '@/data';
import type { AppState } from './store';

type Progress = AppState['progress'];

export interface WeakTopic {
  key: string;
  label: string;
  accuracy: number;
  attempts: number;
}

/** A topic needs enough attempts before its accuracy means anything. */
export const MIN_ATTEMPTS = 5;

/** Fast, data-light dashboard summary while the larger PYQ bank stays unloaded. */
export function weakChapterTopics(progress: Progress, limit = 4): WeakTopic[] {
  const totals = new Map<string, { label: string; correct: number; attempts: number }>();

  for (const [chapterId, chapterProgress] of Object.entries(progress)) {
    const chapter = getChapter(chapterId);
    if (!chapter) continue;

    const key = `chapter:${chapterId}`;
    const total = totals.get(key) ?? { label: chapter.title, correct: 0, attempts: 0 };
    for (const list of Object.values(chapterProgress.attempts)) {
      for (const attempt of list) {
        total.attempts += 1;
        if (attempt.correct) total.correct += 1;
      }
    }
    totals.set(key, total);
  }

  return Array.from(totals.entries())
    .map(([key, total]) => ({
      key,
      label: total.label,
      accuracy: Math.round((total.correct / total.attempts) * 100),
      attempts: total.attempts,
    }))
    .filter((topic) => topic.attempts >= MIN_ATTEMPTS)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, limit);
}
