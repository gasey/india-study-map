import type { AppState } from './store';

// ============================================
// XP / LEVEL — a real, permanently-computed number, not a display trick.
// XP = total correct answers across every surface that already tracks
// correct/incorrect (map chapters, PYQ/bank practice, Gauntlet Run). No
// backend Profile table: this is derived fresh from existing local state
// every render, same as streak/accuracy. 25 XP per level is an arbitrary
// but fixed constant — change it in one place if it ever needs retuning.
// ============================================

const XP_PER_LEVEL = 25;

const LEVEL_TITLES = ['Newcomer', 'Learner', 'Regular', 'Adept', 'Sharp', 'Scholar', 'Expert', 'Master'];

function titleFor(level: number): string {
  return LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)];
}

export interface LevelInfo {
  xp: number;
  level: number;
  title: string;
  xpIntoLevel: number;
  xpForNextLevel: number;
}

export function levelInfo(progress: AppState['progress'], bankProgress: AppState['bankProgress'], arena: AppState['arena']): LevelInfo {
  let xp = arena.correct;
  for (const cp of Object.values(progress)) {
    for (const list of Object.values(cp.attempts)) xp += list.filter((a) => a.correct).length;
  }
  for (const bp of Object.values(bankProgress)) {
    for (const list of Object.values(bp.attempts)) xp += list.filter((a) => a.correct).length;
  }
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  return { xp, level, title: titleFor(level), xpIntoLevel: xp % XP_PER_LEVEL, xpForNextLevel: XP_PER_LEVEL };
}
