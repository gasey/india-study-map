import { useMemo } from 'react';
import { timelineEntries } from '@/data/timeline';
import type { TimelineEntry } from '@/data/timeline/types';
import { eras } from '@/data/timeline/eras';
import { allQuestions } from '@/data/banks';
import type { BankQuestion } from '@/data/banks/types';

export interface TimelineRenderEntry {
  entry: TimelineEntry;
  questions: BankQuestion[];
}

export interface TimelineData {
  /** All entries, each with its attached bank questions, sorted by year
   *  (ascending) so a later virtualization pass can window over them. */
  renderEntries: TimelineRenderEntry[];
  /** Questions with `about` set that matched no entry — surfaced as
   *  "unclaimed" ticks on the axis instead of silently dropped. */
  orphanQuestions: BankQuestion[];
}

/** Point events get a +/-2yr window; periods use their own span (spec §2.3). */
function entrySpan(entry: TimelineEntry): [number, number] {
  return entry.endYear !== undefined ? [entry.year, entry.endYear] : [entry.year - 2, entry.year + 2];
}

function sharedTagCount(a?: string[], b?: string[]): number {
  if (!a?.length || !b?.length) return 0;
  const set = new Set(a);
  return b.reduce((n, t) => n + (set.has(t) ? 1 : 0), 0);
}

// ============================================
// Joins entries -> bank questions (spec §2.3, growth mechanism):
//   1. Direct pin: entry.questionIds.
//   2. Year proximity + tag overlap: candidate entries whose span
//      contains `about`, preferring the most shared tags; ties broken
//      by the tightest/most specific span, then nearest start year.
//   3. No span contains `about` at all -> orphan.
// Entry<->chapter tag linking (the other direction of the same join)
// isn't computed here — nothing renders it until the drawer lands.
// ============================================
export function useTimelineData(): TimelineData {
  return useMemo(() => {
    const questionsByEntryId = new Map<string, BankQuestion[]>();
    const orphanQuestions: BankQuestion[] = [];

    const pinnedEntryIdByQuestionId = new Map<string, string>();
    for (const entry of timelineEntries) {
      for (const qid of entry.questionIds ?? []) pinnedEntryIdByQuestionId.set(qid, entry.id);
    }

    for (const q of allQuestions) {
      const pinnedEntryId = pinnedEntryIdByQuestionId.get(q.id);
      if (pinnedEntryId) {
        attach(questionsByEntryId, pinnedEntryId, q);
        continue;
      }

      if (q.about === undefined) continue;
      const about = q.about;

      const candidates = timelineEntries.filter((e) => {
        const [start, end] = entrySpan(e);
        return about >= start && about <= end;
      });

      if (candidates.length === 0) {
        orphanQuestions.push(q);
        continue;
      }

      let best = candidates[0];
      let bestTagCount = sharedTagCount(best.tags, q.tags);
      let bestSpanSize = spanSize(best);
      let bestDistance = Math.abs(about - best.year);

      for (const c of candidates.slice(1)) {
        const tagCount = sharedTagCount(c.tags, q.tags);
        const size = spanSize(c);
        const distance = Math.abs(about - c.year);
        const better =
          tagCount > bestTagCount ||
          (tagCount === bestTagCount && size < bestSpanSize) ||
          (tagCount === bestTagCount && size === bestSpanSize && distance < bestDistance);
        if (better) {
          best = c;
          bestTagCount = tagCount;
          bestSpanSize = size;
          bestDistance = distance;
        }
      }

      attach(questionsByEntryId, best.id, q);
    }

    warnOutsideEraRange(timelineEntries);
    if (orphanQuestions.length > 0) {
      console.info(
        `[chronicle] ${orphanQuestions.length} bank question(s) have 'about' but match no timeline entry:`,
        orphanQuestions.map((q) => q.id)
      );
    }

    const renderEntries: TimelineRenderEntry[] = timelineEntries
      .map((entry) => ({ entry, questions: questionsByEntryId.get(entry.id) ?? [] }))
      .sort((a, b) => a.entry.year - b.entry.year);

    return { renderEntries, orphanQuestions };
  }, []);
}

function spanSize(entry: TimelineEntry): number {
  const [start, end] = entrySpan(entry);
  return end - start;
}

function attach(map: Map<string, BankQuestion[]>, entryId: string, q: BankQuestion) {
  const list = map.get(entryId) ?? [];
  list.push(q);
  map.set(entryId, list);
}

function warnOutsideEraRange(entries: TimelineEntry[]) {
  const rangeStart = eras[0].start;
  const rangeEnd = eras[eras.length - 1].end;
  for (const e of entries) {
    const outOfRange =
      e.year < rangeStart ||
      e.year > rangeEnd ||
      (e.endYear !== undefined && (e.endYear < rangeStart || e.endYear > rangeEnd));
    if (outOfRange) {
      console.warn(`[chronicle] entry "${e.id}" falls outside the era backbone (${rangeStart}..${rangeEnd})`);
    }
  }
}
