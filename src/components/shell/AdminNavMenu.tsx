import { Link } from 'react-router-dom';
import { hasCap, useAuthStore } from '@/lib/authStore';
import { IC, IconSvg } from './icons';

/** No live "pending queue" count exists anywhere in this app yet — the
 *  badge slot is rendered per spec (15px --bad pill, top-right) but stays
 *  hidden until a real queue-count endpoint exists.
 *  Do not fabricate a count from unrelated local data. */
const PENDING_COUNT = 0;

/** Global admin shortcut — only rendered for logged-in admins. Used to
 *  deep-link into a dropdown of two bank-specific `?tab=admin` pages
 *  before Phase 6a; now a single direct link, since the admin console is
 *  one standalone bank-agnostic route, not a tab duplicated per bank. */
export function AdminNavMenu({ placement }: { placement: 'rail' | 'bottom' }) {
  const { user } = useAuthStore();

  // admin.stats is rank-5 (admin/owner only) — same bar the old
  // role === 'admin' check drew, now derived from the backend's
  // capability list instead of a hardcoded role string.
  if (!hasCap(user, 'admin.stats')) return null;

  if (placement === 'bottom') {
    return (
      <Link to="/admin" className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 relative" style={{ color: 'var(--text-secondary)' }}>
        <IconSvg d={IC.admin} size={18} />
        <span className="text-[10px] font-medium">Admin</span>
        {PENDING_COUNT > 0 && <Badge count={PENDING_COUNT} />}
      </Link>
    );
  }

  return (
    <Link to="/admin" className="w-14 py-2 rounded-lg flex flex-col items-center gap-1 transition-colors relative" style={{ color: 'var(--text-secondary)' }}>
      <IconSvg d={IC.admin} />
      <span className="text-[9px] tracking-wide">Admin</span>
      {PENDING_COUNT > 0 && <Badge count={PENDING_COUNT} />}
    </Link>
  );
}

function Badge({ count }: { count: number }) {
  return (
    <span
      className="absolute top-0 right-1.5 min-w-[15px] h-[15px] px-[3px] rounded-full flex items-center justify-center text-[9px] font-medium"
      style={{ background: 'var(--bad, #a33232)', color: '#fff' }}
    >
      {count}
    </span>
  );
}
