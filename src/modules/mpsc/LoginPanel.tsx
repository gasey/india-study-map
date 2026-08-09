import { useState } from 'react';
import { useAuthStore } from '@/lib/authStore';

/** Compact login control for the header — click to expand a small form. */
export function LoginPanel() {
  const { user, login, logout, loginError, loggingIn } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  if (user) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span style={{ color: 'var(--text-secondary)' }}>
          {user.displayName ?? user.username}
          {user.role !== 'learner' && <span className="ml-1 sto-pill sto-priority-high">{user.role}</span>}
        </span>
        <button
          onClick={logout}
          className="px-2 py-1 rounded text-xs"
          style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
        >
          Log out
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="px-2.5 py-1 rounded-md text-sm"
        style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
      >
        Log in
      </button>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const ok = await login(username, password);
        if (ok) setOpen(false);
      }}
      className="flex items-center gap-1.5"
    >
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        autoFocus
        className="px-2 py-1 rounded text-sm w-24"
        style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="px-2 py-1 rounded text-sm w-24"
        style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
      />
      <button
        type="submit"
        disabled={loggingIn}
        className="px-2 py-1 rounded text-sm font-medium"
        style={{ background: 'var(--accent)', color: '#fff' }}
      >
        {loggingIn ? '…' : 'Go'}
      </button>
      <button type="button" onClick={() => setOpen(false)} className="text-xs" style={{ color: 'var(--text-secondary)' }}>
        cancel
      </button>
      {loginError && <span className="text-xs" style={{ color: '#a33232' }}>{loginError}</span>}
    </form>
  );
}
