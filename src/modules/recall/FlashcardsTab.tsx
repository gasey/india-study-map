import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { decks } from '@/data/decks';
import { useApp } from '@/lib/store';
import { isDue } from '@/lib/sm2';
import { FlashcardFlip } from '@/modules/flashcards/FlashcardFlip';
import { deckHue } from './deckHue';
import { SimplePane, type SimpleItem } from './SimplePane';

export function FlashcardsTab() {
  const navigate = useNavigate();
  const { deckProgress, gradeCard, undoGradeCard } = useApp();

  // A card with no schedule entry yet falls back to the pre-SM-2 "known"
  // flag, so upgrading users don't see every already-studied card as due.
  const cardIsDue = (deckId: string, cardId: string) => {
    const progress = deckProgress[deckId];
    const s = progress?.schedule?.[cardId];
    return s ? isDue(s) : !(progress?.known ?? []).includes(cardId);
  };

  const dueFor = (deckId: string) => {
    return decks.find((d) => d.id === deckId)!.cards.filter((c) => cardIsDue(deckId, c.id));
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
      blurb="Flip, then grade Again/Hard/Good/Easy — SM-2 schedules the next review from that. Cards not yet due drop out of rotation; everything currently due shows up under Due today."
      cta={{ label: `Review ${totalDue} due`, onClick: () => navigate('/flashcards') }}
      canvasLabel={`Card · ${previewDeck?.title ?? ''} deck`}
      canvasTools={[{ label: 'Flip' }, { label: 'Grade' }]}
      canvasBody={
        previewDeck ? (
          <FlashcardFlip
            pool={previewPool}
            resetKey={previewDeckId}
            onGrade={(cardId, grade) => gradeCard(previewDeckId, cardId, grade)}
            scheduleFor={(cardId) => deckProgress[previewDeckId]?.schedule?.[cardId]}
            onUndo={(cardId, prevSchedule) => undoGradeCard(previewDeckId, cardId, prevSchedule)}
            emptyTitle="Nothing due in this deck."
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
