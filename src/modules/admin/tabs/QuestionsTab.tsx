import { useEffect, useMemo, useState } from 'react';
import * as api from '@/lib/mpscApi';
import type { AuditLogEntry, Correction } from '@/lib/mpscApi';
import { banks } from '@/data/banks';
import { SearchInput } from '@/modules/mpsc/FilterBar';
import { AdminTable, type AdminCell } from '@/modules/admin/AdminTable';
import { QuestionEditor } from '@/modules/admin/QuestionEditor';

// ============================================
// QuestionsTab — browse every question in a bank and open the editor
// directly, without needing a learner to have flagged it first.
//
// ReportsTab is "questions someone complained about"; this is "every
// question, so an admin can fix a known problem proactively" — the gap
// QuestionEditor.tsx's own header comment calls out as the intended
// next consumer ("a bank-agnostic Reports tab — and, later, a Questions
// browse tab — can both open it"). QuestionEditor and adminUpsertCorrection
// need no changes: `reportIds` is already optional, so saving here writes
// a correction with no report attached, same as any other.
//
// "Only ⚠ contradictions" surfaces every question carrying a `sourceNote`
// — a case where the SOURCE PUBLICATION disagrees with itself (as opposed
// to `disputeNote`, where we think a published exam key is wrong). Those
// are exactly the rows worth an admin's attention first.
// ============================================

export function QuestionsTab() {
  const [bankId, setBankId] = useState(banks[0]?.id ?? '');
  const bank = banks.find((b) => b.id === bankId) ?? banks[0];

  const [search, setSearch] = useState('');
  const [onlyContradictions, setOnlyContradictions] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [corrections, setCorrections] = useState<Record<string, Correction>>({});
  useEffect(() => {
    setCorrections({});
    setSelectedId(null);
    api.getCorrections(bankId).then(setCorrections).catch(() => {});
  }, [bankId]);

  const [history, setHistory] = useState<AuditLogEntry[] | null>(null);
  useEffect(() => {
    if (!selectedId) {
      setHistory(null);
      return;
    }
    setHistory(null);
    api.adminListAuditLog({ bankId, questionId: selectedId }).then((r) => setHistory(r.entries)).catch(() => setHistory([]));
  }, [bankId, selectedId]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return bank.questions.filter((q) => {
      if (onlyContradictions && !q.sourceNote) return false;
      if (s && !q.question.toLowerCase().includes(s) && !q.id.toLowerCase().includes(s)) return false;
      return true;
    });
  }, [bank, search, onlyContradictions]);

  const contradictionCount = useMemo(() => bank.questions.filter((q) => q.sourceNote).length, [bank]);

  const rows: AdminCell[][] = filtered.map((q) => {
    const corrected = !!corrections[q.id];
    const flagParts: string[] = [];
    if (q.sourceNote) flagParts.push('⚠ contradiction');
    if (corrected) flagParts.push('✓ corrected');
    return [
      { kind: 'text', text: q.question, sub: q.id, mono: false },
      { kind: 'text', text: q.topicLabel, sub: q.subject },
      flagParts.length
        ? { kind: 'pill', text: flagParts.join(' · '), color: q.sourceNote ? '#c8962a' : '#2e7d5b', bg: q.sourceNote ? 'rgba(200,150,40,0.12)' : 'rgba(46,125,91,0.10)', bd: q.sourceNote ? '#c8962a' : '#2e7d5b' }
        : { kind: 'text', text: '—' },
    ];
  });

  const selectedQuestion = selectedId ? bank.questions.find((q) => q.id === selectedId) : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-start">
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          <AdminTable
            heading="Questions"
            blurb={`Browse every question in a bank and edit any of them directly — not only ones already flagged. ${contradictionCount} question${contradictionCount === 1 ? '' : 's'} in this bank carry a known source contradiction.`}
            filters={
              <>
                <select
                  value={bankId}
                  onChange={(e) => setBankId(e.target.value)}
                  className="px-2.5 py-1.5 rounded-md text-sm"
                  style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                >
                  {banks.map((b) => <option key={b.id} value={b.id}>{b.title} ({b.questions.length})</option>)}
                </select>
                <SearchInput value={search} onChange={setSearch} placeholder="Search question text / id…" />
                <label className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <input type="checkbox" checked={onlyContradictions} onChange={(e) => setOnlyContradictions(e.target.checked)} />
                  Only ⚠ contradictions
                </label>
              </>
            }
            columns={['Question', 'Topic', 'Flags']}
            grid="1fr 200px 160px"
            rows={rows}
            onRowClick={(i) => setSelectedId(filtered[i].id)}
            selectedRow={selectedId ? filtered.findIndex((q) => q.id === selectedId) : null}
            note={onlyContradictions && contradictionCount === 0 ? 'No known contradictions in this bank.' : undefined}
          />
        </div>

        {selectedQuestion && (
          <QuestionEditor
            bankId={bankId}
            questionId={selectedQuestion.id}
            onSaved={() => {
              api.getCorrections(bankId).then(setCorrections).catch(() => {});
              api.adminListAuditLog({ bankId, questionId: selectedQuestion.id }).then((r) => setHistory(r.entries)).catch(() => {});
            }}
            onDiscard={() => setSelectedId(null)}
          />
        )}
      </div>

      {selectedQuestion?.sourceNote && (
        <div className="rounded-lg p-3 text-xs leading-relaxed" style={{ background: 'rgba(200,150,40,0.10)', border: '1px solid #c8962a', color: 'var(--text-primary)' }}>
          <strong>⚠ Known source contradiction:</strong> {selectedQuestion.sourceNote}
        </div>
      )}

      {selectedId && (
        <div className="rounded-lg p-3" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
          <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            Edit history for {selectedId}
          </div>
          {history === null && <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Loading…</p>}
          {history?.length === 0 && <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>No edits yet — this question is showing its original, unedited data.</p>}
          {history && history.length > 0 && (
            <div className="flex flex-col gap-2">
              {history.map((e) => (
                <div key={e.id} className="p-2 rounded text-xs" style={{ background: 'var(--bg-app)' }}>
                  <div className="flex items-center gap-2 flex-wrap" style={{ color: 'var(--text-secondary)' }}>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{e.actorUsername}</span>
                    <span>{e.action.replace(/_/g, ' ')}</span>
                    {e.subpartLabel && <span>sub-part {e.subpartLabel}</span>}
                    <span>{new Date(e.createdAt).toLocaleString()}</span>
                  </div>
                  {(e.before || e.after) && (
                    <div className="grid grid-cols-2 gap-2 mt-1.5">
                      <pre className="p-1.5 rounded overflow-x-auto text-[10px]" style={{ background: 'var(--bg-panel-elev)', color: 'var(--text-secondary)' }}>{JSON.stringify(e.before, null, 2)}</pre>
                      <pre className="p-1.5 rounded overflow-x-auto text-[10px]" style={{ background: 'var(--bg-panel-elev)', color: 'var(--text-secondary)' }}>{JSON.stringify(e.after, null, 2)}</pre>
                    </div>
                  )}
                  {e.note && <div className="mt-1" style={{ color: 'var(--text-secondary)' }}>{e.note}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
