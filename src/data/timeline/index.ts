import type { TimelineEntry } from './types';
import { ancientIndiaEntries } from './entries/ancient-india';
import { earlyMedievalIndiaEntries } from './entries/early-medieval-india';
import { medievalIndiaEntries } from './entries/medieval-india';
import { modernIndiaEntries } from './entries/modern-india';
import { freedomStruggleEntries } from './entries/freedom-struggle';
import { republicPolityEntries } from './entries/republic-polity';
import { republicHistoryEntries } from './entries/republic-history';

export const timelineEntries: TimelineEntry[] = [
  ...ancientIndiaEntries,
  ...earlyMedievalIndiaEntries,
  ...medievalIndiaEntries,
  ...modernIndiaEntries,
  ...freedomStruggleEntries,
  ...republicPolityEntries,
  ...republicHistoryEntries,
];

const seenIds = new Set<string>();
for (const e of timelineEntries) {
  if (seenIds.has(e.id)) console.error(`[chronicle] duplicate TimelineEntry id: ${e.id}`);
  seenIds.add(e.id);
}

export function getEntry(id: string): TimelineEntry | undefined {
  return timelineEntries.find((e) => e.id === id);
}
