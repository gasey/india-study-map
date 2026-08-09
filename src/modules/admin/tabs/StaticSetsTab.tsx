import { useEffect, useState } from 'react';
import * as api from '@/lib/mpscApi';
import type { StaticSet, StaticSetGroup } from '@/lib/mpscApi';
import { AdminTable, type AdminCell } from '@/modules/admin/AdminTable';

const GROUPS: StaticSetGroup[] = ['exam_guide', 'lab', 'quick_practice'];

export function StaticSetsTab() {
  const [sets, setSets] = useState<StaticSet[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: '', group: 'quick_practice' as StaticSetGroup, route: '', nItems: '', blurb: '' });

  const load = () => {
    api.getAdminStaticSets().then((r) => setSets(r.sets)).catch(() => setSets([]));
  };
  useEffect(load, []);

  const togglePublish = async (s: StaticSet) => {
    await api.updateStaticSet(s.id, { isPublished: !s.isPublished });
    load();
  };
  const remove = async (s: StaticSet) => {
    await api.deleteStaticSet(s.id);
    load();
  };

  const create = async () => {
    if (!form.title.trim() || !form.route.trim()) {
      setError('Title and route are required');
      return;
    }
    setCreating(true);
    setError(null);
    try {
      await api.createStaticSet({
        title: form.title.trim(),
        group: form.group,
        route: form.route.trim(),
        nItems: form.nItems ? Number(form.nItems) : null,
        blurb: form.blurb.trim(),
        isPublished: false,
      });
      setForm({ title: '', group: 'quick_practice', route: '', nItems: '', blurb: '' });
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create static set');
    } finally {
      setCreating(false);
    }
  };

  const rows: AdminCell[][] = (sets ?? []).map((s) => [
    { kind: 'text', text: s.title, sub: s.route, mono: false },
    { kind: 'text', text: s.group.replace('_', ' ') },
    { kind: 'text', text: s.nItems !== null ? `${s.nItems} ${s.unit}` : '—', mono: true },
    s.isPublished
      ? { kind: 'pill', text: 'Published', color: 'var(--ok)', bg: 'color-mix(in srgb, var(--ok) 14%, transparent)', bd: 'var(--ok)' }
      : { kind: 'pill', text: 'Draft', color: 'var(--text-secondary)', bg: 'var(--bg-panel-elev)', bd: 'var(--border)' },
  ]);

  const inputCls = 'px-2.5 py-1.5 rounded-md text-sm';
  const inputStyle = { background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' } as const;

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg p-4 flex flex-col gap-2.5" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
        <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>New static set</div>
        <div className="flex flex-wrap gap-2">
          <input type="text" placeholder="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className={inputCls} style={inputStyle} />
          <select value={form.group} onChange={(e) => setForm((f) => ({ ...f, group: e.target.value as StaticSetGroup }))} className={inputCls} style={inputStyle}>
            {GROUPS.map((g) => <option key={g} value={g}>{g.replace('_', ' ')}</option>)}
          </select>
          <input type="text" placeholder="/embed/route-id" value={form.route} onChange={(e) => setForm((f) => ({ ...f, route: e.target.value }))} className={inputCls} style={inputStyle} />
          <input type="number" placeholder="Item count" value={form.nItems} onChange={(e) => setForm((f) => ({ ...f, nItems: e.target.value }))} className={`${inputCls} w-28`} style={inputStyle} />
          <input type="text" placeholder="Blurb" value={form.blurb} onChange={(e) => setForm((f) => ({ ...f, blurb: e.target.value }))} className={`${inputCls} flex-1 min-w-[160px]`} style={inputStyle} />
          <button onClick={create} disabled={creating} className="text-sm px-3 py-1.5 rounded-md disabled:opacity-50" style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}>
            {creating ? 'Adding…' : 'Add'}
          </button>
        </div>
        {error && <div className="text-xs" style={{ color: 'var(--bad)' }}>{error}</div>}
      </div>

      <AdminTable
        heading="Static sets"
        blurb="Registry for Library's premade sets — the files themselves are untouched."
        loading={sets === null}
        columns={['Title', 'Group', 'Count', 'Status']}
        grid="1fr 140px 100px 100px"
        rows={rows}
        rowActions={(i) => {
          const s = sets![i];
          return (
            <>
              <button onClick={() => togglePublish(s)} className="text-xs" style={{ color: 'var(--accent)' }}>{s.isPublished ? 'Unpublish' : 'Publish'}</button>
              <button onClick={() => remove(s)} className="text-xs" style={{ color: 'var(--bad)' }}>Delete</button>
            </>
          );
        }}
      />
    </div>
  );
}
