import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '@/lib/store';
import { modules } from '@/modules/registry';
import { IC, IconSvg } from './icons';
import { ShellSwitcher } from './ShellSwitcher';

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

function RailPopoverButton({ icon, label, children }: { icon: string; label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-14 py-2 rounded-lg flex flex-col items-center gap-1 transition-colors"
        style={{ color: 'var(--text-secondary)' }}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <IconSvg d={icon} />
        <span className="text-[9px] tracking-wide">{label}</span>
      </button>
      {open && (
        <div
          role="menu"
          className="absolute bottom-0 left-full ml-2 w-56 rounded-lg shadow-lg z-[1200] overflow-hidden"
          style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function Rail() {
  const loc = useLocation();
  const { theme, toggleTheme } = useApp();
  const labsModules = modules.filter((m) => m.category === 'Labs');
  const codex = modules.find((m) => m.id === 'codex');

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
      <RailLink to="/map" icon={IC.map} label="Map" active={loc.pathname.startsWith('/map')} />
      <RailLink to="/pyq" icon={IC.pyq} label="PYQ" active={loc.pathname === '/pyq'} />
      <RailLink to="/flashcards" icon={IC.cards} label="Cards" active={loc.pathname === '/flashcards'} />
      <RailLink to="/mindmaps" icon={IC.mind} label="Mind" active={loc.pathname === '/mindmaps'} />
      <RailLink to="/timeline" icon={IC.chronicle} label="Timeline" active={loc.pathname === '/timeline'} />
      {codex && (
        <a
          href={codex.path}
          target="_blank"
          rel="noopener"
          className="w-14 py-2 rounded-lg flex flex-col items-center gap-1 transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          <IconSvg d={IC.codex} />
          <span className="text-[9px] tracking-wide">Notes</span>
        </a>
      )}
      {labsModules.length > 0 && (
        <RailPopoverButton icon={IC.labs} label="Labs">
          <div className="px-3 pt-2.5 pb-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
            Labs
          </div>
          {labsModules.map((m) => (
            <a
              key={m.id}
              href={m.path}
              target="_blank"
              rel="noopener"
              className="block px-3 py-2.5 transition-colors"
            >
              <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{m.title}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{m.tagline}</div>
            </a>
          ))}
        </RailPopoverButton>
      )}

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
