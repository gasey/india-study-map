import { useMemo, useState } from 'react';
import { decks } from '@/data/decks';
import type { FlashCard } from '@/data/decks/types';
import { useApp } from '@/lib/store';
import { isDue } from '@/lib/sm2';
import { FlashcardFlip } from '@/modules/flashcards/FlashcardFlip';
import { deckHue } from './deckHue';
import { SimplePane, type SimpleItem } from './SimplePane';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function DueTodayTab() {
  const { deckProgress, gradeCard, undoGradeCard } = useApp();

  // A card with no schedule entry yet falls back to the pre-SM-2 "known"
  // flag, so upgrading users don't see every already-studied card as due.
  const cardIsDue = (deckId: string, cardId: string) => {
    const progress = deckProgress[deckId];
    const s = progress?.schedule?.[cardId];
    return s ? isDue(s) : !(progress?.known ?? []).includes(cardId);
  };

  const perDeckDue = useMemo(
    () => decks.map((d) => ({ deck: d, due: d.cards.filter((c) => cardIsDue(d.id, c.id)) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [deckProgress]
  );
  const totalDue = perDeckDue.reduce((s, d) => s + d.due.length, 0);
  // Built from every card, not just the due subset — a graded card drops out
  // of `due` immediately, but undo (fired after the grade re-renders this
  // component) still needs to resolve its owning deck.
  const deckOwner = useMemo(() => {
    const m = new Map<string, string>();
    for (const d of decks) for (const c of d.cards) m.set(c.id, d.id);
    return m;
  }, []);

  const [byDeck, setByDeck] = useState(false);
  const [seed, setSeed] = useState(0);

  const pool: FlashCard[] = useMemo(() => {
    if (byDeck) return perDeckDue.flatMap((d) => d.due);
    return shuffle(perDeckDue.flatMap((d) => d.due));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perDeckDue, byDeck, seed]);

  const decksWithDue = perDeckDue.filter((d) => d.due.length > 0).length;

  const items: SimpleItem[] = perDeckDue.map(({ deck, due }, i) => ({
    label: deck.title,
    meta: `${due.length} due`,
    color: deckHue(deck.id),
    active: due.length > 0 && i === perDeckDue.findIndex((d) => d.due.length > 0),
  }));

  return (
    <SimplePane
      heading={
        totalDue === 0
          ? 'Nothing due — every deck is caught up'
          : `${totalDue} card${totalDue === 1 ? '' : 's'} due today, across ${decksWithDue} deck${decksWithDue === 1 ? '' : 's'}`
      }
      blurb="Due today is every flashcard whose SM-2 schedule has come due, across every deck — grade Again/Hard/Good/Easy and the next due date follows from that."
      cta={{ label: 'Start the queue', onClick: () => setSeed((s) => s + 1) }}
      canvasLabel={`Due queue · ${totalDue} card${totalDue === 1 ? '' : 's'}`}
      canvasTools={[
        { label: 'Shuffle', onClick: () => setSeed((s) => s + 1) },
        { label: 'By deck', active: byDeck, onClick: () => setByDeck((b) => !b) },
      ]}
      canvasBody={
        <FlashcardFlip
          pool={pool}
          resetKey={`${byDeck}|${seed}`}
          onGrade={(cardId, grade) => {
            const deckId = deckOwner.get(cardId);
            if (deckId) gradeCard(deckId, cardId, grade);
          }}
          scheduleFor={(cardId) => {
            const deckId = deckOwner.get(cardId);
            return deckId ? deckProgress[deckId]?.schedule?.[cardId] : undefined;
          }}
          onUndo={(cardId, prevSchedule) => {
            const deckId = deckOwner.get(cardId);
            if (deckId) undoGradeCard(deckId, cardId, prevSchedule);
          }}
          emptyTitle="Nothing due."
          emptyBody="Every deck is caught up — check back once a card's schedule brings it due again."
        />
      }
      footNote="Graded cards save immediately per card — there's no need to finish the queue in one sitting."
      listLabel="Due by deck"
      items={items}
    />
  );
}
