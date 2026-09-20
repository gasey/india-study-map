import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as api from '@/lib/mpscApi';
import { IconSvg } from './icons';
import { COLLECTIBLE_TABS, activeTabFor, staticTabCounts, type CollectibleTabId } from './collectibleTabs';

/** Bank's count is the only one the client can't derive — ask the API for
 *  the real total. `limit: 1` because we want the count, not the rows.
 *  Returns null (render no count) on failure rather than a placeholder: a
 *  wrong figure here is worse than no figure.
 *
 *  Cached at module scope, not per-mount. The tab bar remounts on every
 *  navigation, and a per-mount fetch made the count blink out and back on
 *  each route change — as well as firing a request per click. */
let bankTotalCache: number | null = null;
let bankTotalRequest: Promise<number | null> | null = null;

function useBankTotal() {
  const [total, setTotal] = useState<number | null>(bankTotalCache);
  useEffect(() => {
    if (bankTotalCache != null) return;
    let alive = true;
    bankTotalRequest ??= api
      .listBankQuestions({ limit: 1 })
      .then((r) => (bankTotalCache = r.total))
      .catch(() => null)
      // let a later mount retry a failed lookup
      .finally(() => { bankTotalRequest = null; }) as Promise<number | null>;
    bankTotalRequest.then((t) => { if (alive && t != null) setTotal(t); });
    return () => { alive = false; };
  }, []);
  return total;
}

function fmt(n: number) {
  return n.toLocaleString();
}

/** The four primary tabs — frame 3e's header row. An active tab is a paper
 *  block with a hard offset shadow, so it reads as lifted off the yellow
 *  band; the rest are flat with just the ink rule. */
export function CollectibleTabs({ compact }: { compact?: boolean } = {}) {
  const loc = useLocation();
  const active = activeTabFor(loc.pathname);
  const counts = staticTabCounts();
  const bankTotal = useBankTotal();

  return (
    <nav className="clb-tabs flex items-center gap-2" aria-label="Sections">
      {COLLECTIBLE_TABS.map((tab) => {
        const on = tab.id === active;
        const count = tab.id === 'bank' ? bankTotal : counts[tab.id as Exclude<CollectibleTabId, 'bank'>];
        return (
          <Link
            key={tab.id}
            to={tab.to}
            aria-current={on ? 'page' : undefined}
            className={`clb-tab${on ? ' clb-tab-on' : ''}${compact ? ' clb-tab-compact' : ''} flex items-center gap-2 shrink-0`}
          >
            <IconSvg d={tab.icon} size={18} />
            <span className="text-[14.5px] font-extrabold">{tab.label}</span>
            {/* Counts are dropped in compact mode. With them the four tabs
                measure 547px against a 390px phone viewport, so the row has
                to be swiped to reach Lab; without them it fits. The figures
                are still on the desktop bar and in each section header. */}
            {!compact && count != null && <span className="clb-num text-[11px] font-bold">{fmt(count)}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

/** Mobile section header — frames 3b/3c/3d.
 *
 *  The source puts the mark, the section title and a badge in the SAME
 *  coloured band as the sub-tab rail, not in a bar above it, so this
 *  renders both. Desktop keeps the header's tab band instead; this is the
 *  mobile equivalent of the row AppHeader draws at lg and up.
 *
 *  The badge reads real data — chapters/apps/labs counted at render, and
 *  Bank's question total from the API — for the same reason the tab counts
 *  do. The source's badges ("21 chapters", "18 apps") are illustrative. */
export function CollectibleSectionHeader({ subTabsOnly }: { subTabsOnly?: boolean } = {}) {
  const loc = useLocation();
  const active = activeTabFor(loc.pathname);
  const tab = COLLECTIBLE_TABS.find((t) => t.id === active);
  const counts = staticTabCounts();
  const bankTotal = useBankTotal();
  if (!tab) return null;

  // On /map the primary tab strip is already on screen with Atlas lit, so
  // the title row would repeat it — 41px of a phone viewport that the map
  // itself should have.
  if (subTabsOnly) {
    return (
      <div className="clb-section" data-tab={tab.id}>
        <CollectibleSubTabs inSection />
      </div>
    );
  }

  const badge =
    tab.id === 'bank'
      ? bankTotal != null ? `${fmt(bankTotal)} questions` : null
      : tab.id === 'atlas'
        ? `${counts.atlas} chapters`
        : tab.id === 'guides'
          ? `${counts.guides} apps`
          : `${counts.lab} labs`;

  return (
    <div className="clb-section" data-tab={tab.id}>
      <div className="flex items-center gap-2.5 px-4 pb-3">
        <Link to="/" aria-label="Home" className="clb-section-mark shrink-0" />
        <span className="flex-1 min-w-0 text-[19px] font-extrabold tracking-[-0.02em] truncate">{tab.label}</span>
        {badge && <span className="clb-chip shrink-0">{badge}</span>}
      </div>
      <CollectibleSubTabs inSection />
    </div>
  );
}

/** The active tab's sub-tab rail — frame 3b/3c's row of tabs sitting on the
 *  band, notched into the content below (no bottom border). Renders nothing
 *  for a tab that has no sub-tabs, which is Guides by design. */
export function CollectibleSubTabs({ inSection }: { inSection?: boolean } = {}) {
  const loc = useLocation();
  const active = activeTabFor(loc.pathname);
  const tab = COLLECTIBLE_TABS.find((t) => t.id === active);
  if (!tab || tab.subTabs.length === 0) return null;

  return (
    /* Inside a section header the band is already painted and padded by
       .clb-section, so the rail must not repeat the background or the
       bottom rule — it would draw a second ink line mid-band. */
    <div
      className={`clb-subtabs${inSection ? ' clb-subtabs-bare px-4' : ' px-6'} flex items-end gap-1.5`}
      data-tab={inSection ? undefined : tab.id}
      aria-label={`${tab.label} sections`}
    >
      {tab.subTabs.map((sub) => {
        const on = loc.pathname === sub.to || loc.pathname.startsWith(`${sub.to}/`);
        return (
          <Link
            key={sub.to}
            to={sub.to}
            aria-current={on ? 'page' : undefined}
            className={`clb-subtab${on ? ' clb-subtab-on' : ''} whitespace-nowrap`}
          >
            {sub.label}
          </Link>
        );
      })}
    </div>
  );
}
