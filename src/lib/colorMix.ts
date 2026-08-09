// Small color-mix helpers shared by the gradient-driven Jabreeze components
// (DayShelf, GameCard, Badge, MindMap) — wraps CSS color-mix() so tint
// percentages stay consistent instead of every component inventing its own.
export const tint = (color: string, pct: number) => `color-mix(in srgb, ${color} ${pct}%, transparent)`;
export const mixSurface = (color: string, pct: number) => `color-mix(in srgb, ${color} ${pct}%, var(--bg-panel))`;

// One hue per subject is already fixed in tokens.css and "never reassigned"
// per its own comment — reuse that set for anything needing a deterministic
// per-topic color (Current Affairs days, mind-map nodes) rather than
// inventing a second palette.
const HUES = ['--green', '--blue', '--brown', '--gold', '--indigo', '--forest', '--plum'] as const;

/** Explicit per-subject hue. Shared by TestPlayer and the bank's QuestionCard
 *  so a subject is the same colour everywhere it appears. */
const SUBJECT_HUE: Record<string, string> = {
  geography: 'var(--green)', polity: 'var(--blue)', history: 'var(--brown)',
  economics: 'var(--gold)', reasoning: 'var(--indigo)', science: 'var(--forest)',
  english: 'var(--plum)', gk: 'var(--accent)', 'current-affairs': 'var(--info)',
};

export function hueForSubject(subject: string): string {
  return SUBJECT_HUE[subject] ?? 'var(--text-secondary)';
}

export function hueForTopic(topic: string): string {
  let hash = 0;
  for (let i = 0; i < topic.length; i++) hash = (hash * 31 + topic.charCodeAt(i)) >>> 0;
  return `var(${HUES[hash % HUES.length]})`;
}
