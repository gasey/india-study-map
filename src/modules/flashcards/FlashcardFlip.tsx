import { useEffect, useRef, useState } from 'react';
import type { FlashCard } from '@/data/decks/types';
import type { CardSchedule, Grade } from '@/lib/sm2';

// ============================================
// FLASHCARD FLIP — the tap-to-flip card + Again/Hard/Good/Easy SM-2 grading,
// extracted out of FlashcardsPage so the same real mechanic can render inside
// the Recall hub's canvas panel and the State Tax Officer review tab without
// a second implementation. Deck-select/topic-filter chrome stays
// page-specific; this is just the player over whatever pool the caller hands it.
// ============================================

interface FlashcardFlipProps {
  pool: FlashCard[];
  onGrade: (cardId: string, grade: Grade) => void;
  /** For undo — the schedule as it stood immediately before the last grade. */
  scheduleFor?: (cardId: string) => CardSchedule | undefined;
  onUndo?: (cardId: string, prevSchedule: CardSchedule | undefined) => void;
  onRunAgain?: () => void;
  /** Position in the pool, for a caller-owned "3 / 12" counter. */
  onProgress?: (idx: number, total: number) => void;
  emptyTitle?: string;
  emptyBody?: string;
  /** Bumping this resets to the first card (e.g. when the pool is replaced). */
  resetKey?: string | number;
}

const GRADES: { grade: Grade; label: string; key: string; style: React.CSSProperties }[] = [
  { grade: 'again', label: 'Again', key: '1', style: { border: '1px solid var(--bad)', color: 'var(--bad)' } },
  { grade: 'hard', label: 'Hard', key: '2', style: { border: '1px solid var(--warn)', color: 'var(--warn)' } },
  { grade: 'good', label: 'Good', key: '3', style: { background: 'var(--ok)', color: '#fff' } },
  { grade: 'easy', label: 'Easy', key: '4', style: { background: 'var(--accent)', color: '#fff' } },
];

export function FlashcardFlip({
  pool, onGrade, scheduleFor, onUndo, onRunAgain, onProgress, emptyTitle, emptyBody, resetKey,
}: FlashcardFlipProps) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const lastAction = useRef<{ cardId: string; prevSchedule: CardSchedule | undefined; idx: number } | null>(null);

  // Ref, not a dep — onProgress is a fresh closure every parent render, and
  // depending on it directly would re-fire this effect (and its setState)
  // on every render, an infinite loop.
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  useEffect(() => { setIdx(0); setFlipped(false); lastAction.current = null; }, [resetKey]);
  useEffect(() => { onProgressRef.current?.(Math.min(idx, pool.length), pool.length); }, [idx, pool.length]);

  const card = pool[Math.min(idx, pool.length - 1)];
  const done = idx >= pool.length;

  const grade = (g: Grade) => {
    if (!card) return;
    lastAction.current = { cardId: card.id, prevSchedule: scheduleFor?.(card.id), idx };
    onGrade(card.id, g);
    setFlipped(false);
    // "Again" resets the card to due-now — it stays in rotation, so advance
    // past it (mirrors the old Review behavior). Other grades push the card's
    // due date out; the caller's due-filtered pool drops it on its own, so
    // the same idx slot naturally shows the next card.
    if (g === 'again') setIdx((i) => i + 1);
  };

  const undo = () => {
    const last = lastAction.current;
    if (!last || !onUndo) return;
    onUndo(last.cardId, last.prevSchedule);
    setIdx(last.idx);
    setFlipped(false);
    lastAction.current = null;
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (done || !card) return;

      if (e.key === ' ') {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (flipped && e.key >= '1' && e.key <= '4') {
        e.preventDefault();
        grade(GRADES[Number(e.key) - 1].grade);
      } else if (e.key === 'z' || e.key === 'Z') {
        e.preventDefault();
        undo();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flipped, done, card?.id]);

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
      <div className="h-1 rounded-full overflow-hidden mb-3" style={{ background: 'var(--bg-panel-elev)' }}>
        <div
          className="h-full rounded-full transition-[width] duration-300"
          style={{ width: `${pool.length ? (idx / pool.length) * 100 : 0}%`, background: 'var(--accent)' }}
        />
      </div>

      <div className="flip-scene cursor-pointer select-none" onClick={() => setFlipped((f) => !f)} role="button" aria-label={flipped ? 'Show question' : 'Show answer'}>
        <div className={`flip-inner ${flipped ? 'is-flipped' : ''}`} key={card.id}>
          <div className="flip-face rounded-xl p-8" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
            <div className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>{card.topicLabel} · tap to flip · space</div>
            <p className="text-lg font-medium leading-relaxed">{card.front}</p>
          </div>
          <div className="flip-face flip-back rounded-xl p-8" style={{ background: 'var(--bg-panel)', border: '1px solid var(--accent)' }}>
            <div className="text-xs mb-3" style={{ color: 'var(--accent)' }}>Answer</div>
            <p className="text-lg leading-relaxed">{card.back}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-4 gap-2">
        {GRADES.map(({ grade: g, label, key, style }) => (
          <button
            key={g}
            onClick={() => grade(g)}
            className="py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-85"
            style={style}
          >
            {label} <span className="opacity-60 text-xs">{key}</span>
          </button>
        ))}
      </div>

      {onUndo && lastAction.current && (
        <button onClick={undo} className="mt-2 text-xs hover:underline" style={{ color: 'var(--text-secondary)' }}>
          ↶ Undo last grade (z)
        </button>
      )}
    </>
  );
}
