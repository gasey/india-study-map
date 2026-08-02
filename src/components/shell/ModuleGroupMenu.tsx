import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { modules, type AppModule, type ModuleCategory, type PracticeSubgroup } from '@/modules/registry';
import { IC, IconSvg } from './icons';

const SUBGROUP_ORDER: PracticeSubgroup[] = ['In-app modules', 'Exam guides', 'Labs', 'Quick practice (one-offs)'];

const TRIGGER_ICON: Record<ModuleCategory, string> = {
  Study: IC.study,
  Practice: IC.pyq,
};

function isActive(m: AppModule, pathname: string) {
  return m.kind === 'route' && (m.path === pathname || pathname.startsWith(`${m.path}/`));
}

function ModuleRow({ m, pathname, onClick }: { m: AppModule; pathname: string; onClick: () => void }) {
  const active = isActive(m, pathname);
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
  if (m.comingSoon) return <div className="opacity-50 cursor-not-allowed">{inner}</div>;
  return (
    <Link to={to} onClick={onClick} role="menuitem">
      {inner}
    </Link>
  );
}

function GroupHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 pt-2.5 pb-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
      {children}
    </div>
  );
}

interface Props {
  category: ModuleCategory;
  label: string;
  placement: 'rail' | 'bar' | 'bottom';
}

/**
 * Grouped Study/Practice nav dropdown — one component, three trigger/popover
 * shapes selected by `placement`, mirroring ShellSwitcher.tsx's pattern.
 * Study renders flat; Practice groups by `subgroup` (In-app modules, Exam
 * guides, Labs, Quick practice) in a fixed order.
 */
export function ModuleGroupMenu({ category, label, placement }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const loc = useLocation();

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const items = modules.filter((m) => m.category === category);
  const close = () => setOpen(false);

  const trigger =
    placement === 'bar' ? (
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-[13px] px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
        style={{ color: 'var(--text-secondary)' }}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {label}
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
        <IconSvg d={TRIGGER_ICON[category]} size={18} />
        <span className="text-[10px] font-medium">{label}</span>
      </button>
    ) : (
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-14 py-2 rounded-lg flex flex-col items-center gap-1 transition-colors"
        style={{ color: 'var(--text-secondary)' }}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <IconSvg d={TRIGGER_ICON[category]} />
        <span className="text-[9px] tracking-wide">{label}</span>
      </button>
    );

  const popoverClass =
    placement === 'rail'
      ? 'absolute bottom-0 left-full ml-2 w-64'
      : placement === 'bottom'
        ? 'fixed inset-x-3 bottom-[68px] max-h-[65vh] overflow-y-auto'
        : 'absolute left-0 mt-1.5 w-72';

  return (
    <div ref={ref} className={placement === 'bottom' ? 'flex-1 relative' : 'relative'}>
      {trigger}
      {open && (
        <div
          role="menu"
          className={`${popoverClass} rounded-lg shadow-lg z-[1200] overflow-hidden`}
          style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}
        >
          {category === 'Study'
            ? items.map((m) => <ModuleRow key={m.id} m={m} pathname={loc.pathname} onClick={close} />)
            : SUBGROUP_ORDER.map((sg) => {
                const group = items.filter((m) => m.subgroup === sg);
                if (group.length === 0) return null;
                return (
                  <div key={sg}>
                    <GroupHeader>{sg}</GroupHeader>
                    {group.map((m) => (
                      <ModuleRow key={m.id} m={m} pathname={loc.pathname} onClick={close} />
                    ))}
                  </div>
                );
              })}
        </div>
      )}
    </div>
  );
}
