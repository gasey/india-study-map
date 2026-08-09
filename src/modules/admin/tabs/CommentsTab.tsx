import { useEffect, useState } from 'react';
import * as api from '@/lib/mpscApi';
import type { AdminComment } from '@/lib/mpscApi';
import { SearchInput, DateRangeInputs, TriStateToggle } from '@/modules/mpsc/FilterBar';
import { AdminTable, type AdminCell } from '@/modules/admin/AdminTable';

const PAGE_SIZE = 25;

export function CommentsTab() {
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [pinned, setPinned] = useState<boolean | undefined>(undefined);
  const [offset, setOffset] = useState(0);
  const [comments, setComments] = useState<AdminComment[] | null>(null);

  const load = () => {
    setComments(null);
    // bankId omitted deliberately — this is the whole point of the new
    // console: one cross-bank view instead of one page per bank.
    api.adminListComments({ search: search || undefined, fromDate: fromDate || undefined, toDate: toDate || undefined, pinned, limit: PAGE_SIZE, offset })
      .then((r) => setComments(r.comments));
  };
  useEffect(load, [search, fromDate, toDate, pinned, offset]);
  useEffect(() => setOffset(0), [search, fromDate, toDate, pinned]);

  const togglePin = async (id: number) => { await api.pinComment(id); load(); };
  const remove = async (id: number) => { await api.deleteComment(id); load(); };

  const rows: AdminCell[][] = (comments ?? []).map((c) => [
    { kind: 'text', text: c.displayName ?? c.username },
    { kind: 'text', text: c.body.slice(0, 80), sub: `${c.bankId} · ${c.questionId}` },
    { kind: 'text', text: new Date(c.createdAt).toLocaleString(), mono: true },
    c.isPinned
      ? { kind: 'pill', text: 'Pinned', color: 'var(--warn)', bg: 'color-mix(in srgb, var(--warn) 14%, transparent)', bd: 'var(--warn)' }
      : { kind: 'text', text: '—' },
  ]);

  return (
    <AdminTable
      heading="Comments"
      blurb="Browse and moderate comments across every bank."
      loading={comments === null}
      filters={
        <>
          <SearchInput value={search} onChange={setSearch} placeholder="Search comment text…" />
          <DateRangeInputs from={fromDate} to={toDate} onFromChange={setFromDate} onToChange={setToDate} />
          <TriStateToggle value={pinned} onChange={setPinned} label="Pinned" />
        </>
      }
      columns={['Author', 'Comment', 'Posted', 'Status']}
      grid="140px 1fr 160px 90px"
      rows={rows}
      rowActions={(i) => {
        const c = comments![i];
        return (
          <>
            <button onClick={() => togglePin(c.id)} className="text-xs" style={{ color: 'var(--accent)' }}>{c.isPinned ? 'Unpin' : 'Pin'}</button>
            <button onClick={() => remove(c.id)} className="text-xs" style={{ color: 'var(--bad)' }}>Delete</button>
          </>
        );
      }}
      pagination={{ offset, limit: PAGE_SIZE, count: comments?.length ?? 0, onOffsetChange: setOffset }}
    />
  );
}
