// ============================================
// CHRONICLE SCHEMA
// Adding history = one TimelineEntry in a file under
// data/timeline/entries/ + registering the file in
// data/timeline/index.ts. Questions attach themselves
// via BankQuestion.about / shared tags — never edit
// the timeline when adding questions.
// ============================================

/** Year number. BCE dates are simply negative (-321 for 321 BCE) —
 *  sortable and arithmetic-safe. Use formatYear() for display. */
export type Year = number;

export type TrackId = 'history' | 'polity';
// future: | 'economy' | 'mizoram' | 'world'

/** Colors ride the existing .subject-history / .subject-polity CSS
 *  classes (src/styles/globals.css) — same light+dark `--subject`
 *  tokens the rest of the app already uses for these two subjects,
 *  rather than introducing new color constants here. */
export const TRACKS: Record<TrackId, { label: string; cssClass: string }> = {
  history: { label: 'History', cssClass: 'subject-history' },
  polity: { label: 'Polity', cssClass: 'subject-polity' },
};

/** 1 = era-defining (visible fully zoomed out) … 5 = footnote (visible only at year level). */
export type Importance = 1 | 2 | 3 | 4 | 5;

export type EntryKind =
  | 'event' // battle, act, session, judgment — a moment
  | 'period' // dynasty, movement, plan — a span (start..end)
  | 'person'; // reign/tenure — rendered like period, different glyph

export interface TimelineEntry {
  /** Globally unique, prefixed by file: 'anc-mauryan-rise', 'pol-42nd-amend'. */
  id: string;
  track: TrackId;
  kind: EntryKind;
  /** Start year (the only required year). */
  year: Year;
  /** For kind 'period'/'person': end year → rendered as a bar, not a dot. */
  endYear?: Year;
  /** If the date is approximate: renders 'c. 1500 BCE'. */
  circa?: boolean;
  title: string;
  /** One line — shown on the node card at close zoom. */
  summary: string;
  /** Full study note (markdown-ish plain text) — shown in the drawer. */
  detail?: string;
  importance: Importance;
  /** Same tag vocabulary as chapters + banks → powers ALL cross-linking. */
  tags?: string[];
  /** Hard-pin specific bank questions (rarely needed — tag/about join covers most). */
  questionIds?: string[];
  /** Jump straight to a map chapter (e.g. plassey entry → battle-of-plassey chapter). */
  chapterId?: string;
  /** Draw a "caused / led to" thread to another entry at close zoom (sparingly). */
  linksTo?: string[];
}

export interface Era {
  id: string;
  label: string; // 'Ancient', 'Early Medieval', 'Company Rule', 'Republic'
  start: Year;
  end: Year;
  color: string; // translucent band tint
  /** Relative pixels-per-year weight for the piecewise scale (see useTimelineScale). */
  weight: number;
}

const SMALL_WORDS = new Set(['of', 'the', 'and']);

/** 'tropic-of-cancer' -> 'Tropic of Cancer' — mirrors src/lib/connections.ts's tagLabel(). */
export function tagLabel(tag: string): string {
  return tag
    .split('-')
    .map((w, i) => (i > 0 && SMALL_WORDS.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ');
}

/** 1757 -> '1757'; -321 -> '321 BCE'; circa -> 'c. 1500 BCE'. */
export function formatYear(year: Year, circa?: boolean): string {
  const prefix = circa ? 'c. ' : '';
  return year < 0 ? `${prefix}${-year} BCE` : `${prefix}${year}`;
}
