import { useLocation, Link } from 'react-router-dom';
import { useApp } from '@/lib/store';
import { IC, IconSvg } from './icons';
import { MoreFlyout } from './MoreFlyout';
import { AdminNavMenu } from './AdminNavMenu';

const RAIL_ITEM_BASE = 'w-14 py-2 rounded-lg flex flex-col items-center gap-1 transition-colors';

/** In the collectible skin an active nav item is a solid yellow block with an
 *  ink border — the source's "same four tabs" treatment — rather than the
 *  default's tinted-accent wash.
 *
 *  The collectible half is expressed as *classes*, not an inline style: an
 *  inline var(--clb-*) is resolved before ThemeSync has set data-theme and
 *  then never re-resolved. See the .clb-nav-item comment in collectible.css.
 *  Only the default skin — whose tokens exist in every theme — is safe to
 *  set inline. */
function railItemClass(active: boolean, collectible: boolean) {
  if (!collectible) return RAIL_ITEM_BASE;
  return `${RAIL_ITEM_BASE} clb-nav-item${active ? ' clb-nav-item-active' : ''}`;
}

function railItemStyle(active: boolean, collectible: boolean): React.CSSProperties | undefined {
  if (collectible) return undefined;
  return {
    background: active ? 'var(--accent-soft)' : 'transparent',
    color: active ? 'var(--accent)' : 'var(--text-secondary)',
  };
}

function RailLink({ to, icon, label, active, collectible }: { to: string; icon: string; label: string; active: boolean; collectible: boolean }) {
  return (
    <Link to={to} className={railItemClass(active, collectible)} style={railItemStyle(active, collectible)}>
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
  const { theme, toggleTheme, skin, toggleSkin } = useApp();
  const collectible = skin === 'collectible';

  return (
    <aside
      /* The `rail` class is what tokens.css's neon glass rule has always
         targeted — it was never on the element, so that blur never applied.
         Adding it here fixes that and gives collectible.css a hook. */
      /* Collectible's own background/border come from collectible.css's
         `.rail` rule, not from here — see railItemClass. */
      className="rail hidden lg:flex w-[76px] shrink-0 h-full flex-col items-center py-4 gap-1.5 safe-top safe-bottom"
      style={collectible ? undefined : { background: 'var(--bg-rail)', borderRight: '1px solid var(--border)' }}
    >
      <div
        className={`w-[30px] h-[30px] rounded-lg flex items-center justify-center mb-3 shrink-0${collectible ? ' clb-mark' : ''}`}
        style={collectible ? undefined : { border: '1px solid var(--accent)' }}
      >
        {/* The source's mark is a solid ink lozenge, not an outline. */}
        <div
          className="w-3 h-3 rounded-[2px] rotate-45"
          style={collectible ? undefined : { background: 'var(--accent)' }}
        />
      </div>

      {RAIL_ITEMS.map((item) => (
        <RailLink
          key={item.to}
          to={item.to}
          icon={item.icon}
          label={item.label}
          collectible={collectible}
          active={loc.pathname === item.to || (item.to !== '/' && loc.pathname.startsWith(`${item.to}/`))}
        />
      ))}
      <MoreFlyout />

      <div className="flex-1" />

      <AdminNavMenu placement="rail" />

      <Link
        to="/account"
        className={railItemClass(loc.pathname === '/account', collectible)}
        style={railItemStyle(loc.pathname === '/account', collectible)}
      >
        <IconSvg d={IC.avatar} />
        <span className="text-[9px] tracking-wide">Account</span>
      </Link>

      {/* Light/dark is meaningless under the collectible skin — it is a
          light-only direction — so the control is hidden rather than left
          as a button that visibly does nothing. */}
      {!collectible && (
        <button
          onClick={toggleTheme}
          className="w-14 py-2 rounded-lg flex flex-col items-center gap-1 transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          title="Toggle theme"
        >
          <IconSvg d={theme === 'light' ? IC.moon : IC.sun} />
          <span className="text-[9px]">{theme === 'light' ? 'Dark' : 'Light'}</span>
        </button>
      )}

      <button
        onClick={toggleSkin}
        className={railItemClass(collectible, collectible)}
        style={collectible ? undefined : { color: 'var(--text-secondary)' }}
        title={collectible ? 'Back to the default skin' : 'Try the collectible skin (Study OS v3)'}
      >
        <IconSvg d={IC.cards} />
        <span className="text-[9px]">{collectible ? 'Default' : 'Bright'}</span>
      </button>
    </aside>
  );
}
