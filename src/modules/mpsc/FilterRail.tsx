import { useEffect, useState } from 'react';
import { emptyFilters, type MpscFilters } from './useMpscData';

// ============================================
// FilterRail — collapsible accordion filter panel for Browse/Practice.
// Adapted from the Jabreeze handoff's <FilterRail/> spec to the axes this
// bank's data actually has: Exam type, Post, Year, Subject, Difficulty,
// Type, plus free-text Search. The spec's "Exam date" and "Answer & data
// quality" groups are dropped — this bank has no exact paper dates and no
// answer-source/verification data wired up yet. A "Paper" chip-multiselect
// (also in the spec) is dropped too: picking one of 1,750 papers from a
// checkbox list isn't a usable control; paperId stays filterable via the
// API for direct links (e.g. a future "browse this paper's questions"
// link from Library), just not exposed as a rail group here.
//
// Option counts come from live facets (`/api/mpsc/questions/facets`), so
// they always reflect the *other* active filters, not just "does this
// value exist anywhere in the bank" — a group only ever lists values that
// are still reachable given the rest of the current filter combination.
// ============================================

const GROUPS: { key: keyof MpscFilters; dim: string; label: string }[] = [
  { key: 'examType', dim: 'examType', label: 'Exam type' },
  { key: 'post', dim: 'post', label: 'Post' },
  { key: 'year', dim: 'year', label: 'Year' },
  { key: 'subject', dim: 'subject', label: 'Subject' },
  { key: 'difficulty', dim: 'difficulty', label: 'Difficulty' },
  { key: 'type', dim: 'type', label: 'Type' },
];

const STORAGE_KEY = 'mpsc-filterrail-groups';

function loadOpenState(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

interface FilterRailProps {
  filters: MpscFilters;
  onChange: (patch: Partial<MpscFilters>) => void;
  facets: Record<string, Record<string, number>>;
}

export function FilterRail({ filters, onChange, facets }: FilterRailProps) {
  const [open, setOpen] = useState<Record<string, boolean>>(loadOpenState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(open));
    } catch {
      // ignore — not worth surfacing a storage-quota error for a UI preference
    }
  }, [open]);

  const toggleOpen = (key: string) => setOpen((o) => ({ ...o, [key]: !o[key] }));

  const toggleValue = (key: keyof MpscFilters, value: string) => {
    const current = filters[key] as string[];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    onChange({ [key]: next } as Partial<MpscFilters>);
  };

  const chips: { label: string; onRemove: () => void }[] = [];
  for (const g of GROUPS) {
    for (const v of filters[g.key] as string[]) {
      chips.push({ label: `${g.label}: ${v}`, onRemove: () => toggleValue(g.key, v) });
    }
  }
  if (filters.search.trim()) {
    chips.push({ label: `Search: "${filters.search.trim()}"`, onRemove: () => onChange({ search: '' }) });
  }

  return (
    <div
      className="w-full sm:w-64 shrink-0 flex flex-col gap-3 p-3 rounded-xl sm:sticky sm:top-0 sm:self-start sm:max-h-[calc(100vh-8rem)] sm:overflow-y-auto"
      style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wide" style={{ color: 'var(--text-secondary)' }}>FILTERS</span>
        {chips.length > 0 && (
          <button onClick={() => onChange(emptyFilters)} className="text-xs hover:underline" style={{ color: 'var(--accent)' }}>
            Reset all
          </button>
        )}
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {chips.map((c) => (
            <button
              key={c.label}
              onClick={c.onRemove}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
            >
              {c.label} ✕
            </button>
          ))}
        </div>
      )}

      <input
        type="text"
        value={filters.search}
        onChange={(e) => onChange({ search: e.target.value })}
        placeholder="Search questions…"
        className="w-full px-2.5 py-1.5 rounded-md text-sm"
        style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
      />

      {GROUPS.map((g) => {
        const entries = Object.entries(facets[g.dim] ?? {}).sort((a, b) => b[1] - a[1]);
        const selected = filters[g.key] as string[];
        const isOpen = open[g.key] ?? false;
        return (
          <div key={g.key} className="pt-2" style={{ borderTop: '1px solid var(--border)' }}>
            <button onClick={() => toggleOpen(g.key)} className="w-full flex items-center justify-between text-sm font-medium">
              <span>{g.label}{selected.length > 0 ? ` (${selected.length})` : ''}</span>
              <span style={{ color: 'var(--text-secondary)' }}>{isOpen ? '▾' : '▸'}</span>
            </button>
            {isOpen && (
              <fieldset className="mt-2 flex flex-col gap-1 max-h-48 overflow-y-auto">
                <legend className="sr-only">{g.label}</legend>
                {entries.length === 0 && (
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>No options match the current filters</p>
                )}
                {entries.map(([value, count]) => (
                  <label key={value} className="flex items-center gap-1.5 text-xs">
                    <input type="checkbox" checked={selected.includes(value)} onChange={() => toggleValue(g.key, value)} />
                    <span className="flex-1 truncate">{value}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{count}</span>
                  </label>
                ))}
              </fieldset>
            )}
          </div>
        );
      })}
    </div>
  );
}
