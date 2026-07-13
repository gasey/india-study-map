// ============================================
// FLASHCARD DECK SCHEMA
//
// Decks are content modules like banks and chapters:
// one file per deck in src/data/decks/, registered in
// src/data/decks/index.ts.
// ============================================

export interface FlashCard {
  /** Globally unique — prefix with the deck id. */
  id: string;
  /** Machine topic id, filterable. */
  topic: string;
  topicLabel: string;
  front: string;
  back: string;
  /** Optional concept tags shared with map chapters. */
  tags?: string[];
}

export interface Deck {
  id: string;
  title: string;
  description: string;
  cards: FlashCard[];
}
