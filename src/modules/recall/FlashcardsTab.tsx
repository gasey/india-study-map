import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { decks } from '@/data/decks';
import { useApp } from '@/lib/store';
import { FlashcardFlip } from '@/modules/flashcards/FlashcardFlip';
import { deckHue } from './deckHue';
import { SimplePane, type SimpleItem } from './SimplePane';

export function FlashcardsTab() {
  const navigate = useNavigate();
  const { deckProgress, markCard } = useApp();

  const dueFor = (deckId: string) => {
    const known = deckProgress[deckId]?.known ?? [];
    return decks.find((d) => d.id === deckId)!.cards.filter((c) => !known.includes(c.id));
  };

  const totalCards = decks.reduce((s, d) => s + d.cards.length, 0);
  const totalDue = decks.reduce((s, d) => s + dueFor(d.id).length, 0);

  const [previewDeckId, setPreviewDeckId] = useState(() => decks.find((d) => dueFor(d.id).length > 0)?.id ?? decks[0]?.id ?? '');
  const previewDeck = decks.find((d) => d.id === previewDeckId) ?? decks[0];
  const previewPool = dueFor(previewDeckId);

  const items: SimpleItem[] = decks.map((d) => {
    const due = dueFor(d.id).length;
    return {
      label: d.title,
      meta: due > 0 ? `${due} due` : `${d.cards.length} cards`,
      color: deckHue(d.id),
      active: d.id === previewDeckId,
      onClick: () => setPreviewDeckId(d.id),
    };
  });

  return (
    <SimplePane
      heading={`Flashcards — ${totalCards} cards across ${decks.length} decks`}
      blurb="Flip, then mark Known or Review — that's the whole mechanic. Known cards drop out of rotation; everything still outstanding shows up under Due today."
      cta={{ label: `Review ${totalDue} due`, onClick: () => navigate('/flashcards') }}
      canvasLabel={`Card · ${previewDeck?.title ?? ''} deck`}
      canvasTools={[{ label: 'Flip' }, { label: 'Known' }, { label: 'Review' }]}
      canvasBody={
        previewDeck ? (
          <FlashcardFlip
            pool={previewPool}
            resetKey={previewDeckId}
            onMark={(cardId, known) => markCard(previewDeckId, cardId, known)}
            emptyTitle="Everything here is marked Known."
            emptyBody="Pick another deck from the list, or open the full Flashcards page."
          />
        ) : null
      }
      footNote={`${totalDue} cards due today · ${totalCards} cards across ${decks.length} decks`}
      listLabel="Decks"
      items={items}
    />
  );
}
