import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Rail } from './Rail';
import { AppHeader } from './AppHeader';
import { AdminNavMenu } from './AdminNavMenu';
import { MORE_ITEMS } from './MoreFlyout';
import { IC, IconSvg } from './icons';
import { modules } from '@/modules/registry';
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

  return (
    <>
      <nav
        className="lg:hidden flex items-stretch h-[60px] shrink-0 safe-bottom"
        style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-panel)' }}
      >
        {MOBILE_MAIN_ITEMS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5"
            style={{ color: loc.pathname === item.to ? 'var(--accent)' : 'var(--text-secondary)' }}
          >
            <IconSvg d={item.icon} size={18} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}
        <button
          onClick={() => setMoreOpen(true)}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5"
          style={{ color: 'var(--text-secondary)' }}
        >
          <IconSvg d={IC.more} size={18} />
          <span className="text-[10px] font-medium">More</span>
        </button>
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

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--bg-app)' }}>
      <AppHeader kicker={header.kicker} title={header.title} />
      <OfflineBanner />
      <div className="flex-1 flex overflow-hidden min-h-0">
        <Rail />
        <main className="flex-1 min-w-0 overflow-hidden">{children}</main>
      </div>
      {!isMap && <MobileBottomBar />}
    </div>
  );
}
