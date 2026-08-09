import { useEffect, useState } from 'react';
import * as api from '@/lib/mpscApi';
import type { ApiUser } from '@/lib/mpscApi';
import { hasCap, useAuthStore } from '@/lib/authStore';
import { RoleMatrix } from '@/modules/admin/RoleMatrix';

const ROLES: ApiUser['role'][] = ['learner', 'moderator', 'reviewer', 'editor', 'admin', 'owner'];

export function UsersTab() {
  const { user: actor } = useAuthStore();
  const canAssignRoles = hasCap(actor, 'user.role.assign');
  const canResetPasswords = hasCap(actor, 'user.reset_password');
  const [users, setUsers] = useState<(Awaited<ReturnType<typeof api.adminListUsers>>['users']) | null>(null);
  const [stats, setStats] = useState<Awaited<ReturnType<typeof api.adminStats>> | null>(null);
  const [pending, setPending] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tempPassword, setTempPassword] = useState<{ userId: number; value: string } | null>(null);

  const resetPassword = async (userId: number) => {
    if (!confirm('Reset this user\'s password? They will need the new temp password to log in.')) return;
    setPending(userId);
    setError(null);
    setTempPassword(null);
    try {
      const r = await api.adminResetPassword(userId);
      setTempPassword({ userId, value: r.tempPassword });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not reset password');
    } finally {
      setPending(null);
    }
  };

  const load = () => {
    api.adminListUsers().then((r) => setUsers(r.users));
    api.adminStats().then(setStats);
  };
  useEffect(load, []);

  const statsByUser = new Map((stats?.perUser ?? []).map((u) => [u.id, u]));

  const assignRole = async (userId: number, role: ApiUser['role']) => {
    setPending(userId);
    setError(null);
    try {
      await api.adminAssignRole(userId, role);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not assign role');
    } finally {
      setPending(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Users</h3>
        {error && <p className="text-xs mb-2" style={{ color: 'var(--bad)' }}>{error}</p>}
        {users === null && <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading…</p>}
        <div className="flex flex-col gap-2">
          {users?.map((u) => {
            const s = statsByUser.get(u.id);
            return (
              <div key={u.id} className="rounded-lg p-3 flex items-center gap-3 flex-wrap text-sm" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{u.displayName ?? u.username}</span>
                {canAssignRoles ? (
                  <select
                    value={u.role}
                    disabled={pending === u.id}
                    onChange={(e) => assignRole(u.id, e.target.value as ApiUser['role'])}
                    className="text-xs px-2 py-1 rounded-full capitalize"
                    style={{ border: '1px solid var(--accent)', color: 'var(--accent)', background: 'var(--accent-soft)' }}
                  >
                    {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                ) : (
                  <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>{u.role}</span>
                )}
                <span style={{ color: 'var(--text-secondary)' }}>joined {new Date(u.createdAt).toLocaleDateString()}</span>
                {canResetPasswords && (
                  <button
                    onClick={() => resetPassword(u.id)}
                    disabled={pending === u.id}
                    className="text-xs px-2 py-0.5 rounded-full disabled:opacity-50"
                    style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                  >
                    Reset password
                  </button>
                )}
                {s && (
                  <span className="ml-auto text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {s.reportsFiled} reports · {s.commentsPosted} comments · {s.correctionsAuthored} corrections
                  </span>
                )}
                {tempPassword?.userId === u.id && (
                  <div className="w-full text-xs rounded p-2" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                    New temp password (shown once, not stored): <span className="font-mono font-semibold">{tempPassword.value}</span> — relay it to {u.displayName ?? u.username} directly.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Capabilities by role</h3>
        <RoleMatrix />
      </div>
    </div>
  );
}
