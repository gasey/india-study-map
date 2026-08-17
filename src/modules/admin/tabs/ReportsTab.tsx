import { useEffect, useState } from 'react';
import * as api from '@/lib/mpscApi';
import type { QuestionReport } from '@/lib/mpscApi';
import { SearchInput, DateRangeInputs, CheckboxGroup, TriStateToggle, SortSelect } from '@/modules/mpsc/FilterBar';
import { AdminTable, type AdminCell } from '@/modules/admin/AdminTable';
import { QuestionEditor } from '@/modules/admin/QuestionEditor';

const PAGE_SIZE = 25;

const ISSUE_TYPES = [
  { value: 'wrong_answer', label: 'Wrong answer' },
  { value: 'unclear', label: 'Unclear / ambiguous' },
  { value: 'typo', label: 'Typo / OCR garble' },
  { value: 'other', label: 'Other' },
];

const STATUS_COLOR: Record<QuestionReport['status'], string> = { accepted: 'var(--ok)', rejected: 'var(--bad)', pending: 'var(--warn)' };

export function ReportsTab() {
  const [statusFilter, setStatusFilter] = useState<'pending' | 'accepted' | 'rejected' | ''>('pending');
  const [issueTypes, setIssueTypes] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [hasSuggestion, setHasSuggestion] = useState<boolean | undefined>(undefined);
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');
  const [offset, setOffset] = useState(0);

  const [reports, setReports] = useState<QuestionReport[] | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [bulkNote, setBulkNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);

  const load = async () => {
    // Fetch fresh data without clearing state prematurely
    try {
      const result = await api.adminListReports({
        status: statusFilter || undefined,
        issueType: issueTypes.length ? issueTypes : undefined,
        search: search || undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        hasSuggestion,
        sort,
        limit: PAGE_SIZE,
        offset,
      });
      setReports(result.reports);
      setSelected(new Set());
    } catch (err) {
      // On error, keep the existing reports list so the UI doesn't flash blank
      console.error('Failed to reload reports', err);
    }
  };

  useEffect(load, [statusFilter, issueTypes, search, fromDate, toDate, hasSuggestion, sort, offset]);
  useEffect(() => setOffset(0), [statusFilter, issueTypes, search, fromDate, toDate, hasSuggestion, sort]);

  const toggle = (id: number) => setSelected((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const bulkResolve = async (status: 'accepted' | 'rejected') => {
    if (selected.size === 0) return;
    setBusy(true);
    try {
      await api.adminBulkStatus(Array.from(selected), status, bulkNote);
      setBulkNote('');
      load();
    } finally {
      setBusy(false);
    }
  };

  const rows: AdminCell[][] = (reports ?? []).map((r) => [
    { kind: 'pill', text: r.status, color: STATUS_COLOR[r.status], bg: `color-mix(in srgb, ${STATUS_COLOR[r.status]} 14%, transparent)`, bd: STATUS_COLOR[r.status] },
    { kind: 'text', text: r.issueType.replace(/_/g, ' '), sub: `${r.bankId} / ${r.questionId}${r.subpartLabel ? `#${r.subpartLabel}` : ''}`, mono: false },
    { kind: 'text', text: r.message || '(no message)' },
    { kind: 'text', text: new Date(r.createdAt).toLocaleDateString(), mono: true },
  ]);

  const editingReport = editing !== null ? reports?.find((r) => r.id === editing) : null;

  return (
    <div className="flex gap-4 items-start">
      <div className="flex-1 min-w-0 flex flex-col gap-3">
        <AdminTable
          heading="Reports"
          blurb="Flags filed against questions across every bank."
          loading={reports === null}
          filters={
            <>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)} className="px-2.5 py-1.5 rounded-md text-sm" style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="">All statuses</option>
              </select>
              <CheckboxGroup options={ISSUE_TYPES} selected={issueTypes} onToggle={(v) => setIssueTypes((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]))} />
              <SearchInput value={search} onChange={setSearch} placeholder="Search message / reporter…" />
              <DateRangeInputs from={fromDate} to={toDate} onFromChange={setFromDate} onToChange={setToDate} />
              <TriStateToggle value={hasSuggestion} onChange={setHasSuggestion} label="Has suggestion" />
              <SortSelect value={sort} onChange={setSort} />
            </>
          }
          action={
            selected.size > 0 && (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Note shown to reporter(s)…"
                  value={bulkNote}
                  onChange={(e) => setBulkNote(e.target.value)}
                  className="px-2 py-1 rounded text-xs"
                  style={{ background: 'var(--bg-app)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                />
                <button disabled={busy} onClick={() => bulkResolve('accepted')} className="px-2.5 py-1 rounded text-xs font-medium" style={{ background: 'var(--ok)', color: '#fff' }}>
                  Accept {selected.size}
                </button>
                <button disabled={busy} onClick={() => bulkResolve('rejected')} className="px-2.5 py-1 rounded text-xs font-medium" style={{ background: 'var(--bad)', color: '#fff' }}>
                  Reject {selected.size}
                </button>
              </div>
            )
          }
          columns={['Status', 'Issue', 'Message', 'Filed']}
          grid="90px 240px 1fr 100px"
          rows={rows}
          onRowClick={(i) => setEditing(reports![i].id)}
          selectedRow={editingReport ? reports!.findIndex((r) => r.id === editing) : null}
          rowActions={(i) => {
            const r = reports![i];
            return (
              <input type="checkbox" checked={selected.has(r.id)} onChange={(e) => { e.stopPropagation(); toggle(r.id); }} onClick={(e) => e.stopPropagation()} />
            );
          }}
          pagination={{ offset, limit: PAGE_SIZE, count: reports?.length ?? 0, onOffsetChange: setOffset }}
        />
      </div>

      {editingReport && (
        <QuestionEditor
          bankId={editingReport.bankId}
          questionId={editingReport.questionId}
          subpartLabel={editingReport.subpartLabel}
          suggestedAnswerIndex={editingReport.suggestedAnswerIndex}
          reportIds={[editingReport.id]}
          initialAdminNote={editingReport.adminNote ?? undefined}
          onSaved={() => {
            setEditing(null);
            // Reload reports to show updated correction status
            load();
          }}
          onDiscard={() => setEditing(null)}
        />
      )}
    </div>
  );
}
