import { allQuestions, banks, getBank } from '@/data/banks';
import { isMcqQuestion, type McqBankQuestion } from '@/data/banks/types';
import { weakTopics } from './weakTopics';
import type { AppState } from './store';

type Progress = AppState['progress'];
type BankProgress = AppState['bankProgress'];

// ============================================
// Question source for "Sit With It" — client-local, same exclusion as
// weakTopics.ts (the server-backed 'mpsc-old-questions' bank is skipped to
// avoid a per-question API round trip for what's a small dashboard widget).
// ============================================

const bankIdCache = new Map<string, string>();
function bankIdOf(questionId: string): string | undefined {
  if (bankIdCache.size === 0) {
    for (const b of banks) {
      if (b.id === 'mpsc-old-questions') continue;
      for (const q of b.questions) bankIdCache.set(q.id, b.id);
    }
  }
  return bankIdCache.get(questionId);
}

function mcqPool(): { q: McqBankQuestion; bankId: string }[] {
  const pool: { q: McqBankQuestion; bankId: string }[] = [];
  for (const q of allQuestions) {
    if (!isMcqQuestion(q)) continue;
    if (q.figureBased || q.compensated) continue;
    const bankId = bankIdOf(q.id);
    if (!bankId) continue; // belongs only to the excluded server-backed bank
    pool.push({ q, bankId });
  }
  return pool;
}

/** Picks one question for a "Sit With It" session: prefers the student's
 *  current weakest topic, falls back to anything not yet mastered, falls
 *  back to any random MCQ. Never crashes on a fresh account with zero
 *  progress — the final fallback always has a candidate as long as any
 *  bank has MCQs. */
export function pickSitWithItQuestion(
  progress: Progress,
  bankProgress: BankProgress
): { question: McqBankQuestion; bankId: string; subject: string } | null {
  const pool = mcqPool();
  if (pool.length === 0) return null;

  const notMastered = pool.filter(({ q, bankId }) => {
    const bp = bankProgress[bankId];
    return !bp?.mastered.includes(q.id);
  });

  const weak = weakTopics(progress, bankProgress, 1)[0];
  if (weak?.key.startsWith('topic:')) {
    const [, subject, topic] = weak.key.split(':');
    const inTopic = notMastered.filter(({ q }) => q.subject === subject && q.topic === topic);
    if (inTopic.length > 0) {
      const pick = inTopic[Math.floor(Math.random() * inTopic.length)];
      return { question: pick.q, bankId: pick.bankId, subject: pick.q.subject };
    }
  }

  const source = notMastered.length > 0 ? notMastered : pool;
  const pick = source[Math.floor(Math.random() * source.length)];
  return { question: pick.q, bankId: pick.bankId, subject: pick.q.subject };
}

export function getQuestionBankTitle(bankId: string): string {
  return getBank(bankId)?.title ?? bankId;
}
