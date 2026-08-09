import { getChapter } from '@/data';
import { getBank } from '@/data/banks';
import type { AppState } from './store';

// ============================================
// WEAK TOPICS — client-local aggregation, no backend needed. Every attempt
// already lives in progress/bankProgress (per-question, timestamped,
// localStorage-persisted) — this just groups it by topic instead of by
// question and sorts by accuracy.
//
// Deliberately excludes the 'mpsc-old-questions' bank: it's server-backed
// (Phase 4), so resolving a topic per already-answered question id would
// mean one API call per question on every Home load — not worth it for a
// dashboard widget. Map chapters and every other (still-static) bank cover
// the signal well enough without it. Revisit only if that gap turns out to
// matter in practice.
// ============================================

type Progress = AppState['progress'];
type BankProgress = AppState['bankProgress'];

export interface WeakTopic {
  key: string;
  label: string;
  accuracy: number;
  attempts: number;
}

/** A topic needs at least this many attempts before its accuracy means
 *  anything — one wrong answer out of one shouldn't read as "0% weak". */
const MIN_ATTEMPTS = 5;

export function weakTopics(progress: Progress, bankProgress: BankProgress, limit = 4): WeakTopic[] {
  const totals = new Map<string, { label: string; correct: number; attempts: number }>();
  const bump = (key: string, label: string, correct: boolean) => {
    const t = totals.get(key) ?? { label, correct: 0, attempts: 0 };
    t.attempts += 1;
    if (correct) t.correct += 1;
    totals.set(key, t);
  };

  for (const [chapterId, cp] of Object.entries(progress)) {
    const chapter = getChapter(chapterId);
    if (!chapter) continue;
    for (const list of Object.values(cp.attempts)) {
      for (const a of list) bump(`chapter:${chapterId}`, chapter.title, a.correct);
    }
  }

  for (const [bankId, bp] of Object.entries(bankProgress)) {
    if (bankId === 'mpsc-old-questions') continue;
    const bank = getBank(bankId);
    if (!bank) continue;
    for (const [questionId, list] of Object.entries(bp.attempts)) {
      const q = bank.questions.find((x) => x.id === questionId);
      if (!q) continue;
      const key = `topic:${q.subject}:${q.topic}`;
      for (const a of list) bump(key, q.topicLabel, a.correct);
    }
  }

  return Array.from(totals.entries())
    .map(([key, t]) => ({ key, label: t.label, accuracy: Math.round((t.correct / t.attempts) * 100), attempts: t.attempts }))
    .filter((t) => t.attempts >= MIN_ATTEMPTS)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, limit);
}
