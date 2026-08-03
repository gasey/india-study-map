import { useLocation, Link } from 'react-router-dom';
import { useApp } from '@/lib/store';
import { IC, IconSvg } from './icons';
import { ShellSwitcher } from './ShellSwitcher';
import { ModuleGroupMenu } from './ModuleGroupMenu';
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

export function Rail() {
  const loc = useLocation();
  const { theme, toggleTheme } = useApp();

  return (
    <aside
      className="hidden lg:flex w-[68px] shrink-0 h-full flex-col items-center py-4 gap-1.5 safe-top safe-bottom"
      style={{ background: 'var(--bg-rail)', borderRight: '1px solid var(--border)' }}
    >
      <div
        className="w-[30px] h-[30px] rounded-lg flex items-center justify-center mb-3 shrink-0"
        style={{ border: '1px solid var(--accent)' }}
      >
        <div className="w-3 h-3 rounded-[2px] rotate-45" style={{ background: 'var(--accent)' }} />
      </div>

      <RailLink to="/" icon={IC.home} label="Home" active={loc.pathname === '/'} />
      <ModuleGroupMenu category="Study" label="Study" placement="rail" />
      <RailLink to="/question-bank" icon={IC.qbank} label="Q. Bank" active={loc.pathname === '/question-bank'} />
      <ModuleGroupMenu category="Practice" label="Practice" placement="rail" />
      <AdminNavMenu placement="rail" />

      <div className="flex-1" />

      <ShellSwitcher />

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
