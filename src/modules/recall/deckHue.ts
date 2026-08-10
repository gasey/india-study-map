/** Per-deck colour, matching the design's own arbitrary-but-fixed choice
 *  (Polity Codex -> blue, Mizoram GS -> brown, Current Affairs -> bad-red)
 *  rather than inventing a new palette. Falls back to accent for any future
 *  deck not listed here. */
export const DECK_HUE: Record<string, string> = {
  'polity-codex': 'var(--blue)',
  'mizoram-gs': 'var(--brown)',
  'current-affairs-2025': 'var(--bad)',
};

export function deckHue(deckId: string): string {
  return DECK_HUE[deckId] ?? 'var(--accent)';
}
