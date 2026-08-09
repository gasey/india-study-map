import type { ReactNode } from 'react';
import { FilterBar, PaginationControls } from '@/modules/mpsc/FilterBar';

// ============================================
// AdminTable — the one generic table component per components.md:
// "One component drives Import, Reports, Comments, Mock builder, Papers,
// Static sets, Audit log and Flags." Two cell kinds only — a pill, or text
// with an optional sub-line. "Resist adding a third."
//
// components.md doesn't detail per-row interactivity beyond "row actions",
// so `onRowClick` (selection — e.g. opening a QuestionEditor inspector) and
// `rowActions` (inline buttons — Pin/Delete/Accept) are added as pragmatic,
// non-data extensions; they don't add a third *cell* kind, just let a row
// carry behavior alongside its two-kind cells.
// ============================================

export type AdminCell =
  | { kind: 'text'; text: string; sub?: string; mono?: boolean }
  | { kind: 'pill'; text: string; color: string; bg: string; bd: string };

export interface AdminTableProps {
  heading: string;
  blurb?: string;
  /** Top-right action, e.g. an "Add" button. */
  action?: ReactNode;
  /** Rendered above the table, e.g. search/date-range/checkbox filters —
   *  pass existing FilterBar children (SearchInput, CheckboxGroup, etc). */
  filters?: ReactNode;
  columns: string[];
  /** CSS grid-template-columns string — column widths are the caller's call. */
  grid: string;
  rows: AdminCell[][];
  /** Optional per-row action buttons, rendered as an extra trailing column. */
  rowActions?: (rowIndex: number) => ReactNode;
  onRowClick?: (rowIndex: number) => void;
  selectedRow?: number | null;
  /** Shown under the table — empty state or a one-line footnote. */
  note?: string;
  loading?: boolean;
  pagination?: { offset: number; limit: number; count: number; onOffsetChange: (offset: number) => void };
}

function Cell({ cell }: { cell: AdminCell }) {
  if (cell.kind === 'pill') {
    return (
      <span
        className="text-[10px] font-medium px-2 py-0.5 rounded-full inline-block w-fit"
        style={{ color: cell.color, background: cell.bg, border: `1px solid ${cell.bd}` }}
      >
        {cell.text}
      </span>
    );
  }
  return (
    <div className="min-w-0">
      <div className={`text-sm truncate ${cell.mono ? 'font-mono' : ''}`} style={{ color: 'var(--text-primary)' }}>{cell.text}</div>
      {cell.sub && <div className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{cell.sub}</div>}
    </div>
  );
}

export function AdminTable({
  heading, blurb, action, filters, columns, grid, rows, rowActions, onRowClick, selectedRow, note, loading, pagination,
}: AdminTableProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{heading}</div>
          {blurb && <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{blurb}</div>}
        </div>
        {action}
      </div>

      {filters && <FilterBar>{filters}</FilterBar>}

      <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <div
          className="grid gap-3 px-3 py-2 text-[10px] font-semibold uppercase"
          style={{ gridTemplateColumns: rowActions ? `${grid} auto` : grid, letterSpacing: '0.04em', background: 'var(--bg-panel-elev)', color: 'var(--text-secondary)' }}
        >
          {columns.map((c) => <div key={c}>{c}</div>)}
          {rowActions && <div />}
        </div>

        {loading && <div className="px-3 py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>Loading…</div>}
        {!loading && rows.length === 0 && (
          <div className="px-3 py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{note ?? 'No rows match these filters.'}</div>
        )}
        {!loading && rows.map((row, i) => (
          <div
            key={i}
            onClick={onRowClick ? () => onRowClick(i) : undefined}
            className="grid gap-3 px-3 py-2.5 items-center"
            style={{
              gridTemplateColumns: rowActions ? `${grid} auto` : grid,
              borderTop: '1px solid var(--border)',
              background: selectedRow === i ? 'var(--accent-soft)' : undefined,
              cursor: onRowClick ? 'pointer' : undefined,
            }}
          >
            {row.map((cell, j) => <Cell key={j} cell={cell} />)}
            {rowActions && (
              <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 shrink-0">
                {rowActions(i)}
              </div>
            )}
          </div>
        ))}
      </div>

      {note && rows.length > 0 && <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{note}</div>}
      {pagination && <PaginationControls {...pagination} />}
    </div>
  );
}
