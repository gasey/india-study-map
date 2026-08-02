import { useEffect, useMemo, useState } from 'react';
import * as api from '@/lib/mpscApi';
import type { QuestionReport } from '@/lib/mpscApi';
import type { BankQuestion } from '@/data/banks/types';

/** Admin bulk review dashboard for question reports (complaints). */
export function AdminPanel({
  bankId, questionsById, onCorrectionApplied,
}: {
  bankId: string; questionsById: Map<string, BankQuestion>; onCorrectionApplied: () => void;
}) {
  const [statusFilter, setStatusFilter] = useState<'pending' | 'accepted' | 'rejected' | ''>('pending');
  const [reports, setReports] = useState<QuestionReport[] | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [bulkNote, setBulkNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const load = () => {
    setReports(null);
    setSelected(new Set());
    api.adminListReports(statusFilter || undefined, bankId).then((r) => setReports(r.reports));
  };

  useEffect(load, [statusFilter, bankId]);

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
    <div className="max-w-4xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Admin: review reports</h2>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="px-2.5 py-1.5 rounded-md text-sm"
          style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
        >
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
          <option value="">All</option>
        </select>
      </div>

      {reports === null && <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading…</p>}
      {reports?.length === 0 && <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No {statusFilter || ''} reports.</p>}

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
  const [answerIndex, setAnswerIndex] = useState<string>(String(report.suggestedAnswerIndex ?? ''));
  const [explanation, setExplanation] = useState(question?.explanation ?? '');
  const [note, setNote] = useState('');
  const [adminNote, setAdminNote] = useState(report.adminNote ?? '');
  const [stem, setStem] = useState(question?.question ?? '');
  const [options, setOptions] = useState<string[]>(question?.options ?? ['', '', '', '']);
  const [saving, setSaving] = useState(false);

  const statusColor = report.status === 'accepted' ? '#2e7d4f' : report.status === 'rejected' ? '#a33232' : '#9a6b12';

  const setOption = (i: number, value: string) => setOptions((prev) => prev.map((o, j) => (j === i ? value : o)));
  const stemChanged = stem !== (question?.question ?? '');
  const optionsChanged = question ? options.some((o, i) => o !== question.options[i]) : false;

  const applyCorrection = async () => {
    setSaving(true);
    try {
      await api.adminUpsertCorrection({
        bankId: report.bankId,
        questionId: report.questionId,
        correctedAnswerIndex: answerIndex === '' ? null : Number(answerIndex),
        correctedExplanation: explanation || null,
        correctedNote: note || null,
        correctedStem: stemChanged ? stem : null,
        correctedOptions: optionsChanged ? options : null,
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
            <span style={{ color: 'var(--text-secondary)' }}>by {report.username ?? '?'} · {new Date(report.createdAt).toLocaleDateString()}</span>
          </div>
          <p className="text-sm font-medium">{question?.question ?? `(question ${report.questionId} not loaded in this bank view)`}</p>
          {report.message && <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>"{report.message}"</p>}
          {report.suggestedAnswerIndex !== null && question && (
            <p className="text-xs mt-1" style={{ color: 'var(--accent)' }}>
              Suggested answer: {String.fromCharCode(97 + report.suggestedAnswerIndex)}) {question.options[report.suggestedAnswerIndex]}
            </p>
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
            <option value="">— keep unchanged ({String.fromCharCode(97 + question.answerIndex)}) —</option>
            {options.map((o, i) => <option key={i} value={i}>{String.fromCharCode(97 + i)}) {o}</option>)}
          </select>
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
