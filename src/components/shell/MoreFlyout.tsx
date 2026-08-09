import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IC, IconSvg } from './icons';

/** Shared by the desktop side-panel and the mobile bottom sheet so the two
 *  can't drift out of sync. Programming & Python and Games have no real
 *  page yet (later phase) — rendered disabled per the handoff's own
 *  "Planned — not designed yet" convention rather than half-built. */
export const MORE_ITEMS = [
  { id: 'affairs', label: 'Current Affairs', icon: IC.papers, to: '/current-affairs', comingSoon: false },
  { id: 'code', label: 'Programming & Python', icon: IC.code, to: '/code', comingSoon: true },
  { id: 'games', label: 'Games', icon: IC.games, to: '/games', comingSoon: true },
] as const;

function MoreRow({ item, onClick }: { item: (typeof MORE_ITEMS)[number]; onClick: () => void }) {
  const loc = useLocation();
  const active = loc.pathname === item.to || loc.pathname.startsWith(`${item.to}/`);
  const inner = (
    <div className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-[var(--bg-panel-elev)] transition-colors">
      <span style={{ color: active ? 'var(--accent)' : 'var(--text-secondary)' }}><IconSvg d={item.icon} size={18} /></span>
      <span className="text-sm font-medium flex items-center gap-2" style={{ color: active ? 'var(--accent)' : 'var(--text-primary)' }}>
        {item.label}
        {item.comingSoon && (
          <span className="text-[10px] px-1.5 rounded" style={{ background: 'var(--bg-panel-elev)', color: 'var(--text-secondary)' }}>
            Planned
          </span>
        )}
      </span>
    </div>
  );
  if (item.comingSoon) {
    return <div className="opacity-50 cursor-not-allowed" title="Planned — not designed yet">{inner}</div>;
  }
  return (
    <Link to={item.to} onClick={onClick} role="menuitem">
      {inner}
    </Link>
  );
}

/** Desktop trigger + 236px side panel, anchored at left:76px (rail width).
 *  Closes on pick, outside click, and Escape. */
export function MoreFlyout() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-14 py-2 rounded-lg flex flex-col items-center gap-1 transition-colors"
        style={{ color: open ? 'var(--accent)' : 'var(--text-secondary)', background: open ? 'var(--accent-soft)' : 'transparent' }}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <IconSvg d={IC.more} />
        <span className="text-[9px] tracking-wide">More</span>
      </button>
      {open && (
        <div
          role="menu"
          className="absolute bottom-0 left-full ml-2 w-[236px] rounded-lg z-[1200] overflow-hidden"
          style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', boxShadow: 'var(--sh-flyout, 0 8px 32px rgba(0,0,0,0.12))' }}
        >
          <div style={{ animation: 'om-slide-in var(--dur-3) var(--ease) both' }}>
            {MORE_ITEMS.map((item) => (
              <MoreRow key={item.id} item={item} onClick={() => setOpen(false)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
