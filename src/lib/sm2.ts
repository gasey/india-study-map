// ============================================
// SM-2 — the spaced-repetition core behind Flashcards, Recall, and any
// review screen that wants "Again/Hard/Good/Easy" grading. Pure and
// framework-free so the store (and any component) can call it directly.
// ============================================

export type Grade = 'again' | 'hard' | 'good' | 'easy';

const MIN_EASE = 1.3;
const DAY_MS = 86_400_000;

export interface CardSchedule {
  ease: number;
  intervalDays: number;
  /** consecutive non-"again" reviews; resets to 0 on "again". */
  reps: number;
  dueAt: number;
  lastGrade: Grade | null;
  lastReviewedAt: number | null;
}

/** A card that has never been reviewed — always due. */
export function initSchedule(now: number = Date.now()): CardSchedule {
  return { ease: 2.5, intervalDays: 0, reps: 0, dueAt: now, lastGrade: null, lastReviewedAt: null };
}

export function isDue(schedule: CardSchedule | undefined, now: number = Date.now()): boolean {
  return !schedule || schedule.dueAt <= now;
}

export function gradeCard(prev: CardSchedule, grade: Grade, now: number = Date.now()): CardSchedule {
  if (grade === 'again') {
    return {
      ...prev,
      ease: Math.max(MIN_EASE, prev.ease - 0.2),
      intervalDays: 0,
      reps: 0,
      dueAt: now,
      lastGrade: grade,
      lastReviewedAt: now,
    };
  }

  const easeDelta = grade === 'hard' ? -0.15 : grade === 'easy' ? 0.15 : 0;
  const ease = Math.max(MIN_EASE, prev.ease + easeDelta);
  const reps = prev.reps + 1;

  let intervalDays: number;
  if (reps === 1) intervalDays = grade === 'hard' ? 1 : grade === 'easy' ? 4 : 1;
  else if (reps === 2) intervalDays = grade === 'hard' ? 2 : grade === 'easy' ? 8 : 6;
  else {
    const mult = grade === 'hard' ? 1.2 : grade === 'easy' ? ease * 1.3 : ease;
    intervalDays = Math.round(prev.intervalDays * mult);
  }
  intervalDays = Math.max(1, intervalDays);

  return { ease, intervalDays, reps, dueAt: now + intervalDays * DAY_MS, lastGrade: grade, lastReviewedAt: now };
}
