import { useLocation, Link } from 'react-router-dom';
import { useApp } from '@/lib/store';
import { IC, IconSvg } from './icons';
import { MoreFlyout } from './MoreFlyout';
import { AdminNavMenu } from './AdminNavMenu';

function RailLink({ to, icon, label, active }: { to: string; icon: string; label: string; active: boolean }) {
  return (
    <Link
      to={to}
      className="w-14 py-2 rounded-lg flex flex-col items-center gap-1 transition-colors"
      style={{
        background: active ? 'var(--accent-soft)' : 'transparent',
        color: active ? 'var(--accent)' : 'var(--text-secondary)',
      }}
    >
      <IconSvg d={icon} />
      <span className="text-[9px] tracking-wide">{label}</span>
    </Link>
  );
}

const RAIL_ITEMS = [
  { to: '/', icon: IC.home, label: 'Home' },
  { to: '/question-bank', icon: IC.qbank, label: 'Q. Bank' },
  { to: '/tests', icon: IC.tests, label: 'Tests' },
  { to: '/papers', icon: IC.papers, label: 'Papers' },
  { to: '/map', icon: IC.map, label: 'Study Map' },
  { to: '/timeline', icon: IC.chronicle, label: 'Chronicle' },
  { to: '/recall', icon: IC.recall, label: 'Recall' },
  { to: '/library', icon: IC.library, label: 'Library' },
] as const;

export function Rail() {
  const loc = useLocation();
  const { theme, toggleTheme } = useApp();

  return (
    <aside
      className="hidden lg:flex w-[76px] shrink-0 h-full flex-col items-center py-4 gap-1.5 safe-top safe-bottom"
      style={{ background: 'var(--bg-rail)', borderRight: '1px solid var(--border)' }}
    >
      <div
        className="w-[30px] h-[30px] rounded-lg flex items-center justify-center mb-3 shrink-0"
        style={{ border: '1px solid var(--accent)' }}
      >
        <div className="w-3 h-3 rounded-[2px] rotate-45" style={{ background: 'var(--accent)' }} />
      </div>

      {RAIL_ITEMS.map((item) => (
        <RailLink
          key={item.to}
          to={item.to}
          icon={item.icon}
          label={item.label}
          active={loc.pathname === item.to || (item.to !== '/' && loc.pathname.startsWith(`${item.to}/`))}
        />
      ))}
      <MoreFlyout />

      <div className="flex-1" />

      <AdminNavMenu placement="rail" />

      <Link
        to="/account"
        className="w-14 py-2 rounded-lg flex flex-col items-center gap-1 transition-colors"
        style={{
          background: loc.pathname === '/account' ? 'var(--accent-soft)' : 'transparent',
          color: loc.pathname === '/account' ? 'var(--accent)' : 'var(--text-secondary)',
        }}
      >
        <IconSvg d={IC.avatar} />
        <span className="text-[9px] tracking-wide">Account</span>
      </Link>

      <button
        onClick={toggleTheme}
        className="w-14 py-2 rounded-lg flex flex-col items-center gap-1 transition-colors"
        style={{ color: 'var(--text-secondary)' }}
        title="Toggle theme"
      >
        <IconSvg d={theme === 'light' ? IC.moon : IC.sun} />
        <span className="text-[9px]">{theme === 'light' ? 'Dark' : 'Light'}</span>
      </button>
    </aside>
  );
}
