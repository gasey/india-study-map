import { useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '@/lib/store';
import { formatYear, type Year, type TimelineEntry } from '@/data/timeline/types';
import type { TimelineRenderEntry } from './useTimelineData';
import type { ChronicleScaleHandle } from './TimelineCanvas';

const SEARCH_RESULT_LIMIT = 8;

// Search/jump (design handoff §7, carried over from the old inline toolbar
// search): "1757", "-321", "321 BCE" all parse as a year; anything else
// falls through to a fuzzy title/tag match or a command match instead.
function parseYearQuery(text: string): Year | null {
  const t = text.trim();
  const bce = t.match(/^(\d+)\s*bce$/i);
  if (bce) return -parseInt(bce[1], 10);
  if (/^-?\d+$/.test(t)) return parseInt(t, 10);
  return null;
}

export type PaletteRow =
  | { kind: 'year'; key: string; label: string; run: () => void }
  | { kind: 'command'; key: string; label: string; run: () => void }
  | { kind: 'entry'; key: string; label: string; sublabel: string; run: () => void };

interface UseCommandPaletteArgs {
  renderEntries: TimelineRenderEntry[];
  scaleHandleRef: React.RefObject<ChronicleScaleHandle | null>;
  onSelectEntry: (id: string) => void;
  onQuizCurrentRange: () => void;
}

export function useCommandPalette({
  renderEntries,
  scaleHandleRef,
  onSelectEntry,
  onQuizCurrentRange,
}: UseCommandPaletteArgs) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const lens = useApp((s) => s.chronicle.lens);
  const setChronicleLens = useApp((s) => s.setChronicleLens);
  const view = useApp((s) => s.chronicle.view);
  const setChronicleView = useApp((s) => s.setChronicleView);
  const toggleTheme = useApp((s) => s.toggleTheme);

  function open() {
    setQuery('');
    setActiveIndex(0);
    setIsOpen(true);
  }
  function close() {
    setIsOpen(false);
  }

  // ⌘K / Ctrl+K opens from anywhere; `/` opens too, unless the user is
  // already typing in some other input/textarea (mirrors the old toolbar
  // search's `/`-to-focus shortcut, now scoped globally since the inline
  // search box is gone).
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        open();
        return;
      }
      if (!isOpen && e.key === '/') {
        const tag = (document.activeElement?.tagName ?? '').toLowerCase();
        if (tag === 'input' || tag === 'textarea') return;
        e.preventDefault();
        open();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  // Fixed command list for this phase — a natural place to add an
  // importance-filter command later (see plan's deferred roadmap).
  const commandRows: PaletteRow[] = useMemo(
    () => [
      { kind: 'command', key: 'cmd-fit-all', label: 'Fit all — zoom out to the full range', run: () => { scaleHandleRef.current?.fitAll(); close(); } },
      {
        kind: 'command',
        key: 'cmd-toggle-heat',
        label: lens === 'heat' ? 'Turn off exam-heat lens' : 'Turn on exam-heat lens',
        run: () => { setChronicleLens(lens === 'heat' ? 'none' : 'heat'); close(); },
      },
      { kind: 'command', key: 'cmd-quiz-range', label: 'Quiz the current range', run: () => { onQuizCurrentRange(); close(); } },
      {
        kind: 'command',
        key: 'cmd-toggle-view',
        label: view === 'reading' ? 'Switch to canvas view' : 'Switch to reading view',
        run: () => { setChronicleView(view === 'reading' ? 'canvas' : 'reading'); close(); },
      },
      { kind: 'command', key: 'cmd-toggle-theme', label: 'Toggle light / dark theme', run: () => { toggleTheme(); close(); } },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lens, view]
  );

  const yearQuery = parseYearQuery(query);

  const rows: PaletteRow[] = useMemo(() => {
    if (yearQuery !== null) {
      return [
        {
          kind: 'year',
          key: `year-${yearQuery}`,
          label: `Jump to ${formatYear(yearQuery)}`,
          run: () => { scaleHandleRef.current?.jumpToYearAtL3(yearQuery); close(); },
        },
      ];
    }

    const q = query.trim().toLowerCase();
    if (!q) return commandRows;

    const matchedCommands = commandRows.filter((c) => c.label.toLowerCase().includes(q));
    const matchedEntries: PaletteRow[] = renderEntries
      .filter(
        (r) =>
          r.entry.title.toLowerCase().includes(q) ||
          r.entry.tags?.some((t) => t.toLowerCase().includes(q))
      )
      .slice(0, SEARCH_RESULT_LIMIT)
      .map((r) => entryRow(r.entry, scaleHandleRef, onSelectEntry, close));

    return [...matchedCommands, ...matchedEntries].slice(0, SEARCH_RESULT_LIMIT);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, yearQuery, renderEntries, commandRows]);

  useEffect(() => {
    setActiveIndex((i) => Math.min(i, Math.max(rows.length - 1, 0)));
  }, [rows.length]);

  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      setActiveIndex((i) => Math.min(i + 1, rows.length - 1));
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      setActiveIndex((i) => Math.max(i - 1, 0));
      e.preventDefault();
    } else if (e.key === 'Enter') {
      rows[activeIndex]?.run();
      e.preventDefault();
    } else if (e.key === 'Escape') {
      close();
    }
  }

  return { isOpen, query, setQuery, rows, activeIndex, setActiveIndex, inputRef, open, close, onInputKeyDown };
}

function entryRow(
  entry: TimelineEntry,
  scaleHandleRef: React.RefObject<ChronicleScaleHandle | null>,
  onSelectEntry: (id: string) => void,
  close: () => void
): PaletteRow {
  return {
    kind: 'entry',
    key: `entry-${entry.id}`,
    label: entry.title,
    sublabel: formatYear(entry.year, entry.circa),
    run: () => {
      scaleHandleRef.current?.jumpToYearAtL3(entry.year);
      onSelectEntry(entry.id);
      close();
    },
  };
}
