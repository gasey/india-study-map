import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { modules, type ModuleCategory, type PracticeSubgroup } from './registry';
import { useApp } from '@/lib/store';

const CATEGORY_ORDER: ModuleCategory[] = ['Study', 'Practice'];
const SUBGROUP_ORDER: PracticeSubgroup[] = ['In-app modules', 'Exam guides', 'Labs', 'Quick practice (one-offs)'];

/** App-switcher pill — drop it into any module's header.
 *
 *  Renders nothing under the collectible skin. That shell already navigates
 *  with four tabs plus a sub-tab rail, so this pill would be a third way to
 *  reach the same destinations on the same screen — and the source has no
 *  such control. Returning null here covers all four call sites (TopBar,
 *  MindMapsPage, ArenaPage, QuizPlayerPage) rather than guarding each.
 *
 *  Before this could go, Mind Maps needed a real Atlas sub-tab: with the
 *  mobile More sheet dropped too, this pill had briefly become the only
 *  navigation to that route. */
export function ModuleSwitcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const loc = useLocation();
  const collectible = useApp((s) => s.skin) === 'collectible';
  const onQuestionBank = loc.pathname === '/question-bank';
  const current =
    modules.find((m) => m.kind === 'route' && (m.path === loc.pathname || loc.pathname.startsWith(`${m.path}/`))) ??
    modules[0];

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  // After the hooks, never before — bailing earlier would change the hook
  // order between skins and break the rules of hooks on every toggle.
  if (collectible) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm hover:bg-[var(--bg-panel-elev)] transition-colors"
        style={{ color: 'var(--text-primary)', border: '1px solid var(--border)' }}
        aria-haspopup="menu"
        aria-expanded={open}
        title="Switch module"
      >
        <span>{onQuestionBank ? '📚' : current.glyph}</span>
        <span className="font-medium hidden sm:inline">{onQuestionBank ? 'Question Bank' : current.title}</span>
        <span style={{ color: 'var(--text-secondary)', fontSize: 10 }}>▾</span>
      </button>
      {open && (
        <div
          role="menu"
          className="surface clb-flat absolute left-0 mt-1.5 w-72 rounded-lg shadow-lg z-[1200] overflow-hidden"
        >
          <Link
            to="/question-bank"
            onClick={() => setOpen(false)}
            role="menuitem"
            className="flex items-start gap-2.5 px-3 py-2.5 hover:bg-[var(--bg-panel-elev)] transition-colors"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <span className="text-lg leading-none mt-0.5">📚</span>
            <div className="min-w-0">
              <div className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                Question Bank
                {onQuestionBank && <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />}
              </div>
              <div className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>Unified catalog — every source in one place</div>
            </div>
          </Link>
          {CATEGORY_ORDER.map((cat) => {
            const group = modules.filter((m) => m.category === cat);
            if (group.length === 0) return null;
            const subgroups = cat === 'Practice' ? SUBGROUP_ORDER : [undefined];
            return (
              <div key={cat}>
                <div
                  className="px-3 pt-2.5 pb-1 text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {cat}
                </div>
                {subgroups.map((sg) => {
                  const items = sg ? group.filter((m) => m.subgroup === sg) : group;
                  if (items.length === 0) return null;
                  return (
                    <div key={sg ?? 'flat'}>
                      {sg && (
                        <div className="px-3 pt-1.5 pb-0.5 text-[9px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                          {sg}
                        </div>
                      )}
                      {items.map((m) => {
                        const active = m.kind === 'route' && (m.path === loc.pathname || loc.pathname.startsWith(`${m.path}/`));
                        const to = m.kind === 'static' ? `/embed/${m.id}` : m.path;
                        const inner = (
                          <div className="flex items-start gap-2.5 px-3 py-2.5 hover:bg-[var(--bg-panel-elev)] transition-colors">
                            <span className="text-lg leading-none mt-0.5">{m.glyph}</span>
                            <div className="min-w-0">
                              <div className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                                {m.title}
                                {m.comingSoon && (
                                  <span className="text-[10px] px-1.5 rounded" style={{ background: 'var(--bg-panel-elev)', color: 'var(--text-secondary)' }}>soon</span>
                                )}
                                {active && <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />}
                              </div>
                              <div className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{m.tagline}</div>
                            </div>
                          </div>
                        );
                        if (m.comingSoon) return <div key={m.id} className="opacity-50 cursor-not-allowed">{inner}</div>;
                        return (
                          <Link key={m.id} to={to} onClick={() => setOpen(false)} role="menuitem">{inner}</Link>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
