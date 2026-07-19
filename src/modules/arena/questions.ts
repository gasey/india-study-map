// ============================================
// GAUNTLET RUN — question selection.
//
// The game is a delivery system for revision, so picking is
// weakness-weighted: questions you've gotten wrong recently are
// far more likely to appear, mastered ones fade (never vanish).
// Difficulty scales with the run's speed tier; revives always
// pull from the hard end.
//
// Every answer is recorded via recordBankAttempt, so mastery,
// streaks and the Home dashboard all see game answers.
// ============================================

import { banks } from '@/data/banks';
import type { BankDifficulty, BankQuestion } from '@/data/banks/types';

export interface PickedQuestion {
  q: BankQuestion;
  bankId: string;
  /** Options shuffled for display; answerAt = index of the correct one. */
  order: number[];
  answerAt: number;
}

type Attempts = Record<string, { attempts: Record<string, { correct: boolean; at: number }[]>; mastered: string[] }>;

/** question id -> owning bank id (allQuestions flattening loses this). */
const BANK_OF = new Map<string, string>();
for (const b of banks) for (const q of b.questions) BANK_OF.set(q.id, b.id);

const ALL: BankQuestion[] = banks.flatMap((b) => b.questions);

function difficultiesForTier(tier: number): BankDifficulty[] {
  if (tier <= 2) return ['easy', 'medium'];
  if (tier <= 4) return ['medium'];
  return ['medium', 'hard'];
}

function weightOf(q: BankQuestion, bankProgress: Attempts): number {
  const bankId = BANK_OF.get(q.id) ?? '';
  const prog = bankProgress[bankId];
  const attempts = prog?.attempts[q.id];
  if (!attempts || attempts.length === 0) return 1.5; // unseen — worth surfacing
  const last = attempts[attempts.length - 1];
  if (!last.correct) return 2.5; // got it wrong last time — priority revision
  return prog!.mastered.includes(q.id) ? 0.6 : 1.2;
}

function weightedPick(pool: BankQuestion[], bankProgress: Attempts): BankQuestion {
  let total = 0;
  const weights = pool.map((q) => {
    const w = weightOf(q, bankProgress);
    total += w;
    return w;
  });
  let r = Math.random() * total;
  for (let i = 0; i < pool.length; i++) {
    r -= weights[i];
    if (r <= 0) return pool[i];
  }
  return pool[pool.length - 1];
}

function shuffledOrder(n: number): number[] {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function finish(q: BankQuestion): PickedQuestion {
  const order = shuffledOrder(q.options.length);
  return {
    q,
    bankId: BANK_OF.get(q.id) ?? banks[0]?.id ?? '',
    order,
    answerAt: order.indexOf(q.answerIndex),
  };
}

/** Gate question — difficulty scales with the current speed tier. */
export function pickGateQuestion(tier: number, usedIds: Set<string>, bankProgress: Attempts): PickedQuestion {
  const diffs = difficultiesForTier(tier);
  let pool = ALL.filter((q) => diffs.includes(q.difficulty) && !usedIds.has(q.id));
  if (pool.length === 0) pool = ALL.filter((q) => !usedIds.has(q.id));
  if (pool.length === 0) pool = ALL; // bank exhausted in one run — allow repeats
  return finish(weightedPick(pool, bankProgress));
}

/** Revive question — hard end of the bank, no easy way back. */
export function pickReviveQuestion(usedIds: Set<string>, bankProgress: Attempts): PickedQuestion {
  let pool = ALL.filter((q) => q.difficulty === 'hard' && !usedIds.has(q.id));
  if (pool.length === 0) pool = ALL.filter((q) => q.difficulty !== 'easy' && !usedIds.has(q.id));
  if (pool.length === 0) pool = ALL;
  return finish(weightedPick(pool, bankProgress));
}

/** Coin payout for a correct answer — knowledge is the only economy. */
export function coinsFor(d: BankDifficulty, streak: number): number {
  const base = d === 'easy' ? 10 : d === 'medium' ? 20 : 35;
  return base + Math.min(streak, 10) * 2;
}
