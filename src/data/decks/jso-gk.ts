// ============================================
// Adapts the JSO/GK question pool (src/data/jso-gk/) — previously exported
// but consumed nowhere in the app — into a real, reviewable Flashcards deck.
// ============================================

import { gkQuestions } from '@/data/jso-gk';
import type { FlashCard } from './types';

/** `explanation` is raw HTML (<p>/<b>/<em>, sometimes a "Source: ..." tag) —
 *  FlashcardFlip renders `back` as plain text, so strip tags here rather than
 *  teaching the component to render HTML for one deck. */
function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

export const jsoGkCards: FlashCard[] = gkQuestions.map((q) => ({
  id: `jso-gk-${q.id}`,
  topic: q.topic,
  topicLabel: q.topic,
  front: q.q,
  back: `${q.options[q.answerIndex]}\n\n${stripHtml(q.explanation)}`,
  examName: q.examName,
}));
