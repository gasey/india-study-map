import { Link, useLocation } from 'react-router-dom';
import { useApp } from '@/lib/store';
import { SHELL_STYLES } from '@/lib/shellStyles';
import { Rail } from './Rail';
import { CommandBar } from './CommandBar';
import { ModuleGroupMenu } from './ModuleGroupMenu';
import { AdminNavMenu } from './AdminNavMenu';
import { IC, IconSvg } from './icons';

/** Mobile-only bottom nav — additive to each page's own local ModuleSwitcher
 *  pill, not a replacement (touching ~10 pages' mobile headers to remove it
 *  would be a much larger, riskier diff for a small nav-redundancy tradeoff).
 *  Hidden on /map: that screen already owns the bottom of the viewport with
 *  its own fixed, swipeable facts/quiz sheet — a second bottom bar there
 *  would visually collide with it, not just duplicate nav affordance. */
function MobileBottomBar() {
  const loc = useLocation();
  return (
    <nav
      className="lg:hidden flex items-stretch h-[60px] shrink-0 safe-bottom"
      style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-panel)' }}
    >
      <Link
        to="/"
        className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5"
        style={{ color: loc.pathname === '/' ? 'var(--accent)' : 'var(--text-secondary)' }}
      >
        <IconSvg d={IC.home} size={18} />
        <span className="text-[10px] font-medium">Home</span>
      </Link>
      <ModuleGroupMenu category="Study" label="Study" placement="bottom" />
      <Link
        to="/question-bank"
        className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5"
        style={{ color: loc.pathname === '/question-bank' ? 'var(--accent)' : 'var(--text-secondary)' }}
      >
        <IconSvg d={IC.qbank} size={18} />
        <span className="text-[10px] font-medium">Q. Bank</span>
      </Link>
      <ModuleGroupMenu category="Practice" label="Practice" placement="bottom" />
      <AdminNavMenu placement="bottom" />
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const shellStyle = useApp((s) => s.shellStyle);
  const cfg = SHELL_STYLES[shellStyle];
  const loc = useLocation();
  const isMap = loc.pathname.startsWith('/map');

  const chrome: 'rail' | 'topbar' | 'none' = isMap
    ? cfg.map.rail
      ? 'rail'
      : cfg.map.topBar
        ? 'topbar'
        : 'none'
    : cfg.home.chrome;

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--bg-app)' }}>
      {chrome === 'topbar' && <CommandBar />}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {chrome === 'rail' && <Rail />}
        <main className="flex-1 min-w-0 overflow-hidden">{children}</main>
      </div>
      {!isMap && <MobileBottomBar />}
    </div>
  );
}
