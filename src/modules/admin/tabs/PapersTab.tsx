import { useEffect, useState } from 'react';
import * as api from '@/lib/mpscApi';
import type { ExamPaper } from '@/data/banks/types';
import { AdminTable, type AdminCell } from '@/modules/admin/AdminTable';
import { FilterBar, SearchInput, CheckboxGroup } from '@/modules/mpsc/FilterBar';

type AdminPaper = ExamPaper & { questionCount: number };

const LIMIT = 50;

export function PapersTab() {
  const [papers, setPapers] = useState<AdminPaper[] | null>(null);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [missingYearOnly, setMissingYearOnly] = useState(false);
  const [offset, setOffset] = useState(0);
  const [editing, setEditing] = useState<AdminPaper | null>(null);
  const [form, setForm] = useState({ examType: '', examName: '', post: '', paperNumber: '', paperSubject: '', year: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    api.getAdminPapers({ q: search || undefined, missingYear: missingYearOnly || undefined, limit: LIMIT, offset })
      .then((r) => { setPapers(r.papers); setTotal(r.total); })
      .catch(() => { setPapers([]); setTotal(0); });
  };
  useEffect(load, [search, missingYearOnly, offset]);

  const startEdit = (p: AdminPaper) => {
    setEditing(p);
    setForm({
      examType: p.examType, examName: p.examName, post: p.post ?? '',
      paperNumber: p.paperNumber ?? '', paperSubject: p.paperSubject ?? '', year: p.year ? String(p.year) : '',
    });
    setError(null);
  };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    setError(null);
    try {
      await api.updatePaper(editing.id, {
        examType: form.examType.trim(),
        examName: form.examName.trim(),
        post: form.post.trim(),
        paperNumber: form.paperNumber.trim(),
        paperSubject: form.paperSubject.trim(),
        year: form.year ? Number(form.year) : null,
      });
      setEditing(null);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save paper');
    } finally {
      setSaving(false);
    }
  };

  const rows: AdminCell[][] = (papers ?? []).map((p) => [
    { kind: 'text', text: p.examName, sub: p.sourceFile },
    { kind: 'text', text: p.examType },
    { kind: 'text', text: p.post || '—' },
    { kind: 'text', text: p.paperNumber || '—' },
    p.year
      ? { kind: 'text', text: String(p.year), mono: true }
      : { kind: 'pill', text: 'No year', color: 'var(--warn)', bg: 'color-mix(in srgb, var(--warn) 14%, transparent)', bd: 'var(--warn)' },
    { kind: 'text', text: String(p.questionCount), mono: true },
  ]);

  const inputCls = 'px-2.5 py-1.5 rounded-md text-sm';
  const inputStyle = { background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' } as const;

  return (
    <div className="flex flex-col gap-4">
      {editing && (
        <div className="rounded-lg p-4 flex flex-col gap-2.5" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
          <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Editing <span className="font-mono">{editing.id}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <input placeholder="Exam type" value={form.examType} onChange={(e) => setForm((f) => ({ ...f, examType: e.target.value }))} className={inputCls} style={inputStyle} />
            <input placeholder="Exam name" value={form.examName} onChange={(e) => setForm((f) => ({ ...f, examName: e.target.value }))} className={`${inputCls} flex-1 min-w-[160px]`} style={inputStyle} />
            <input placeholder="Post" value={form.post} onChange={(e) => setForm((f) => ({ ...f, post: e.target.value }))} className={inputCls} style={inputStyle} />
            <input placeholder="Paper #" value={form.paperNumber} onChange={(e) => setForm((f) => ({ ...f, paperNumber: e.target.value }))} className={`${inputCls} w-24`} style={inputStyle} />
            <input placeholder="Subject" value={form.paperSubject} onChange={(e) => setForm((f) => ({ ...f, paperSubject: e.target.value }))} className={inputCls} style={inputStyle} />
            <input placeholder="Year" type="number" value={form.year} onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))} className={`${inputCls} w-24`} style={inputStyle} />
            <button onClick={save} disabled={saving} className="text-sm px-3 py-1.5 rounded-md disabled:opacity-50" style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}>
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button onClick={() => setEditing(null)} className="text-sm px-3 py-1.5 rounded-md" style={{ color: 'var(--text-secondary)' }}>
              Cancel
            </button>
          </div>
          {error && <div className="text-xs" style={{ color: 'var(--bad)' }}>{error}</div>}
        </div>
      )}

      <AdminTable
        heading="Papers"
        blurb="Extracted from source PDFs — fix blank or wrong metadata here, papers themselves aren't created or deleted."
        loading={papers === null}
        filters={
          <>
            <SearchInput value={search} onChange={(v) => { setSearch(v); setOffset(0); }} placeholder="Search exam, post, source file…" />
            <CheckboxGroup
              options={[{ value: 'missing', label: 'Missing year' }]}
              selected={missingYearOnly ? ['missing'] : []}
              onToggle={() => { setMissingYearOnly((v) => !v); setOffset(0); }}
            />
          </>
        }
        columns={['Exam', 'Type', 'Post', 'Paper #', 'Year', 'Questions']}
        grid="1fr 120px 100px 90px 90px 90px"
        rows={rows}
        onRowClick={(i) => startEdit(papers![i])}
        note={total === 0 && papers !== null ? 'No papers match these filters.' : undefined}
        pagination={{ offset, limit: LIMIT, count: total, onOffsetChange: setOffset }}
      />
    </div>
  );
}
