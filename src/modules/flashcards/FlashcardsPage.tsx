import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { decks } from '@/data/decks';
import { useApp } from '@/lib/store';
import { ModuleSwitcher } from '@/modules/ModuleSwitcher';
import { useHasDesktopChrome } from '@/lib/useShellChrome';

// ============================================
// FLASHCARDS — deck-driven recall drills.
// Tap to flip; mark Known (leaves rotation) or Review
// (stays). Known-state persists per deck in the store.
// ============================================

const ALL = 'all';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function FlashcardsPage() {
  const { theme, toggleTheme, deckProgress, markCard, resetDeckProgress } = useApp();

  const [deckId, setDeckId] = useState(decks[0]?.id ?? '');
  const deck = decks.find((d) => d.id === deckId) ?? decks[0];
  const [topic, setTopic] = useState(ALL);
  const [hideKnown, setHideKnown] = useState(true);
  const [seed, setSeed] = useState(0);

  const known = deckProgress[deckId]?.known ?? [];

  const topics = useMemo(() => {
    const seen = new Map<string, string>();
    deck.cards.forEach((c) => seen.set(c.topic, c.topicLabel));
    return [...seen.entries()];
  }, [deck]);

  const pool = useMemo(() => {
    const cards = deck.cards.filter(
      (c) => (topic === ALL || c.topic === topic) && (!hideKnown || !known.includes(c.id))
    );
    return shuffle(cards);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck, topic, hideKnown, seed, known.length]);

  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const poolKey = `${deckId}|${topic}|${hideKnown}|${seed}`;
  const [lastKey, setLastKey] = useState(poolKey);
  if (poolKey !== lastKey) {
    setLastKey(poolKey);
    setIdx(0);
    setFlipped(false);
  }

  const card = pool[Math.min(idx, pool.length - 1)];
  const done = idx >= pool.length;

  const mark = (isKnown: boolean) => {
    if (!card) return;
    markCard(deckId, card.id, isKnown);
    setFlipped(false);
    // Known cards shrink the pool via known.length dep; Review advances.
    if (!isKnown) setIdx((i) => i + 1);
  };

  const selectCls = 'px-2 py-1.5 rounded-md text-sm';
  const selectStyle = { background: 'var(--bg-panel-elev)', color: 'var(--text-primary)', border: '1px solid var(--border)' } as const;
  const hasDesktopChrome = useHasDesktopChrome('home');

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--bg-app)', color: 'var(--text-primary)' }}>
      <header
        className="safe-top h-12 shrink-0 border-b flex items-center justify-between px-5 gap-3"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-panel)' }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className={hasDesktopChrome ? 'lg:hidden' : ''}><ModuleSwitcher /></span>
          <span className="label-eyebrow hidden md:inline">Flashcards</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {known.length}/{deck.cards.length} known
          </span>
          <button
            onClick={toggleTheme}
            className={`${hasDesktopChrome ? 'lg:hidden' : ''} px-2 py-1 rounded-md text-sm hover:bg-[var(--bg-panel-elev)] transition-colors`}
            style={{ border: '1px solid var(--border)' }}
            title="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      {/* Controls */}
      <div className="shrink-0 flex flex-wrap items-center gap-2 px-5 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <select value={deckId} onChange={(e) => setDeckId(e.target.value)} className={selectCls} style={selectStyle}>
          {decks.map((d) => (
            <option key={d.id} value={d.id}>{d.title} ({d.cards.length})</option>
          ))}
        </select>
        <select value={topic} onChange={(e) => setTopic(e.target.value)} className={selectCls} style={selectStyle}>
          <option value={ALL}>All topics</option>
          {topics.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
        </select>
        <label className="flex items-center gap-1.5 text-sm cursor-pointer select-none" style={{ color: 'var(--text-secondary)' }}>
          <input type="checkbox" checked={hideKnown} onChange={(e) => setHideKnown(e.target.checked)} />
          Hide known
        </label>
        <button
          onClick={() => setSeed((s) => s + 1)}
          className="px-2.5 py-1.5 rounded-md text-sm hover:bg-[var(--bg-panel-elev)] transition-colors"
          style={{ border: '1px solid var(--border)' }}
        >
          ⟳ Shuffle
        </button>
        <div className="ml-auto text-xs" style={{ color: 'var(--text-secondary)' }}>
          {pool.length === 0 ? 'no cards' : done ? 'done' : `${Math.min(idx + 1, pool.length)} / ${pool.length}`}
        </div>
      </div>

      {/* Card */}
      <main className="scroll-panel flex-1 min-h-0 overflow-y-auto px-5 py-8 flex justify-center items-start">
        <div className="w-full max-w-xl">
          {pool.length === 0 || done ? (
            <div className="rounded-xl p-8 text-center fact-in" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
              <div className="text-3xl mb-2">{pool.length === 0 ? '🎉' : '🏁'}</div>
              <p className="font-medium mb-1">
                {pool.length === 0 ? 'Everything here is marked Known.' : 'Deck run complete.'}
              </p>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                Shuffle to run again, untick "Hide known" to revisit, or switch topics.
              </p>
              <button
                onClick={() => setSeed((s) => s + 1)}
                className="px-4 py-2 rounded-md text-sm font-medium"
                style={{ background: 'var(--accent)', color: '#fff' }}
              >
                Run again
              </button>
            </div>
          ) : (
            <>
              <div
                className="flip-scene cursor-pointer select-none"
                onClick={() => setFlipped((f) => !f)}
                role="button"
                aria-label={flipped ? 'Show question' : 'Show answer'}
              >
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
                <button
                  onClick={() => mark(false)}
                  className="py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-85"
                  style={{ border: '1px solid #a5504a', color: '#a5504a' }}
                >
                  ↻ Review
                </button>
                <button
                  onClick={() => mark(true)}
                  className="py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-85"
                  style={{ background: '#2e7d5b', color: '#fff' }}
                >
                  ✓ Known
                </button>
              </div>
            </>
          )}

          <div className="mt-4 flex items-center justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
            <Link to="/map" className="hover:underline">← Back to Study Map</Link>
            <button onClick={() => resetDeckProgress(deckId)} className="hover:underline">Reset deck progress</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default FlashcardsPage;
