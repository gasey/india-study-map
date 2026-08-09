import { useEffect, useRef, useState } from 'react';
import * as api from '@/lib/mpscApi';
import type { ImportRun } from '@/lib/mpscApi';
import { AdminTable, type AdminCell } from '@/modules/admin/AdminTable';

// ============================================
// IMPORT — the count check is the feature. IMP-0138 lost 280 questions
// silently because nothing compared parse-count-in to rows-written; every
// run here is dry-run first, apply is separate and explicit, and a count
// mismatch on apply rolls back and fails loudly instead of writing a
// partial result.
//
// Accepts a pre-extracted JSON file — {"papers":[...], "questions":[...]}
// matching the shape the existing offline extraction pipeline produces —
// not raw PDFs. Live PDF OCR/extraction is a separate, credential-and-
// compute decision (which script, which API key, sync vs async worker)
// that needs the user's sign-off before it's wired into a web upload.
// ============================================

const STATUS_PILL: Record<ImportRun['status'], AdminCell> = {
  dry_run: { kind: 'pill', text: 'Dry run', color: 'var(--info)', bg: 'color-mix(in srgb, var(--info) 14%, transparent)', bd: 'var(--info)' },
  applied: { kind: 'pill', text: 'Applied', color: 'var(--ok)', bg: 'color-mix(in srgb, var(--ok) 14%, transparent)', bd: 'var(--ok)' },
  rolled_back: { kind: 'pill', text: 'Rolled back', color: 'var(--text-secondary)', bg: 'var(--bg-panel-elev)', bd: 'var(--border)' },
  failed: { kind: 'pill', text: 'Failed', color: 'var(--bad)', bg: 'color-mix(in srgb, var(--bad) 14%, transparent)', bd: 'var(--bad)' },
};

export function ImportTab() {
  const [runs, setRuns] = useState<ImportRun[] | null>(null);
  const [uploading, setUploading] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => {
    api.getAdminImports().then((r) => setRuns(r.runs)).catch(() => setRuns([]));
  };
  useEffect(load, []);

  const upload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      await api.createImport(file);
      if (fileRef.current) fileRef.current.value = '';
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const apply = async (run: ImportRun) => {
    if (!confirm(`Apply run #${run.id}? This writes ${run.parsedQuestions} questions to the live bank — if the count written doesn't match exactly, it rolls back automatically.`)) return;
    setBusyId(run.id);
    setError(null);
    try {
      await api.applyImport(run.id);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Apply failed — rolled back, nothing was written');
      load();
    } finally {
      setBusyId(null);
    }
  };

  const rollback = async (run: ImportRun) => {
    if (!confirm(`Roll back run #${run.id}? This deletes the ${run.writtenQuestions} questions it wrote.`)) return;
    setBusyId(run.id);
    setError(null);
    try {
      await api.rollbackImport(run.id);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Rollback failed');
    } finally {
      setBusyId(null);
    }
  };

  const rows: AdminCell[][] = (runs ?? []).map((r) => [
    { kind: 'text', text: r.filename, sub: `by ${r.actorUsername} · ${new Date(r.createdAt).toLocaleString()}` },
    { kind: 'text', text: `${r.parsedPapers} papers · ${r.parsedQuestions} questions`, mono: true },
    r.status === 'applied' || r.status === 'failed'
      ? { kind: 'text', text: `${r.writtenQuestions} written`, mono: true, ...(r.error ? { sub: r.error } : {}) }
      : { kind: 'text', text: '—' },
    STATUS_PILL[r.status],
  ]);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg p-4 flex flex-col gap-2.5" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
        <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>New import</div>
        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          Upload a JSON file — <span className="font-mono">{'{ papers: [...], questions: [...] }'}</span>. This only parses and previews; nothing is written until you Apply.
        </div>
        <div className="flex items-center gap-2">
          <input ref={fileRef} type="file" accept="application/json" className="text-xs" style={{ color: 'var(--text-primary)' }} />
          <button onClick={upload} disabled={uploading} className="text-sm px-3 py-1.5 rounded-md disabled:opacity-50" style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}>
            {uploading ? 'Uploading…' : 'Dry-run'}
          </button>
        </div>
        {error && <div className="text-xs" style={{ color: 'var(--bad)' }}>{error}</div>}
      </div>

      <AdminTable
        heading="Import runs"
        blurb="Every run is a dry-run first. A count mismatch on apply rolls back automatically and fails loudly — that comparison is the entire feature."
        loading={runs === null}
        columns={['File', 'Parsed', 'Written', 'Status']}
        grid="1fr 200px 160px 110px"
        rows={rows}
        rowActions={(i) => {
          const r = runs![i];
          return (
            <>
              {r.status === 'dry_run' && (
                <button onClick={() => apply(r)} disabled={busyId === r.id} className="text-xs disabled:opacity-50" style={{ color: 'var(--accent)' }}>Apply</button>
              )}
              {r.status === 'applied' && (
                <button onClick={() => rollback(r)} disabled={busyId === r.id} className="text-xs disabled:opacity-50" style={{ color: 'var(--bad)' }}>Roll back</button>
              )}
            </>
          );
        }}
      />
    </div>
  );
}
