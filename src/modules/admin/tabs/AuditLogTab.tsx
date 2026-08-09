import { useEffect, useState } from 'react';
import * as api from '@/lib/mpscApi';
import type { AuditLogEntry } from '@/lib/mpscApi';
import { DateRangeInputs } from '@/modules/mpsc/FilterBar';
import { AdminTable, type AdminCell } from '@/modules/admin/AdminTable';

const PAGE_SIZE = 25;

const ACTION_LABEL: Record<AuditLogEntry['action'], string> = {
  correction: 'Correction', report_status: 'Report status', comment_pinned: 'Comment pinned', comment_deleted: 'Comment deleted',
};

export function AuditLogTab() {
  const [action, setAction] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [offset, setOffset] = useState(0);
  const [entries, setEntries] = useState<AuditLogEntry[] | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    setEntries(null);
    api.adminListAuditLog({ action: action || undefined, fromDate: fromDate || undefined, toDate: toDate || undefined, limit: PAGE_SIZE, offset })
      .then((r) => setEntries(r.entries));
  }, [action, fromDate, toDate, offset]);
  useEffect(() => setOffset(0), [action, fromDate, toDate]);

  const rows: AdminCell[][] = (entries ?? []).map((e) => [
    { kind: 'pill', text: ACTION_LABEL[e.action] ?? e.action, color: 'var(--accent)', bg: 'var(--accent-soft)', bd: 'var(--accent)' },
    { kind: 'text', text: `${e.bankId} / ${e.questionId}`, sub: e.subpartLabel ? `sub-part ${e.subpartLabel}` : e.note ?? undefined, mono: true },
    { kind: 'text', text: e.actorUsername },
    { kind: 'text', text: new Date(e.createdAt).toLocaleString(), mono: true },
  ]);

  const selected = expanded !== null ? entries?.[expanded] : null;

  return (
    <div className="flex flex-col gap-3">
      <AdminTable
        heading="Audit log"
        blurb="Every correction, report resolution, and comment moderation action — who changed what, when."
        loading={entries === null}
        filters={
          <>
            <select value={action} onChange={(e) => setAction(e.target.value)} className="px-2.5 py-1.5 rounded-md text-sm" style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
              <option value="">All actions</option>
              <option value="correction">Correction</option>
              <option value="report_status">Report status change</option>
              <option value="comment_pinned">Comment pinned</option>
              <option value="comment_deleted">Comment deleted</option>
            </select>
            <DateRangeInputs from={fromDate} to={toDate} onFromChange={setFromDate} onToChange={setToDate} />
          </>
        }
        columns={['Action', 'Question', 'Actor', 'When']}
        grid="130px 1fr 120px 170px"
        rows={rows}
        onRowClick={(i) => setExpanded(expanded === i ? null : i)}
        selectedRow={expanded}
        pagination={{ offset, limit: PAGE_SIZE, count: entries?.length ?? 0, onOffsetChange: setOffset }}
      />

      {selected && (selected.before || selected.after) && (
        <div className="rounded-lg p-3" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
          <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Before / after</div>
          <div className="grid grid-cols-2 gap-3">
            <pre className="p-2 rounded overflow-x-auto text-[11px]" style={{ background: 'var(--bg-app)', color: 'var(--text-secondary)' }}>{JSON.stringify(selected.before, null, 2)}</pre>
            <pre className="p-2 rounded overflow-x-auto text-[11px]" style={{ background: 'var(--bg-app)', color: 'var(--text-secondary)' }}>{JSON.stringify(selected.after, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
