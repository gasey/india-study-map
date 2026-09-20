import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Rail } from './Rail';
import { AppHeader } from './AppHeader';
import { AdminNavMenu } from './AdminNavMenu';
import { MORE_ITEMS } from './MoreFlyout';
import { IC, IconSvg } from './icons';
import { modules } from '@/modules/registry';
import { useApp } from '@/lib/store';
import { CollectibleSectionHeader, CollectibleTabs } from './CollectibleTabBar';
import { COLLECTIBLE_TABS, activeTabFor } from './collectibleTabs';
import { OfflineBanner } from '@/components/states/OfflineBanner';

/** Route -> AppHeader kicker/title. Every module page's own local header
 *  now hides itself at desktop widths (lg:hidden) once its route is listed
 *  here — see each page's own header comment for the pairing. A route
 *  missing from this map falls back to a generic "Jabreeze" title, which
 *  is wrong for any real page, so keep this in sync with Root.tsx's routes. */
const HEADER_BY_PATH: Record<string, { kicker?: string; title: string }> = {
  '/': { title: 'Home' },
  '/question-bank': { title: 'Question Bank' },
  '/tests': { title: 'Tests' },
  '/papers': { title: 'Papers' },
  '/map': { title: 'Study Map' },
  '/timeline': { title: 'Chronicle' },
  '/recall': { title: 'Recall' },
  '/library': { title: 'Library' },
  '/current-affairs': { title: 'Current Affairs' },
  '/code': { title: 'Programming & Python' },
  '/games': { title: 'Games' },
  '/account': { title: 'Account' },
  '/pyq': { title: 'PYQ Practice' },
  '/flashcards': { title: 'Flashcards' },
  '/mindmaps': { title: 'Mind Maps' },
  '/arena': { title: 'Gauntlet Run' },
  '/mpsc': { title: 'MPSC Old Questions' },
  '/state-tax-officer': { title: 'State Tax Officer' },
  '/admin': { title: 'Admin' },
  '/mindset': { title: 'Return to Peace' },
};

function headerFor(pathname: string) {
  if (HEADER_BY_PATH[pathname]) return HEADER_BY_PATH[pathname];
  // /embed/:id serves whichever static module the id names (Polity Codex,
  // Labs, JSO, ...) — look its title up in the same registry EmbedPage uses,
  // rather than a fixed HEADER_BY_PATH entry.
  if (pathname.startsWith('/embed/')) {
    const id = pathname.split('/')[2];
    const module = modules.find((m) => m.id === id && m.kind === 'static');
    if (module) return { title: module.title };
  }
  const base = '/' + (pathname.split('/')[1] ?? '');
  return HEADER_BY_PATH[base] ?? { title: 'Jabreeze' };
}

const MOBILE_MAIN_ITEMS = [
  { to: '/', icon: IC.home, label: 'Home' },
  { to: '/question-bank', icon: IC.qbank, label: 'Q. Bank' },
  { to: '/tests', icon: IC.tests, label: 'Tests' },
  { to: '/papers', icon: IC.papers, label: 'Papers' },
] as const;

/** Mobile-only bottom nav — additive to each page's own local ModuleSwitcher
 *  pill, not a replacement. Hidden on /map: that screen already owns the
 *  bottom of the viewport with its own fixed, swipeable facts/quiz sheet —
 *  a second bottom bar there would visually collide with it. */
function MobileBottomBar() {
  const loc = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  const skin = useApp((s) => s.skin);
  const collectible = skin === 'collectible';

  /* The source's bottom bar is 64px, sits under a 3px ink rule, and marks
     the active tab as a solid yellow cell with an ink divider between
     cells — not a tinted icon. Inactive cells stay paper, so the bar reads
     as a printed strip of four blocks.

     Class-driven, never inline var(--clb-*): inline resolves before
     ThemeSync sets data-theme and is never re-resolved. See the
     .clb-nav-item comment in collectible.css. */
  const cellClass = (active: boolean) =>
    `flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5${
      collectible ? ` clb-nav-cell${active ? ' clb-nav-cell-active' : ''}` : ''
    }`;
  const cellStyle = (active: boolean) =>
    collectible ? undefined : { color: active ? 'var(--accent)' : 'var(--text-secondary)' };

  return (
    <>
      <nav
        className={`mobile-bottom-bar lg:hidden flex items-stretch shrink-0 safe-bottom ${collectible ? 'h-[64px]' : 'h-[60px]'}`}
        style={collectible ? undefined : { borderTop: '1px solid var(--border)', background: 'var(--bg-panel)' }}
      >
        {collectible
          ? /* The source's mobile bar is the same four tabs as desktop, and
               drops the More sheet entirely. Nothing is stranded: the
               sub-tab rail below the header covers each tab's routes, and
               Guides lists every standalone app. */
            COLLECTIBLE_TABS.map((tab) => {
              const on = activeTabFor(loc.pathname) === tab.id;
              return (
                <Link key={tab.id} to={tab.to} className={cellClass(on)} style={cellStyle(on)} aria-current={on ? 'page' : undefined}>
                  <IconSvg d={tab.icon} size={18} />
                  <span className="text-[10px] font-medium">{tab.label}</span>
                </Link>
              );
            })
          : (
            <>
              {MOBILE_MAIN_ITEMS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cellClass(loc.pathname === item.to)}
                  style={cellStyle(loc.pathname === item.to)}
                >
                  <IconSvg d={item.icon} size={18} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </Link>
              ))}
              <button
                onClick={() => setMoreOpen(true)}
                className={cellClass(false)}
                style={cellStyle(false)}
              >
                <IconSvg d={IC.more} size={18} />
                <span className="text-[10px] font-medium">More</span>
              </button>
            </>
          )}
        <AdminNavMenu placement="bottom" />
      </nav>
      {moreOpen && (
        <div className="lg:hidden fixed inset-0 z-[1300]" role="dialog">
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={() => setMoreOpen(false)} />
          <div
            className="absolute inset-x-0 bottom-0 rounded-t-xl overflow-hidden safe-bottom"
            style={{ background: 'var(--bg-panel)', animation: 'om-sheet-up var(--dur-2) var(--ease-out) both' }}
          >
            <div className="px-3 pt-2.5 pb-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>More</div>
            {MORE_ITEMS.map((item) => {
              const inner = (
                <div className="flex items-center gap-2.5 px-3 py-3">
                  <span style={{ color: 'var(--text-secondary)' }}><IconSvg d={item.icon} size={18} /></span>
                  <span className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    {item.label}
                    {item.comingSoon && (
                      <span className="text-[10px] px-1.5 rounded" style={{ background: 'var(--bg-panel-elev)', color: 'var(--text-secondary)' }}>Planned</span>
                    )}
                  </span>
                </div>
              );
              if (item.comingSoon) return <div key={item.id} className="opacity-50 cursor-not-allowed">{inner}</div>;
              return (
                <Link key={item.id} to={item.to} onClick={() => setMoreOpen(false)}>
                  {inner}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const loc = useLocation();
  const isMap = loc.pathname.startsWith('/map');
  const header = headerFor(loc.pathname);
  const collectible = useApp((s) => s.skin) === 'collectible';

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--bg-app)' }}>
      <AppHeader kicker={header.kicker} title={header.title} />
      <OfflineBanner />
      {/* AppHeader is desktop-only, so on mobile the sub-tab rail has to be
          re-hung here — without it the four bottom tabs would be the only
          navigation and /tests, /papers and /recall would be unreachable. */}
      {collectible && (
        <div className="lg:hidden shrink-0">
          {/* /map suppresses the bottom bar (its own swipeable sheet owns the
              bottom of the viewport), so on that route the bottom bar can't
              be the tab switcher. Without this the map became a dead end on
              mobile — the Atlas sub-rail was the only navigation left once
              the per-page ModuleSwitcher went away. */}
          {isMap && (
            <div className="clb-mobile-tabs flex items-center gap-2 px-4 overflow-x-auto">
              <CollectibleTabs />
            </div>
          )}
          <CollectibleSectionHeader />
        </div>
      )}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* The collectible direction replaces the rail (and its More flyout)
            with AppHeader's four-tab band — see collectibleTabs.ts. Both
            shells stay in the tree so switching skin switches the whole
            navigation model, which is the point of keeping it A/B-able. */}
        {!collectible && <Rail />}
        <main className="flex-1 min-w-0 overflow-hidden">{children}</main>
      </div>
      {!isMap && <MobileBottomBar />}
    </div>
  );
}
