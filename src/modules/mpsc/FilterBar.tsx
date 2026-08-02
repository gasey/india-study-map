import type { ReactNode } from 'react';

// ============================================
// Shared admin filter controls — small composable primitives (not one
// monolithic form) so the Reports tab (issue type, has-suggestion) and the
// Comments tab (pinned) can each pick the fields they need while sharing
// layout, styling, and the search/date-range/pagination pieces verbatim.
// ============================================

const inputCls = 'px-2.5 py-1.5 rounded-md text-sm';
const inputStyle = { background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' };

export function FilterBar({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-2 items-center sto-card">{children}</div>;
}

export function SearchInput({ value, onChange, placeholder = 'Search…' }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`${inputCls} flex-1 min-w-[160px]`}
      style={inputStyle}
    />
  );
}

export function DateRangeInputs({
  from, to, onFromChange, onToChange,
}: { from: string; to: string; onFromChange: (v: string) => void; onToChange: (v: string) => void }) {
  return (
    <>
      <input type="date" value={from} onChange={(e) => onFromChange(e.target.value)} className={inputCls} style={inputStyle} title="From date" />
      <input type="date" value={to} onChange={(e) => onToChange(e.target.value)} className={inputCls} style={inputStyle} title="To date" />
    </>
  );
}

export function CheckboxGroup({
  options, selected, onToggle,
}: { options: { value: string; label: string }[]; selected: string[]; onToggle: (value: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2 text-xs">
      {options.map((o) => (
        <label key={o.value} className="flex items-center gap-1 px-1.5 py-1 rounded" style={{ border: '1px solid var(--border)' }}>
          <input type="checkbox" checked={selected.includes(o.value)} onChange={() => onToggle(o.value)} />
          {o.label}
        </label>
      ))}
    </div>
  );
}

export function TriStateToggle({
  value, onChange, label,
}: { value: boolean | undefined; onChange: (v: boolean | undefined) => void; label: string }) {
  const next = () => onChange(value === undefined ? true : value === true ? false : undefined);
  const text = value === undefined ? 'Any' : value ? 'Yes' : 'No';
  return (
    <button type="button" onClick={next} className={inputCls} style={inputStyle}>
      {label}: {text}
    </button>
  );
}

export function SortSelect({ value, onChange }: { value: 'newest' | 'oldest'; onChange: (v: 'newest' | 'oldest') => void }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value as 'newest' | 'oldest')} className={inputCls} style={inputStyle}>
      <option value="newest">Newest first</option>
      <option value="oldest">Oldest first</option>
    </select>
  );
}

export function PaginationControls({
  offset, limit, count, onOffsetChange,
}: { offset: number; limit: number; count: number; onOffsetChange: (offset: number) => void }) {
  return (
    <div className="flex items-center gap-2 text-xs ml-auto" style={{ color: 'var(--text-secondary)' }}>
      <button
        type="button"
        disabled={offset === 0}
        onClick={() => onOffsetChange(Math.max(0, offset - limit))}
        className="px-2 py-1 rounded disabled:opacity-40"
        style={{ border: '1px solid var(--border)' }}
      >
        ← Prev
      </button>
      <span>{offset + 1}–{offset + count}</span>
      <button
        type="button"
        disabled={count < limit}
        onClick={() => onOffsetChange(offset + limit)}
        className="px-2 py-1 rounded disabled:opacity-40"
        style={{ border: '1px solid var(--border)' }}
      >
        Next →
      </button>
    </div>
  );
}
