import { useEffect, useRef, useState } from 'react';
import type { FlashCard } from '@/data/decks/types';

// ============================================
// FLASHCARD FLIP — the tap-to-flip card + Known/Review buttons, extracted
// out of FlashcardsPage so the same real mechanic can render inside the
// Recall hub's canvas panel (per the Jabreeze design's "existing module,
// unchanged" note for isSimple canvases) without a second implementation.
// Deck-select/topic-filter chrome stays page-specific; this is just the
// player over whatever pool the caller hands it.
// ============================================

interface FlashcardFlipProps {
  pool: FlashCard[];
  onMark: (cardId: string, known: boolean) => void;
  onRunAgain?: () => void;
  /** Position in the pool, for a caller-owned "3 / 12" counter. */
  onProgress?: (idx: number, total: number) => void;
  emptyTitle?: string;
  emptyBody?: string;
  /** Bumping this resets to the first card (e.g. when the pool is replaced). */
  resetKey?: string | number;
}

export function FlashcardFlip({ pool, onMark, onRunAgain, onProgress, emptyTitle, emptyBody, resetKey }: FlashcardFlipProps) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // Ref, not a dep — onProgress is a fresh closure every parent render, and
  // depending on it directly would re-fire this effect (and its setState)
  // on every render, an infinite loop.
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  useEffect(() => { setIdx(0); setFlipped(false); }, [resetKey]);
  useEffect(() => { onProgressRef.current?.(Math.min(idx, pool.length), pool.length); }, [idx, pool.length]);

  const card = pool[Math.min(idx, pool.length - 1)];
  const done = idx >= pool.length;

  const mark = (isKnown: boolean) => {
    if (!card) return;
    onMark(card.id, isKnown);
    setFlipped(false);
    if (!isKnown) setIdx((i) => i + 1);
  };

  if (pool.length === 0 || done) {
    return (
      <div className="rounded-xl p-8 text-center fact-in" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
        <div className="text-3xl mb-2">{pool.length === 0 ? '🎉' : '🏁'}</div>
        <p className="font-medium mb-1">{emptyTitle ?? (pool.length === 0 ? 'Everything here is marked Known.' : 'Run complete.')}</p>
        {emptyBody && <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{emptyBody}</p>}
        {onRunAgain && (
          <button onClick={onRunAgain} className="px-4 py-2 rounded-md text-sm font-medium" style={{ background: 'var(--accent)', color: '#fff' }}>
            Run again
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="flip-scene cursor-pointer select-none" onClick={() => setFlipped((f) => !f)} role="button" aria-label={flipped ? 'Show question' : 'Show answer'}>
        <div className={`flip-inner ${flipped ? 'is-flipped' : ''}`} key={card.id}>
          <div className="flip-face rounded-xl p-8" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
            <div className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>{card.topicLabel} · tap to flip</div>
            <p className="text-lg font-medium leading-relaxed">{card.front}</p>
          </div>
          <div className="flip-face flip-back rounded-xl p-8" style={{ background: 'var(--bg-panel)', border: '1px solid var(--accent)' }}>
            <div className="text-xs mb-3" style={{ color: 'var(--accent)' }}>Answer</div>
            <p className="text-lg leading-relaxed">{card.back}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button onClick={() => mark(false)} className="py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-85" style={{ border: '1px solid #a5504a', color: '#a5504a' }}>
          ↻ Review
        </button>
        <button onClick={() => mark(true)} className="py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-85" style={{ background: '#2e7d5b', color: '#fff' }}>
          ✓ Known
        </button>
      </div>
    </>
  );
}
