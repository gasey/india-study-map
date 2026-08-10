import { useMemo, useState } from 'react';
import { decks } from '@/data/decks';
import type { FlashCard } from '@/data/decks/types';
import { useApp } from '@/lib/store';
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
  const { deckProgress, markCard } = useApp();

  const perDeckDue = useMemo(
    () => decks.map((d) => ({ deck: d, due: d.cards.filter((c) => !(deckProgress[d.id]?.known ?? []).includes(c.id)) })),
    [deckProgress]
  );
  const totalDue = perDeckDue.reduce((s, d) => s + d.due.length, 0);
  const deckOwner = useMemo(() => {
    const m = new Map<string, string>();
    for (const { deck, due } of perDeckDue) for (const c of due) m.set(c.id, deck.id);
    return m;
  }, [perDeckDue]);

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
      blurb="Due today is every flashcard you haven't marked Known yet, across every deck — there's no hidden schedule behind it, just what's still outstanding."
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
          onMark={(cardId, known) => {
            const deckId = deckOwner.get(cardId);
            if (deckId) markCard(deckId, cardId, known);
          }}
          emptyTitle="Nothing due."
          emptyBody="Every deck is caught up — check back once a card slips out of Known again."
        />
      }
      footNote="Marked cards save immediately per card — there's no need to finish the queue in one sitting."
      listLabel="Due by deck"
      items={items}
    />
  );
}
