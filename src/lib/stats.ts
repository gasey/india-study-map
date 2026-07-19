import { chapters } from '@/data';
import { decks } from '@/data/decks';
import { banks } from '@/data/banks';
import { mindmaps } from '@/data/mindmaps';
import type { AppState } from './store';

type Progress = AppState['progress'];
type BankProgress = AppState['bankProgress'];
type DeckProgress = AppState['deckProgress'];

export function chapterCompletion(progress: Progress) {
  const total = chapters.length;
  const completed = chapters.filter((c) => {
    const p = progress[c.id];
    return !!p && c.quiz.length > 0 && p.completed.length >= c.quiz.length;
  }).length;
  return { completed, total };
}

/** Quiz accuracy across map-chapter quizzes AND PYQ banks, last N days. */
export function quizAccuracy(progress: Progress, bankProgress: BankProgress, days = 30) {
  const since = Date.now() - days * 24 * 60 * 60 * 1000;
  let correct = 0;
  let attempts = 0;
  for (const ch of Object.values(progress)) {
    for (const list of Object.values(ch.attempts)) {
      for (const a of list) {
        if (a.at >= since) { attempts++; if (a.correct) correct++; }
      }
    }
  }
  for (const bank of Object.values(bankProgress)) {
    for (const list of Object.values(bank.attempts)) {
      for (const a of list) {
        if (a.at >= since) { attempts++; if (a.correct) correct++; }
      }
    }
  }
  if (attempts === 0) return null;
  return Math.round((correct / attempts) * 100);
}

/** Flashcards not yet marked "Known", across every deck. */
export function flashcardsRemaining(deckProgress: DeckProgress) {
  return decks.reduce((sum, d) => {
    const known = deckProgress[d.id]?.known ?? [];
    return sum + d.cards.filter((c) => !known.includes(c.id)).length;
  }, 0);
}

export interface ModuleProgress {
  /** 0-100, or null when this module doesn't track completion. */
  pct: number | null;
  meta: string;
}

/** Real completion % + a one-line meta string per registry module id. */
export function moduleProgress(progress: Progress, bankProgress: BankProgress, deckProgress: DeckProgress): Record<string, ModuleProgress> {
  const { completed, total } = chapterCompletion(progress);

  const totalQs = banks.reduce((s, b) => s + b.questions.length, 0);
  const masteredQs = banks.reduce((s, b) => s + (bankProgress[b.id]?.mastered.length ?? 0), 0);

  const totalCards = decks.reduce((s, d) => s + d.cards.length, 0);
  const knownCards = totalCards - flashcardsRemaining(deckProgress);

  return {
    map: { pct: total > 0 ? Math.round((completed / total) * 100) : null, meta: `${total} chapters` },
    pyq: { pct: totalQs > 0 ? Math.round((masteredQs / totalQs) * 100) : null, meta: `${totalQs} Qs` },
    flashcards: { pct: totalCards > 0 ? Math.round((knownCards / totalCards) * 100) : null, meta: `${totalCards} cards` },
    mindmaps: { pct: null, meta: `${mindmaps.length} maps` },
    codex: { pct: null, meta: 'guide' },
    'lab-maths': { pct: null, meta: 'lab' },
    'lab-english': { pct: null, meta: 'lab' },
    'lab-paper2': { pct: null, meta: 'lab' },
    arena: { pct: null, meta: 'MCQ game' },
    mpsc: (() => {
      const bank = banks.find((b) => b.id === 'mpsc-old-questions');
      const q = bank?.questions.length ?? 0;
      const m = bankProgress['mpsc-old-questions']?.mastered.length ?? 0;
      return { pct: q > 0 ? Math.round((m / q) * 100) : null, meta: `${bank?.papers?.length ?? 0} papers` };
    })(),
  };
}

/** Consecutive days (ending today or yesterday) with at least one recorded quiz/PYQ attempt. */
export function studyStreak(progress: Progress, bankProgress: BankProgress): number {
  const days = new Set<string>();
  const addAll = (attemptsByItem: Record<string, { at: number }[]>) => {
    for (const list of Object.values(attemptsByItem)) {
      for (const a of list) days.add(new Date(a.at).toDateString());
    }
  };
  for (const ch of Object.values(progress)) addAll(ch.attempts);
  for (const bank of Object.values(bankProgress)) addAll(bank.attempts);

  if (days.size === 0) return 0;
  let streak = 0;
  const cursor = new Date();
  // If nothing today, a streak can still count through yesterday.
  if (!days.has(cursor.toDateString())) cursor.setDate(cursor.getDate() - 1);
  while (days.has(cursor.toDateString())) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
