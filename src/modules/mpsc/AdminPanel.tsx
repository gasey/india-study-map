import { useEffect, useState } from 'react';
import * as api from '@/lib/mpscApi';
import type { AdminComment, AuditLogEntry, QuestionReport } from '@/lib/mpscApi';
import type { BankQuestion } from '@/data/banks/types';
import { isMcqQuestion } from '@/data/banks/types';
import {
  FilterBar, SearchInput, DateRangeInputs, CheckboxGroup, TriStateToggle, SortSelect, PaginationControls,
} from './FilterBar';

const PAGE_SIZE = 25;

const ISSUE_TYPES = [
  { value: 'wrong_answer', label: 'Wrong answer' },
  { value: 'unclear', label: 'Unclear / ambiguous' },
  { value: 'typo', label: 'Typo / OCR garble' },
  { value: 'other', label: 'Other' },
];

type AdminTab = 'reports' | 'history' | 'comments' | 'users' | 'dashboard';

/** Admin console for one bank: report triage, change history, comment
 *  moderation, users, and a headline dashboard. */
export function AdminPanel({
  bankId, questionsById, onCorrectionApplied,
}: {
  bankId: string; questionsById: Map<string, BankQuestion>; onCorrectionApplied: () => void;
}) {
  const [tab, setTab] = useState<AdminTab>('reports');

  return (
    <div className="max-w-5xl space-y-4">
      <div className="flex gap-5 text-sm border-b overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
        {(
          [
            ['reports', '🚩 Reports'],
            ['history', '🕘 History'],
            ['comments', '💬 Comments'],
            ['users', '👤 Users'],
            ['dashboard', '📊 Dashboard'],
          ] as const
        ).map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="pb-2 whitespace-nowrap font-medium"
            style={{
              color: tab === t ? 'var(--accent)' : 'var(--text-secondary)',
              borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'reports' && <ReportsTab bankId={bankId} questionsById={questionsById} onCorrectionApplied={onCorrectionApplied} />}
      {tab === 'history' && <HistoryTab bankId={bankId} questionsById={questionsById} />}
      {tab === 'comments' && <CommentsTab bankId={bankId} />}
      {tab === 'users' && <UsersTab />}
      {tab === 'dashboard' && <DashboardTab />}
    </div>
  );
}

// ============================================================
// Reports — bulk triage + per-report correction, now with a real filter
// bar (was status-only) and pagination (was a hardcoded top-500).
// ============================================================

function ReportsTab({
  bankId, questionsById, onCorrectionApplied,
}: {
  bankId: string; questionsById: Map<string, BankQuestion>; onCorrectionApplied: () => void;
}) {
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
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const load = () => {
    setReports(null);
    setSelected(new Set());
    api.adminListReports({
      status: statusFilter || undefined,
      bankId,
      issueType: issueTypes.length ? issueTypes : undefined,
      search: search || undefined,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      hasSuggestion,
      sort,
      limit: PAGE_SIZE,
      offset,
    }).then((r) => setReports(r.reports));
  };

  useEffect(load, [statusFilter, bankId, issueTypes, search, fromDate, toDate, hasSuggestion, sort, offset]);
  // Reset to page 1 whenever a filter (not the page itself) changes.
  useEffect(() => setOffset(0), [statusFilter, bankId, issueTypes, search, fromDate, toDate, hasSuggestion, sort]);

  const toggle = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (!reports) return;
    setSelected((prev) => (prev.size === reports.length ? new Set() : new Set(reports.map((r) => r.id))));
  };

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

  return (
    <div className="space-y-3">
      <FilterBar>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="px-2.5 py-1.5 rounded-md text-sm"
          style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
        >
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
          <option value="">All statuses</option>
        </select>
        <CheckboxGroup
          options={ISSUE_TYPES}
          selected={issueTypes}
          onToggle={(v) => setIssueTypes((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]))}
        />
        <SearchInput value={search} onChange={setSearch} placeholder="Search message / reporter…" />
        <DateRangeInputs from={fromDate} to={toDate} onFromChange={setFromDate} onToChange={setToDate} />
        <TriStateToggle value={hasSuggestion} onChange={setHasSuggestion} label="Has suggestion" />
        <SortSelect value={sort} onChange={setSort} />
      </FilterBar>

      {reports === null && <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading…</p>}
      {reports?.length === 0 && <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No reports match these filters.</p>}

      {reports && reports.length > 0 && (
        <>
          <div className="sto-card flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-1.5 text-xs">
              <input type="checkbox" checked={selected.size === reports.length} onChange={toggleAll} />
              {selected.size} / {reports.length} selected
            </label>
            <input
              type="text"
              placeholder="Note shown to reporter(s)…"
              value={bulkNote}
              onChange={(e) => setBulkNote(e.target.value)}
              className="px-2 py-1 rounded text-xs flex-1 min-w-[160px]"
              style={{ background: 'var(--bg-app)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            />
            <button
              disabled={busy || selected.size === 0}
              onClick={() => bulkResolve('accepted')}
              className="px-2.5 py-1 rounded text-xs font-medium"
              style={{ background: '#2e7d4f', color: '#fff' }}
            >
              Accept selected
            </button>
            <button
              disabled={busy || selected.size === 0}
              onClick={() => bulkResolve('rejected')}
              className="px-2.5 py-1 rounded text-xs font-medium"
              style={{ background: '#a33232', color: '#fff' }}
            >
              Reject selected
            </button>
            <PaginationControls offset={offset} limit={PAGE_SIZE} count={reports.length} onOffsetChange={setOffset} />
          </div>

          <div className="space-y-2">
            {reports.map((r) => (
              <ReportRow
                key={r.id}
                report={r}
                question={questionsById.get(r.questionId)}
                selected={selected.has(r.id)}
                onToggle={() => toggle(r.id)}
                expanded={expandedId === r.id}
                onExpand={() => setExpandedId(expandedId === r.id ? null : r.id)}
                onResolved={load}
                onCorrectionApplied={onCorrectionApplied}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ReportRow({
  report, question, selected, onToggle, expanded, onExpand, onResolved, onCorrectionApplied,
}: {
  report: QuestionReport; question: BankQuestion | undefined; selected: boolean; onToggle: () => void;
  expanded: boolean; onExpand: () => void; onResolved: () => void; onCorrectionApplied: () => void;
}) {
  const isDescriptive = question !== undefined && !isMcqQuestion(question);

  const [answerIndex, setAnswerIndex] = useState<string>(String(report.suggestedAnswerIndex ?? ''));
  const [explanation, setExplanation] = useState(question && isMcqQuestion(question) ? question.explanation : (question?.explanation ?? ''));
  const [note, setNote] = useState('');
  const [adminNote, setAdminNote] = useState(report.adminNote ?? '');
  const [stem, setStem] = useState(question?.question ?? '');
  const [options, setOptions] = useState<string[]>(question && isMcqQuestion(question) ? question.options : []);
  const [subparts, setSubparts] = useState<{ label: string; text: string; modelAnswer: string }[]>(
    question && !isMcqQuestion(question) ? (question.subparts ?? []).map((sp) => ({ label: sp.label, text: sp.text, modelAnswer: sp.modelAnswer ?? '' })) : [],
  );
  const [saving, setSaving] = useState(false);

  const statusColor = report.status === 'accepted' ? '#2e7d4f' : report.status === 'rejected' ? '#a33232' : '#9a6b12';

  const setOption = (i: number, value: string) => setOptions((prev) => prev.map((o, j) => (j === i ? value : o)));
  const setSubpart = (i: number, field: 'text' | 'modelAnswer', value: string) =>
    setSubparts((prev) => prev.map((sp, j) => (j === i ? { ...sp, [field]: value } : sp)));

  const stemChanged = stem !== (question?.question ?? '');
  const optionsChanged = question && isMcqQuestion(question) ? options.some((o, i) => o !== question.options[i]) : false;

  const applyCorrection = async () => {
    setSaving(true);
    try {
      await api.adminUpsertCorrection({
        bankId: report.bankId,
        questionId: report.questionId,
        subpartLabel: report.subpartLabel,
        correctedAnswerIndex: isDescriptive || answerIndex === '' ? null : Number(answerIndex),
        correctedExplanation: explanation || null,
        correctedNote: note || null,
        correctedStem: stemChanged ? stem : null,
        correctedOptions: optionsChanged ? options : null,
        correctedSubparts: isDescriptive
          ? subparts.map((sp) => ({ label: sp.label, text: sp.text, modelAnswer: sp.modelAnswer || undefined }))
          : null,
        reportIds: [report.id],
        adminNote,
      });
      onResolved();
      onCorrectionApplied();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="sto-card space-y-2">
      <div className="flex items-start gap-2">
        <input type="checkbox" checked={selected} onChange={onToggle} className="mt-1" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap text-xs mb-1">
            <span className="sto-pill" style={{ color: statusColor, borderColor: statusColor }}>{report.status}</span>
            <span className="sto-pill">{report.issueType.replace(/_/g, ' ')}</span>
            {report.subpartLabel && <span className="sto-pill">sub-part {report.subpartLabel}</span>}
            <span style={{ color: 'var(--text-secondary)' }}>by {report.username ?? '?'} · {new Date(report.createdAt).toLocaleDateString()}</span>
          </div>
          <p className="text-sm font-medium">{question?.question ?? `(question ${report.questionId} not loaded in this bank view)`}</p>
          {report.message && <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>"{report.message}"</p>}
          {report.suggestedAnswerIndex !== null && question && isMcqQuestion(question) && (
            <p className="text-xs mt-1" style={{ color: 'var(--accent)' }}>
              Suggested answer: {String.fromCharCode(97 + report.suggestedAnswerIndex)}) {question.options[report.suggestedAnswerIndex]}
            </p>
          )}
          {report.suggestedText && (
            <p className="text-xs mt-1" style={{ color: 'var(--accent)' }}>Suggested text: "{report.suggestedText}"</p>
          )}
          {report.adminNote && (
            <p className="text-xs mt-1 p-1.5 rounded" style={{ background: 'var(--bg-app)', color: 'var(--text-secondary)' }}>
              Admin note: {report.adminNote} {report.reviewedBy && `— ${report.reviewedBy}`}
            </p>
          )}
          <button onClick={onExpand} className="text-xs mt-1.5 font-medium" style={{ color: 'var(--accent)' }}>
            {expanded ? '▾ Hide correction form' : '▸ Correct this question'}
          </button>
        </div>
      </div>

      {expanded && question && (
        <div className="space-y-1.5 ml-6 pt-2" style={{ borderTop: '1px dashed var(--border)' }}>
          <label className="block text-xs font-medium">
            Question stem
            {stemChanged && <span style={{ color: 'var(--accent)' }}> · edited</span>}
          </label>
          <textarea
            value={stem}
            onChange={(e) => setStem(e.target.value)}
            rows={2}
            placeholder="Wrap the target word in __double underscores__ to mark it underlined — fixes OCR that dropped the exam's original underline."
            className="px-2 py-1 rounded text-xs w-full"
            style={{ background: 'var(--bg-app)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          />

          {!isDescriptive && (
            <>
              <label className="block text-xs font-medium">
                Options
                {optionsChanged && <span style={{ color: 'var(--accent)' }}> · edited</span>}
              </label>
              <div className="space-y-1">
                {options.map((o, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="text-xs shrink-0" style={{ color: 'var(--text-secondary)' }}>{String.fromCharCode(97 + i)})</span>
                    <input
                      type="text"
                      value={o}
                      onChange={(e) => setOption(i, e.target.value)}
                      className="px-2 py-1 rounded text-xs w-full"
                      style={{ background: 'var(--bg-app)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                    />
                  </div>
                ))}
              </div>
              <label className="block text-xs font-medium">Correct answer</label>
              <select
                value={answerIndex}
                onChange={(e) => setAnswerIndex(e.target.value)}
                className="px-2 py-1 rounded text-xs w-full"
                style={{ background: 'var(--bg-app)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              >
                <option value="">— keep unchanged ({isMcqQuestion(question) ? String.fromCharCode(97 + question.answerIndex) : '?'}) —</option>
                {options.map((o, i) => <option key={i} value={i}>{String.fromCharCode(97 + i)}) {o}</option>)}
              </select>
            </>
          )}

          {isDescriptive && (
            <>
              <label className="block text-xs font-medium">Sub-parts (a..z)</label>
              <div className="space-y-2">
                {subparts.map((sp, i) => (
                  <div key={sp.label} className="p-2 rounded space-y-1" style={{ background: 'var(--bg-app)', border: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="text-xs shrink-0 font-semibold"
                        style={{ color: sp.label === report.subpartLabel ? 'var(--accent)' : 'var(--text-secondary)' }}
                      >
                        {sp.label}) {sp.label === report.subpartLabel && '← flagged'}
                      </span>
                    </div>
                    <textarea
                      value={sp.text}
                      onChange={(e) => setSubpart(i, 'text', e.target.value)}
                      rows={2}
                      className="px-2 py-1 rounded text-xs w-full"
                      style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                    />
                    <input
                      type="text"
                      value={sp.modelAnswer}
                      onChange={(e) => setSubpart(i, 'modelAnswer', e.target.value)}
                      placeholder="Study-pointer / model answer (optional)…"
                      className="px-2 py-1 rounded text-xs w-full"
                      style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          <label className="block text-xs font-medium">Corrected explanation</label>
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            rows={2}
            className="px-2 py-1 rounded text-xs w-full"
            style={{ background: 'var(--bg-app)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          />
          <label className="block text-xs font-medium">Public note (shown on the question)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="px-2 py-1 rounded text-xs w-full"
            style={{ background: 'var(--bg-app)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          />
          <label className="block text-xs font-medium">Note to reporter</label>
          <input
            type="text"
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            className="px-2 py-1 rounded text-xs w-full"
            style={{ background: 'var(--bg-app)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          />
          <button
            onClick={applyCorrection}
            disabled={saving}
            className="px-3 py-1 rounded text-xs font-medium"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            {saving ? 'Saving…' : 'Apply correction & accept'}
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================
// History — chronological audit log (correction / report-status /
// comment moderation), the "who changed what, when" view.
// ============================================================

function HistoryTab({ bankId, questionsById }: { bankId: string; questionsById: Map<string, BankQuestion> }) {
  const [action, setAction] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [offset, setOffset] = useState(0);
  const [entries, setEntries] = useState<AuditLogEntry[] | null>(null);

  useEffect(() => {
    setEntries(null);
    api.adminListAuditLog({ bankId, action: action || undefined, fromDate: fromDate || undefined, toDate: toDate || undefined, limit: PAGE_SIZE, offset })
      .then((r) => setEntries(r.entries));
  }, [bankId, action, fromDate, toDate, offset]);
  useEffect(() => setOffset(0), [bankId, action, fromDate, toDate]);

  return (
    <div className="space-y-3">
      <FilterBar>
        <select value={action} onChange={(e) => setAction(e.target.value)} className="px-2.5 py-1.5 rounded-md text-sm" style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
          <option value="">All actions</option>
          <option value="correction">Correction</option>
          <option value="report_status">Report status change</option>
          <option value="comment_pinned">Comment pinned</option>
          <option value="comment_deleted">Comment deleted</option>
        </select>
        <DateRangeInputs from={fromDate} to={toDate} onFromChange={setFromDate} onToChange={setToDate} />
      </FilterBar>

      {entries === null && <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading…</p>}
      {entries?.length === 0 && <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No activity matches these filters.</p>}

      {entries && entries.length > 0 && (
        <>
          <div className="sto-card"><PaginationControls offset={offset} limit={PAGE_SIZE} count={entries.length} onOffsetChange={setOffset} /></div>
          <div className="space-y-2">
            {entries.map((e) => (
              <div key={e.id} className="sto-card text-xs space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="sto-pill">{e.action.replace(/_/g, ' ')}</span>
                  <span className="font-medium">{questionsById.get(e.questionId)?.question?.slice(0, 80) ?? e.questionId}</span>
                  {e.subpartLabel && <span className="sto-pill">sub-part {e.subpartLabel}</span>}
                  <span className="ml-auto" style={{ color: 'var(--text-secondary)' }}>
                    {e.actorUsername} · {new Date(e.createdAt).toLocaleString()}
                  </span>
                </div>
                {e.note && <p style={{ color: 'var(--text-secondary)' }}>Note: {e.note}</p>}
                {(e.before || e.after) && (
                  <details>
                    <summary className="cursor-pointer" style={{ color: 'var(--accent)' }}>Before / after</summary>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <pre className="p-1.5 rounded overflow-x-auto" style={{ background: 'var(--bg-app)' }}>{JSON.stringify(e.before, null, 2)}</pre>
                      <pre className="p-1.5 rounded overflow-x-auto" style={{ background: 'var(--bg-app)' }}>{JSON.stringify(e.after, null, 2)}</pre>
                    </div>
                  </details>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================
// Comments — browse/moderate every comment on this bank.
// ============================================================

function CommentsTab({ bankId }: { bankId: string }) {
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [pinned, setPinned] = useState<boolean | undefined>(undefined);
  const [offset, setOffset] = useState(0);
  const [comments, setComments] = useState<AdminComment[] | null>(null);

  const load = () => {
    setComments(null);
    api.adminListComments({ bankId, search: search || undefined, fromDate: fromDate || undefined, toDate: toDate || undefined, pinned, limit: PAGE_SIZE, offset })
      .then((r) => setComments(r.comments));
  };
  useEffect(load, [bankId, search, fromDate, toDate, pinned, offset]);
  useEffect(() => setOffset(0), [bankId, search, fromDate, toDate, pinned]);

  const togglePin = async (id: number) => { await api.pinComment(id); load(); };
  const remove = async (id: number) => { await api.deleteComment(id); load(); };

  return (
    <div className="space-y-3">
      <FilterBar>
        <SearchInput value={search} onChange={setSearch} placeholder="Search comment text…" />
        <DateRangeInputs from={fromDate} to={toDate} onFromChange={setFromDate} onToChange={setToDate} />
        <TriStateToggle value={pinned} onChange={setPinned} label="Pinned" />
      </FilterBar>

      {comments === null && <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading…</p>}
      {comments?.length === 0 && <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No comments match these filters.</p>}

      {comments && comments.length > 0 && (
        <>
          <div className="sto-card"><PaginationControls offset={offset} limit={PAGE_SIZE} count={comments.length} onOffsetChange={setOffset} /></div>
          <div className="space-y-2">
            {comments.map((c) => (
              <div key={c.id} className="sto-card text-xs space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {c.isPinned && <span title="Pinned">📌</span>}
                  <span className="font-medium">{c.displayName ?? c.username}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>on {c.questionId} · {new Date(c.createdAt).toLocaleString()}</span>
                </div>
                <p>{c.body}</p>
                <div className="flex gap-2" style={{ color: 'var(--text-secondary)' }}>
                  <button onClick={() => togglePin(c.id)}>{c.isPinned ? 'Unpin' : 'Pin'}</button>
                  <button onClick={() => remove(c.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================
// Users — accounts + per-user activity counts.
// ============================================================

function UsersTab() {
  const [users, setUsers] = useState<(Awaited<ReturnType<typeof api.adminListUsers>>['users']) | null>(null);
  const [stats, setStats] = useState<Awaited<ReturnType<typeof api.adminStats>> | null>(null);

  useEffect(() => {
    api.adminListUsers().then((r) => setUsers(r.users));
    api.adminStats().then(setStats);
  }, []);

  const statsByUser = new Map((stats?.perUser ?? []).map((u) => [u.id, u]));

  return (
    <div className="space-y-2">
      {users === null && <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading…</p>}
      {users?.map((u) => {
        const s = statsByUser.get(u.id);
        return (
          <div key={u.id} className="sto-card flex items-center gap-3 text-sm flex-wrap">
            <span className="font-medium">{u.displayName ?? u.username}</span>
            <span className="sto-pill">{u.role}</span>
            <span style={{ color: 'var(--text-secondary)' }}>joined {new Date(u.createdAt).toLocaleDateString()}</span>
            {s && (
              <span className="ml-auto text-xs" style={{ color: 'var(--text-secondary)' }}>
                {s.reportsFiled} reports · {s.commentsPosted} comments · {s.correctionsAuthored} corrections
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// Dashboard — headline counts + a live recent-activity feed.
// ============================================================

function DashboardTab() {
  const [stats, setStats] = useState<Awaited<ReturnType<typeof api.adminStats>> | null>(null);

  useEffect(() => {
    api.adminStats().then(setStats);
  }, []);

  if (!stats) return <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading…</p>;

  const pendingTotal = stats.byBankStatus.filter((b) => b.status === 'pending').reduce((n, b) => n + b.count, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <div className="sto-stat"><b>{pendingTotal}</b><span>Pending reports</span></div>
        <div className="sto-stat"><b>{stats.totalCorrections}</b><span>Corrections made</span></div>
        <div className="sto-stat"><b>{stats.totalComments}</b><span>Comments posted</span></div>
      </div>

      <div>
        <h3 className="font-semibold mb-2 text-sm">Reports by issue type</h3>
        <div className="flex flex-wrap gap-2">
          {stats.byIssueType.map((i) => (
            <span key={i.issueType} className="sto-pill">{i.issueType.replace(/_/g, ' ')}: {i.count}</span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2 text-sm">Recent activity</h3>
        <div className="space-y-1.5">
          {stats.recentActivity.map((a) => (
            <div key={a.id} className="text-xs p-2 rounded" style={{ background: 'var(--bg-panel-elev)' }}>
              <span className="font-medium">{a.actorUsername}</span> {a.action.replace(/_/g, ' ')} on{' '}
              <span style={{ color: 'var(--text-secondary)' }}>{a.bankId}/{a.questionId}{a.subpartLabel ? `#${a.subpartLabel}` : ''}</span>
              <span className="ml-2" style={{ color: 'var(--text-secondary)' }}>{new Date(a.createdAt).toLocaleString()}</span>
            </div>
          ))}
          {stats.recentActivity.length === 0 && <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>No activity yet.</p>}
        </div>
      </div>
    </div>
  );
}
