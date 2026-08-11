import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { decks } from '@/data/decks';
import { useApp } from '@/lib/store';
import { isDue } from '@/lib/sm2';
import { ModuleSwitcher } from '@/modules/ModuleSwitcher';
import { HomeBackLink } from '@/components/shell/HomeBackLink';
import { useHasDesktopChrome } from '@/lib/useShellChrome';
import { FlashcardFlip } from './FlashcardFlip';

// ============================================
// FLASHCARDS — deck-driven recall drills, SM-2 spaced repetition.
// Tap to flip; grade Again/Hard/Good/Easy. Schedule persists per deck in the
// store; cards not yet due drop out of rotation until their due date.
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
  const { theme, toggleTheme, deckProgress, gradeCard, undoGradeCard, resetDeckProgress } = useApp();

  const [deckId, setDeckId] = useState(decks[0]?.id ?? '');
  const deck = decks.find((d) => d.id === deckId) ?? decks[0];
  const [topic, setTopic] = useState(ALL);
  const [hideNotDue, setHideNotDue] = useState(true);
  const [seed, setSeed] = useState(0);

  const progress = deckProgress[deckId];
  const known = progress?.known ?? [];
  const schedule = progress?.schedule;

  // A card with no schedule entry yet falls back to the pre-SM-2 "known"
  // flag, so upgrading users don't see every already-studied card as due.
  const cardIsDue = (cardId: string) => {
    const s = schedule?.[cardId];
    return s ? isDue(s) : !known.includes(cardId);
  };

  const dueCount = useMemo(() => deck.cards.filter((c) => cardIsDue(c.id)).length, [deck, schedule, known.length]);

  const topics = useMemo(() => {
    const seen = new Map<string, string>();
    deck.cards.forEach((c) => seen.set(c.topic, c.topicLabel));
    return [...seen.entries()];
  }, [deck]);

  const pool = useMemo(() => {
    const cards = deck.cards.filter(
      (c) => (topic === ALL || c.topic === topic) && (!hideNotDue || cardIsDue(c.id))
    );
    return shuffle(cards);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck, topic, hideNotDue, seed, schedule, known.length]);

  const poolKey = `${deckId}|${topic}|${hideNotDue}|${seed}`;
  const [runProgress, setRunProgress] = useState({ idx: 0, total: pool.length });

  const examBreakdown = useMemo(() => {
    if (deck.id !== 'jso-gk') return [];
    const groups = new Map<string, { total: number; due: number; mastered: number }>();
    for (const c of deck.cards) {
      const key = c.examName ?? 'Unknown';
      const g = groups.get(key) ?? { total: 0, due: 0, mastered: 0 };
      g.total += 1;
      if (cardIsDue(c.id)) g.due += 1;
      const s = schedule?.[c.id];
      if (s && s.reps >= 2 && s.lastGrade !== 'again') g.mastered += 1;
      groups.set(key, g);
    }
    return [...groups.entries()].sort((a, b) => b[1].total - a[1].total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck, schedule, known.length]);

  const selectCls = 'px-2 py-1.5 rounded-md text-sm';
  const selectStyle = { background: 'var(--bg-panel-elev)', color: 'var(--text-primary)', border: '1px solid var(--border)' } as const;
  const hasDesktopChrome = useHasDesktopChrome('home');

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--bg-app)', color: 'var(--text-primary)' }}>
      {/* Hidden at desktop widths — AppHeader covers the title there, and
          the "due" count moves into the controls row below. */}
      <header
        className="lg:hidden safe-top h-12 shrink-0 border-b flex items-center justify-between px-5 gap-3"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-panel)' }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <HomeBackLink hasDesktopChrome={hasDesktopChrome} />
          <span className={hasDesktopChrome ? 'lg:hidden' : ''}><ModuleSwitcher /></span>
          <span className="label-eyebrow hidden md:inline">Flashcards</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {dueCount}/{deck.cards.length} due
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
          <input type="checkbox" checked={hideNotDue} onChange={(e) => setHideNotDue(e.target.checked)} />
          Hide not due
        </label>
        <button
          onClick={() => setSeed((s) => s + 1)}
          className="px-2.5 py-1.5 rounded-md text-sm hover:bg-[var(--bg-panel-elev)] transition-colors"
          style={{ border: '1px solid var(--border)' }}
        >
          ⟳ Shuffle
        </button>
        <div className="ml-auto text-xs" style={{ color: 'var(--text-secondary)' }}>
          {dueCount}/{deck.cards.length} due · {runProgress.total === 0 ? 'no cards' : runProgress.idx >= runProgress.total ? 'done' : `${runProgress.idx + 1} / ${runProgress.total}`}
        </div>
      </div>

      {deck.id === 'jso-gk' && examBreakdown.length > 0 && (
        <div className="px-5 py-2 text-xs border-b overflow-x-auto whitespace-nowrap" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
          {examBreakdown.map(([examName, g]) => (
            <span key={examName} className="mr-4">
              {examName}: {g.due} due · {g.mastered}/{g.total} mastered
            </span>
          ))}
        </div>
      )}

      {/* Card */}
      <main className="scroll-panel flex-1 min-h-0 overflow-y-auto px-5 py-8 flex justify-center items-start">
        <div className="w-full max-w-xl">
          <FlashcardFlip
            pool={pool}
            resetKey={poolKey}
            onProgress={(idx, total) => setRunProgress({ idx, total })}
            onGrade={(cardId, grade) => gradeCard(deckId, cardId, grade)}
            scheduleFor={(cardId) => deckProgress[deckId]?.schedule?.[cardId]}
            onUndo={(cardId, prevSchedule) => undoGradeCard(deckId, cardId, prevSchedule)}
            onRunAgain={() => setSeed((s) => s + 1)}
            emptyTitle={pool.length === 0 ? 'Nothing due here.' : 'Deck run complete.'}
            emptyBody={'Shuffle to run again, untick "Hide not due" to revisit, or switch topics.'}
          />

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
