import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/store';
import { modules } from '@/modules/registry';
import { chapters } from '@/data';
import { studyStreak } from '@/lib/stats';
import { ShellSwitcher } from './ShellSwitcher';
import { IC, IconSvg } from './icons';

const PILLS: { label: string; to: string }[] = [
  { label: 'Home', to: '/' },
  { label: 'Map', to: '/map' },
  { label: 'PYQ', to: '/pyq' },
  { label: 'Cards', to: '/flashcards' },
  { label: 'Mind', to: '/mindmaps' },
];

function SearchBox() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const results = useMemo(() => {
    if (!q.trim()) return { chapters: [], modules: [] };
    const s = q.trim().toLowerCase();
    return {
      chapters: chapters.filter((c) => c.title.toLowerCase().includes(s)).slice(0, 5),
      modules: modules.filter((m) => m.title.toLowerCase().includes(s)).slice(0, 5),
    };
  }, [q]);

  return (
    <div ref={ref} className="relative flex-1 max-w-[420px]">
      <div
        className="flex items-center gap-2 rounded-lg px-3 py-1.5"
        style={{ background: 'var(--bg-app)', border: '1px solid var(--border)' }}
      >
        <IconSvg size={14} d="M7 1.5A5.5 5.5 0 1112.5 7 5.5 5.5 0 017 1.5zM11 11l4 4" />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search chapters, modules…"
          className="flex-1 bg-transparent outline-none text-xs"
          style={{ color: 'var(--text-primary)' }}
        />
        <span className="text-[10px] rounded px-1 py-0.5" style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>⌘K</span>
      </div>
      {open && q.trim() && (
        <div
          className="absolute left-0 right-0 mt-1.5 rounded-lg shadow-lg z-[1200] overflow-hidden max-h-80 overflow-y-auto"
          style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}
        >
          {results.chapters.length === 0 && results.modules.length === 0 && (
            <div className="px-3 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>No matches</div>
          )}
          {results.chapters.length > 0 && (
            <div>
              <div className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Chapters</div>
              {results.chapters.map((c) => (
                <button
                  key={c.id}
                  className="w-full text-left px-3 py-2 text-sm transition-colors"
                  style={{ color: 'var(--text-primary)' }}
                  onClick={() => { useApp.getState().setChapter(c.id); navigate('/map'); setOpen(false); setQ(''); }}
                >
                  {c.title}
                </button>
              ))}
            </div>
          )}
          {results.modules.length > 0 && (
            <div>
              <div className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Modules</div>
              {results.modules.map((m) =>
                m.kind === 'route' ? (
                  <button
                    key={m.id}
                    className="w-full text-left px-3 py-2 text-sm transition-colors"
                    style={{ color: 'var(--text-primary)' }}
                    onClick={() => { navigate(m.path); setOpen(false); setQ(''); }}
                  >
                    {m.glyph} {m.title}
                  </button>
                ) : (
                  <a
                    key={m.id}
                    href={m.path}
                    target="_blank"
                    rel="noopener"
                    className="block px-3 py-2 text-sm"
                    style={{ color: 'var(--text-primary)' }}
                    onClick={() => setOpen(false)}
                  >
                    {m.glyph} {m.title}
                  </a>
                )
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function CommandBar({ breadcrumb }: { breadcrumb?: React.ReactNode }) {
  const loc = useLocation();
  const { theme, toggleTheme, progress, bankProgress } = useApp();
  const streak = studyStreak(progress, bankProgress);
  const codex = modules.find((m) => m.id === 'codex');
  const labsModules = modules.filter((m) => m.category === 'Labs');
  const [labsOpen, setLabsOpen] = useState(false);
  const labsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (labsRef.current && !labsRef.current.contains(e.target as Node)) setLabsOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <header
      className="hidden lg:flex h-[54px] shrink-0 items-center gap-6 px-7 safe-top"
      style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-panel)' }}
    >
      <Link to="/" className="flex items-center gap-2.5 shrink-0">
        <div className="w-3.5 h-3.5 rounded-[2px] rotate-45" style={{ background: 'var(--accent)' }} />
        <span className="text-[15px] font-medium" style={{ color: 'var(--text-primary)' }}>Jabreeze</span>
      </Link>
      <nav className="flex gap-1 shrink-0">
        {PILLS.map((p) => {
          const active = p.to === '/' ? loc.pathname === '/' : loc.pathname.startsWith(p.to);
          return (
            <Link
              key={p.to}
              to={p.to}
              className="text-[13px] px-3 py-1.5 rounded-lg transition-colors"
              style={{
                background: active ? 'var(--accent-soft)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--text-secondary)',
                fontWeight: active ? 500 : 400,
              }}
            >
              {p.label}
            </Link>
          );
        })}
        {codex && (
          <a
            href={codex.path}
            target="_blank"
            rel="noopener"
            className="text-[13px] px-3 py-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            Notes
          </a>
        )}
        {labsModules.length > 0 && (
          <div ref={labsRef} className="relative">
            <button
              onClick={() => setLabsOpen((o) => !o)}
              className="text-[13px] px-3 py-1.5 rounded-lg transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              Labs ▾
            </button>
            {labsOpen && (
              <div
                className="absolute left-0 mt-1.5 w-56 rounded-lg shadow-lg z-[1200] overflow-hidden"
                style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}
              >
                {labsModules.map((m) => (
                  <a
                    key={m.id}
                    href={m.path}
                    target="_blank"
                    rel="noopener"
                    className="block px-3 py-2.5"
                    onClick={() => setLabsOpen(false)}
                  >
                    <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{m.title}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{m.tagline}</div>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </nav>

      {breadcrumb ? (
        <div className="flex-1 min-w-0 flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
          {breadcrumb}
        </div>
      ) : (
        <SearchBox />
      )}

      <div className="flex items-center gap-3 shrink-0 ml-auto">
        {streak > 0 && (
          <span
            className="text-[11px] px-2.5 py-1 rounded-full"
            style={{ border: `1px solid var(--accent-soft)`, color: 'var(--accent)' }}
          >
            {streak}-day streak
          </span>
        )}
        <ShellSwitcher placement="bar" />
        <button
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          title="Toggle theme"
        >
          <IconSvg d={theme === 'light' ? IC.moon : IC.sun} />
        </button>
      </div>
    </header>
  );
}
