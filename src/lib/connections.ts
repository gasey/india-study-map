import type { Chapter } from '@/types';

/**
 * Cross-chapter connections — the same river, place, or range often
 * appears in both geography and history (the Ravi carries Harappa AND
 * the Rig Veda; Panipat sits on a geography corridor AND three battles).
 * Chapters declare concept tags; overlap = a study connection.
 */

export interface Connection {
  chapter: Chapter;
  shared: string[];
}

/** 'tropic-of-cancer' -> 'Tropic of Cancer' */
export function tagLabel(tag: string): string {
  const small = new Set(['of', 'the', 'and']);
  return tag
    .split('-')
    .map((w, i) => (i > 0 && small.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ');
}

export function getConnections(current: Chapter, all: Chapter[]): Connection[] {
  const mine = new Set(current.tags ?? []);
  if (mine.size === 0) return [];
  return all
    .filter((c) => c.id !== current.id)
    .map((c) => ({ chapter: c, shared: (c.tags ?? []).filter((t) => mine.has(t)) }))
    .filter((x) => x.shared.length > 0)
    .sort((a, b) => b.shared.length - a.shared.length)
    .slice(0, 5);
}
