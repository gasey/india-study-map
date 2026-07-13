import type { Deck } from './types';
import { polityCodexCards } from './polity-codex-cards';
import { currentAffairs2025Cards } from './current-affairs-2025';
import { mizoramGsCards } from './mizoram-gs';

// Register decks here — same pattern as chapters and banks.
export const decks: Deck[] = [
  {
    id: 'polity-codex',
    title: 'Polity Codex',
    description: 'Rapid recall — colonial statutes to the Sixth Schedule, mined from the Codex guide.',
    cards: polityCodexCards,
  },
  {
    id: 'mizoram-gs',
    title: 'Mizoram GS',
    description: 'Budget 2026-27, tourism policy, security & law and order — mined from the GS V decks.',
    cards: mizoramGsCards,
  },
  {
    id: 'current-affairs-2025',
    title: 'Current Affairs 2025',
    description: 'Days, appointments, awards, rankings — curated from the 2025 monthly CA digests.',
    cards: currentAffairs2025Cards,
  },
];

export function getDeck(id: string): Deck | undefined {
  return decks.find((d) => d.id === id);
}
