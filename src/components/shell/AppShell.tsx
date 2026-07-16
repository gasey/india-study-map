import { useLocation } from 'react-router-dom';
import { useApp } from '@/lib/store';
import { SHELL_STYLES } from '@/lib/shellStyles';
import { Rail } from './Rail';
import { CommandBar } from './CommandBar';

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
    </div>
  );
}
