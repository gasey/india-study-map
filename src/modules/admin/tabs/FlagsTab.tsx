import { useEffect, useState } from 'react';
import * as api from '@/lib/mpscApi';
import type { FeatureFlag, FlagAudience } from '@/lib/mpscApi';
import { AdminTable, type AdminCell } from '@/modules/admin/AdminTable';

const AUDIENCES: FlagAudience[] = ['everyone', 'logged_in', 'moderator', 'reviewer', 'editor', 'admin'];

export function FlagsTab() {
  const [flags, setFlags] = useState<FeatureFlag[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ key: '', describes: '', audience: 'everyone' as FlagAudience });

  const load = () => {
    api.getAdminFlags().then((r) => setFlags(r.flags)).catch(() => setFlags([]));
  };
  useEffect(load, []);

  const toggle = async (f: FeatureFlag) => {
    await api.updateFlag(f.key, { is_on: !f.isOn, rolled_out: !f.isOn ? new Date().toISOString().slice(0, 10) : f.rolledOut });
    load();
  };
  const remove = async (f: FeatureFlag) => {
    await api.deleteFlag(f.key);
    load();
  };

  const create = async () => {
    if (!form.key.trim()) {
      setError('Key is required, e.g. section.python');
      return;
    }
    setCreating(true);
    setError(null);
    try {
      await api.createFlag({ key: form.key.trim(), describes: form.describes.trim(), audience: form.audience, is_on: false });
      setForm({ key: '', describes: '', audience: 'everyone' });
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create flag');
    } finally {
      setCreating(false);
    }
  };

  const rows: AdminCell[][] = (flags ?? []).map((f) => [
    { kind: 'text', text: f.key, sub: f.describes, mono: true },
    { kind: 'text', text: f.audience.replace('_', ' ') },
    { kind: 'text', text: f.rolledOut ?? '—', mono: true },
    f.isOn
      ? { kind: 'pill', text: 'On', color: 'var(--ok)', bg: 'color-mix(in srgb, var(--ok) 14%, transparent)', bd: 'var(--ok)' }
      : { kind: 'pill', text: 'Off', color: 'var(--text-secondary)', bg: 'var(--bg-panel-elev)', bd: 'var(--border)' },
  ]);

  const inputCls = 'px-2.5 py-1.5 rounded-md text-sm';
  const inputStyle = { background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' } as const;

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg p-4 flex flex-col gap-2.5" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
        <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>New flag</div>
        <div className="flex flex-wrap gap-2">
          <input type="text" placeholder="key, e.g. section.python" value={form.key} onChange={(e) => setForm((f) => ({ ...f, key: e.target.value }))} className={`${inputCls} font-mono`} style={inputStyle} />
          <input type="text" placeholder="What it gates" value={form.describes} onChange={(e) => setForm((f) => ({ ...f, describes: e.target.value }))} className={`${inputCls} flex-1 min-w-[160px]`} style={inputStyle} />
          <select value={form.audience} onChange={(e) => setForm((f) => ({ ...f, audience: e.target.value as FlagAudience }))} className={inputCls} style={inputStyle}>
            {AUDIENCES.map((a) => <option key={a} value={a}>{a.replace('_', ' ')}</option>)}
          </select>
          <button onClick={create} disabled={creating} className="text-sm px-3 py-1.5 rounded-md disabled:opacity-50" style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}>
            {creating ? 'Adding…' : 'Add'}
          </button>
        </div>
        {error && <div className="text-xs" style={{ color: 'var(--bad)' }}>{error}</div>}
      </div>

      <AdminTable
        heading="Flags"
        blurb="Per-role rollout flags. Only 'everyone' + on flags are visible outside the admin console."
        loading={flags === null}
        columns={['Flag', 'Audience', 'Rolled out', 'Status']}
        grid="1fr 130px 110px 90px"
        rows={rows}
        rowActions={(i) => {
          const f = flags![i];
          return (
            <>
              <button onClick={() => toggle(f)} className="text-xs" style={{ color: 'var(--accent)' }}>{f.isOn ? 'Turn off' : 'Turn on'}</button>
              <button onClick={() => remove(f)} className="text-xs" style={{ color: 'var(--bad)' }}>Delete</button>
            </>
          );
        }}
      />
    </div>
  );
}
