import { useCallback, useEffect, useRef, useState } from 'react';

// ============================================
// Attempt persistence — the layer that makes the Player's core promise
// ("this sitting survives a refresh or a dropped connection", build-order.md
// §4.1) literally true.
//
// localStorage is deliberately the source of truth for an in-progress
// sitting, not a server table:
//   - it survives a refresh AND a dropped connection by construction, with
//     no sync failure modes to get wrong in exactly the situation where
//     losing work is unforgivable;
//   - `startedAt` is persisted rather than a decremented counter, so a
//     resumed sitting recomputes the *correct* remaining time instead of
//     silently gifting back the seconds the tab was closed.
// A server-side attempt table (cross-device resume) is a separate, additive
// concern — completed results already persist via recordTestResult /
// POST /api/progress/mock-attempt.
// ============================================

const PREFIX = 'jabreeze.attempt.';
const PAPER_SUFFIX = '.paper';

export interface AttemptState {
  /** questionId -> chosen option index. */
  answers: Record<string, number>;
  /** questionIds marked for review. */
  marked: string[];
  /** questionIds the candidate has actually landed on. */
  seen: string[];
  /** Index of the question on screen. */
  idx: number;
  /** Wall-clock ms when the sitting began — survives reloads. */
  startedAt: number;
  /**
   * Fingerprint of the exact question set this state belongs to.
   *
   * Load-bearing: both mock tests and practice drills draw their questions
   * via random sampling, so the same `targetId` yields a *different* paper
   * on each launch. Without this check a resume would restore a running
   * clock and answers keyed to questions that are no longer on screen —
   * silently wrong in the one place being wrong is unacceptable.
   */
  signature: string;
}

function emptyState(signature: string): AttemptState {
  return { answers: {}, marked: [], seen: [], idx: 0, startedAt: Date.now(), signature };
}

function load(key: string, signature: string): AttemptState | null {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AttemptState;
    // A malformed/partial blob must not wedge the player — fall back to a
    // fresh sitting rather than throwing on every render.
    if (!parsed || typeof parsed !== 'object' || typeof parsed.startedAt !== 'number') return null;
    // Different paper behind the same id — start clean rather than resume
    // a clock against questions this state was never about.
    if (parsed.signature !== signature) return null;
    return {
      answers: parsed.answers ?? {},
      marked: Array.isArray(parsed.marked) ? parsed.marked : [],
      seen: Array.isArray(parsed.seen) ? parsed.seen : [],
      idx: typeof parsed.idx === 'number' ? parsed.idx : 0,
      startedAt: parsed.startedAt,
      signature: parsed.signature,
    };
  } catch {
    return null;
  }
}

/**
 * Persisted attempt state for one sitting, keyed by `targetId` and validated
 * against `signature` (the question set it belongs to).
 * Returns the state, a patch function, `savedAt` (drives the "Saved Ns ago"
 * footer), and `clear()` for use after a successful submit.
 */
export function useAttemptState(key: string, signature: string, enabled = true) {
  const [state, setState] = useState<AttemptState>(
    () => (enabled ? load(key, signature) ?? emptyState(signature) : emptyState(signature)),
  );
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [resumed] = useState<boolean>(() => (enabled ? load(key, signature) !== null : false));
  const keyRef = useRef(key);
  keyRef.current = key;

  // Write on every change. This is a small blob (answers + a few arrays) and
  // an interrupted sitting is far more expensive than a synchronous write,
  // so it is not debounced — the debounce in the spec is for the *network*
  // PATCH, which this build deliberately does not depend on.
  useEffect(() => {
    if (!enabled) return;
    try {
      localStorage.setItem(PREFIX + keyRef.current, JSON.stringify(state));
      setSavedAt(Date.now());
    } catch {
      // Quota/private-mode failures must not break the sitting in progress.
    }
  }, [state, enabled]);

  const patch = useCallback((p: Partial<AttemptState> | ((s: AttemptState) => Partial<AttemptState>)) => {
    setState((s) => ({ ...s, ...(typeof p === 'function' ? p(s) : p) }));
  }, []);

  const clear = useCallback(() => {
    try {
      localStorage.removeItem(PREFIX + keyRef.current);
      localStorage.removeItem(PREFIX + keyRef.current + PAPER_SUFFIX);
    } catch {
      // ignore
    }
  }, []);

  return { state, patch, savedAt, resumed, clear };
}

// ---- The paper itself ------------------------------------------------
// Stored alongside the answers, written once at launch. Two reasons this
// has to be local rather than re-fetched on resume:
//   1. Mock tests and practice drills are *sampled*, so re-running the
//      query after a refresh returns a different paper — the saved answers
//      would no longer belong to anything on screen.
//   2. "Your answers are held on this device" (the offline state, §4.3) is
//      only true if the questions are too; a resumed sitting must not need
//      the network to render.

export function savePaper<T>(key: string, questions: T[]): void {
  try {
    localStorage.setItem(PREFIX + key + PAPER_SUFFIX, JSON.stringify(questions));
  } catch {
    // Over quota: the sitting still works, it just can't be resumed after a
    // reload. Better than refusing to start the test.
  }
}

export function loadPaper<T>(key: string): T[] | null {
  try {
    const raw = localStorage.getItem(PREFIX + key + PAPER_SUFFIX);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? (parsed as T[]) : null;
  } catch {
    return null;
  }
}

/** True if `key` has a resumable sitting (both answers and its paper). */
export function hasResumableAttempt(key: string): boolean {
  try {
    return !!localStorage.getItem(PREFIX + key) && !!localStorage.getItem(PREFIX + key + PAPER_SUFFIX);
  } catch {
    return false;
  }
}
