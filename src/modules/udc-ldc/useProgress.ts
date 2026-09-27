import { useCallback, useEffect, useState } from 'react';

// ============================================
// Lifetime per-question progress for the clerical bank.
//
// Distinct from modules/mpsc/useAttemptState.ts, which persists ONE in-progress
// sitting so a refresh doesn't lose it. This is the other axis: across all
// sittings, have I ever attempted this question, and did I get it right? That
// is what "never attempted" filtering needs, and an in-progress attempt record
// cannot answer it.
//
// localStorage, because it is per-person revision history with no reason to
// leave the device, and because losing it to a sync failure would be worse
// than not having it.
// ============================================

const KEY = 'jabreeze.udcldc.progress.v1';

export interface QuestionProgress {
  /** How many times this question has been answered. */
  n: number;
  /** Whether the MOST RECENT attempt was correct. */
  lastCorrect: boolean;
  /** ms epoch of the most recent attempt. */
  at: number;
}

export type ProgressMap = Record<string, QuestionProgress>;

function read(): ProgressMap {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

export function useProgress() {
  const [map, setMap] = useState<ProgressMap>({});

  useEffect(() => setMap(read()), []);

  const record = useCallback((questionId: string, correct: boolean) => {
    setMap((prev) => {
      const cur = prev[questionId];
      const next: ProgressMap = {
        ...prev,
        [questionId]: {
          n: (cur?.n ?? 0) + 1,
          lastCorrect: correct,
          at: Date.now(),
        },
      };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* quota or private mode — the drill still works, history just won't persist */
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    setMap({});
  }, []);

  return { progress: map, record, reset };
}
