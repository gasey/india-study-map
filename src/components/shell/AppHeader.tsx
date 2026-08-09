import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/store';
import { modules } from '@/modules/registry';
import { chapters } from '@/data';
import { studyStreak } from '@/lib/stats';
import { IC, IconSvg } from './icons';

/** Migrated verbatim from the old CommandBar's SearchBox — same search
 *  scope (chapters + registry modules, substring match). A true 4-group
 *  modal palette (Jump to/Questions/Papers/Library) is deferred: Questions
 *  and Papers have no unified data model to search across yet. */
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

  const go = (path: string) => {
    navigate(path);
    setOpen(false);
    setQ('');
  };

  return (
    <div ref={ref} className="relative flex-1 max-w-[420px]">
      <div
        className="flex items-center gap-2 rounded-lg px-3 py-1.5"
        style={{ background: 'var(--bg-app)', border: '1px solid var(--border)' }}
      >
        <IconSvg size={14} d={IC.search} />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Jump to a chapter or module…"
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
              <div className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Jump to</div>
              {results.chapters.map((c) => (
                <button
                  key={c.id}
                  className="w-full text-left px-3 py-2 text-sm transition-colors"
                  style={{ color: 'var(--text-primary)' }}
                  onClick={() => { useApp.getState().setChapter(c.id); go('/map'); }}
                >
                  {c.title}
                </button>
              ))}
            </div>
          )}
          {results.modules.length > 0 && (
            <div>
              <div className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Modules</div>
              {results.modules.map((m) => (
                <button
                  key={m.id}
                  className="w-full text-left px-3 py-2 text-sm transition-colors"
                  style={{ color: 'var(--text-primary)' }}
                  onClick={() => go(m.kind === 'static' ? `/embed/${m.id}` : m.path)}
                >
                  {m.glyph} {m.title}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface Tab {
  label: string;
  active: boolean;
  onClick: () => void;
}

interface AppHeaderProps {
  kicker?: string;
  title: string;
  tabs?: Tab[];
}

/** Persistent kicker/title/search bar, present on every route above
 *  <Rail>+<main>. Module pages that own a local header (Study Map, PYQ,
 *  Flashcards, etc.) hide it at desktop widths (lg:hidden) now that every
 *  real route has a correct entry in AppShell.tsx's HEADER_BY_PATH — this
 *  used to stack a second, often-wrong-titled bar above theirs; fixed
 *  2026-08-09. A page whose local header carries real functional controls
 *  with no equivalent elsewhere (Study Map's basemap switcher, Chronicle's
 *  Canvas/Reading toggle, State Tax Officer's LoginPanel, Mind Maps' map
 *  selector) keeps that bar visible at desktop too, dropping only its
 *  now-redundant title text. */
export function AppHeader({ kicker, title, tabs }: AppHeaderProps) {
  const { progress, bankProgress } = useApp();
  const streak = studyStreak(progress, bankProgress);

  return (
    <header
      className="hidden lg:flex flex-col shrink-0 safe-top"
      style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-panel)' }}
    >
      <div className="flex items-center gap-4 h-[54px] px-6">
        <div className="min-w-0">
          {kicker && (
            <div
              className="text-[10px] font-mono uppercase tracking-[0.12em] truncate"
              style={{ color: 'var(--text-muted)' }}
            >
              {kicker}
            </div>
          )}
          <div className="text-[15px] font-medium truncate" style={{ color: 'var(--text-primary)' }}>{title}</div>
        </div>

        <div className="flex-1" />

        {streak > 0 && (
          <span
            className="text-[11px] px-2.5 py-1 rounded-full shrink-0"
            style={{ border: '1px solid var(--accent-soft)', color: 'var(--accent)' }}
          >
            {streak}-day streak
          </span>
        )}

        <SearchBox />
      </div>

      {tabs && tabs.length > 0 && (
        <div className="flex items-center gap-1 px-6 -mt-px">
          {tabs.map((t) => (
            <button
              key={t.label}
              onClick={t.onClick}
              className="text-[13px] px-3 py-2 -mb-px border-b-2 transition-colors"
              style={{
                borderColor: t.active ? 'var(--accent)' : 'transparent',
                color: t.active ? 'var(--accent)' : 'var(--text-secondary)',
                fontWeight: t.active ? 500 : 400,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
