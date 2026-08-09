import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/authStore';

// ============================================
// ACCOUNT — replaces the /account PlannedPage stub. Login + real Sign up
// (every new account lands as 'learner', roles are granted afterward, never
// self-selected — see main.py's signup()). No self-service password reset
// or guest-progress-upgrade here: this app has no email field on `users`
// and no server-side progress sync for ANY account today (chapter/bank
// progress, arena, chronicle XP all live in localStorage only, logged-in or
// not) — both would need real new infrastructure decisions (add email +
// pick a mail provider; add a progress-sync system) that aren't this
// page's call to make silently. See RecallLandingPage.tsx for the same
// "don't build on data that doesn't exist" reasoning applied to Recall.
// ============================================

const inputCls = 'w-full px-3 py-2 rounded-md text-sm';
const inputStyle = { background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' } as const;

export function AccountPage() {
  const navigate = useNavigate();
  const { user, login, signup, logout, loginError, loggingIn, signupError, signingUp } = useAuthStore();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  if (user) {
    return (
      <div className="h-full overflow-y-auto scroll-panel">
        <div className="max-w-[420px] mx-auto px-8 py-9 flex flex-col gap-4">
          <h1 className="text-2xl font-medium tracking-tight" style={{ color: 'var(--text-primary)' }}>Account</h1>
          <div className="rounded-lg p-5 flex flex-col gap-3" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
            <div>
              <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{user.displayName ?? user.username}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                @{user.username} · <span className="capitalize">{user.role}</span>
              </div>
            </div>
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="self-start px-3 py-1.5 rounded-md text-sm"
              style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            >
              Log out
            </button>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Lost your password? This is a small invite-only tool with no email on file — ask an admin to reset it for you.
          </p>
        </div>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = mode === 'login' ? await login(username, password) : await signup(username, password, displayName);
    if (ok) navigate('/');
  };

  return (
    <div className="h-full overflow-y-auto scroll-panel">
      <div className="max-w-[420px] mx-auto px-8 py-9 flex flex-col gap-4">
        <h1 className="text-2xl font-medium tracking-tight" style={{ color: 'var(--text-primary)' }}>Account</h1>

        <div className="flex gap-4 text-sm" style={{ borderBottom: '1px solid var(--border)' }}>
          {(['login', 'signup'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="pb-2 font-medium"
              style={{
                color: mode === m ? 'var(--accent)' : 'var(--text-secondary)',
                borderBottom: mode === m ? '2px solid var(--accent)' : '2px solid transparent',
              }}
            >
              {m === 'login' ? 'Log in' : 'Sign up'}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
            Username
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} autoFocus className={inputCls} style={inputStyle} />
          </label>
          {mode === 'signup' && (
            <label className="flex flex-col gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
              Display name <span style={{ color: 'var(--text-muted)' }}>(optional)</span>
              <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className={inputCls} style={inputStyle} />
            </label>
          )}
          <label className="flex flex-col gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
            Password {mode === 'signup' && <span style={{ color: 'var(--text-muted)' }}>(at least 8 characters)</span>}
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} style={inputStyle} />
          </label>

          <button
            type="submit"
            disabled={mode === 'login' ? loggingIn : signingUp}
            className="px-3 py-2 rounded-md text-sm font-medium disabled:opacity-60"
            style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}
          >
            {mode === 'login' ? (loggingIn ? 'Logging in…' : 'Log in') : (signingUp ? 'Creating account…' : 'Create account')}
          </button>

          {mode === 'login' && loginError && <div className="text-xs" style={{ color: 'var(--bad)' }}>{loginError}</div>}
          {mode === 'signup' && signupError && <div className="text-xs" style={{ color: 'var(--bad)' }}>{signupError}</div>}

          {mode === 'signup' && (
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              New accounts start as a learner. Additional access is granted by an admin, not chosen here.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default AccountPage;
