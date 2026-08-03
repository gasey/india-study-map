import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/lib/authStore';

const ADMIN_LINKS = [
  { to: '/state-tax-officer?tab=admin', label: 'State Tax Officer admin' },
  { to: '/mpsc?tab=admin', label: 'MPSC Old Questions admin' },
];

/** Global admin shortcut — only rendered for logged-in admins. Each bank's
 *  review console still lives as a tab inside its own page (not a separate
 *  route), so this just deep-links to that tab via ?tab=admin. */
export function AdminNavMenu({ placement }: { placement: 'rail' | 'bar' | 'bottom' }) {
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  if (user?.role !== 'admin') return null;

  const trigger =
    placement === 'bar' ? (
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-[13px] px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
        style={{ color: 'var(--text-secondary)' }}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        🛡️ Admin
        <span style={{ fontSize: 10 }}>▾</span>
      </button>
    ) : placement === 'bottom' ? (
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5"
        style={{ color: 'var(--text-secondary)' }}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span style={{ fontSize: 18, lineHeight: 1 }}>🛡️</span>
        <span className="text-[10px] font-medium">Admin</span>
      </button>
    ) : (
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-14 py-2 rounded-lg flex flex-col items-center gap-1 transition-colors"
        style={{ color: 'var(--text-secondary)' }}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span style={{ fontSize: 18, lineHeight: 1 }}>🛡️</span>
        <span className="text-[9px] tracking-wide">Admin</span>
      </button>
    );

  const popoverClass =
    placement === 'rail'
      ? 'absolute bottom-0 left-full ml-2 w-64'
      : placement === 'bottom'
        ? 'fixed inset-x-3 bottom-[68px]'
        : 'absolute left-0 mt-1.5 w-64';

  return (
    <div ref={ref} className={placement === 'bottom' ? 'flex-1 relative' : 'relative'}>
      {trigger}
      {open && (
        <div
          role="menu"
          className={`${popoverClass} rounded-lg shadow-lg z-[1200] overflow-hidden`}
          style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}
        >
          {ADMIN_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              role="menuitem"
              className="block px-3 py-2.5 text-sm hover:bg-[var(--bg-panel-elev)] transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
