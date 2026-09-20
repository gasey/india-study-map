import { IC } from './icons';
import { chapters } from '@/data';
import { modules } from '@/modules/registry';

// ============================================
// COLLECTIBLE SHELL — four tabs, two levels
//
// Ported from `Study OS v3 bright.dc.html` (frames 3a–3e), whose whole
// navigation is four tabs: Bank, Atlas, Guides, Lab. The eight-item rail
// plus its More flyout collapses into this.
//
// Four tabs cannot reach twenty routes on their own, and the source knows
// that — its Bank frame carries a sub-tab rail (Questions / Tests / Papers
// / Recall) and its Atlas frame carries (Map / Chronicle). So this is a
// TWO-level structure, and every route the rail used to reach is still
// reachable: as a tab, as a sub-tab, or from the Guides list.
//
// ⚠️ COUNTS ARE DERIVED, NEVER COPIED FROM THE DESIGN.
// The source's frames show 76,093 / 21 / 18 / 7. Those are illustrative —
// the design file is static, and its author said so explicitly. Copying
// them would put four numbers on screen that are right only by accident
// and silently wrong the moment a chapter or module is added. Atlas,
// Guides and Lab count real arrays at render time; Bank asks the API for
// its real total and shows no count until it answers, rather than
// guessing. See CLAUDE.md on why a wrong number here is not cosmetic.
// ============================================

export type CollectibleTabId = 'bank' | 'atlas' | 'guides' | 'lab';

export interface SubTab {
  label: string;
  to: string;
}

export interface CollectibleTab {
  id: CollectibleTabId;
  label: string;
  icon: string;
  /** Route the tab itself opens — always its first sub-tab where it has any. */
  to: string;
  subTabs: SubTab[];
  /** Every route that should light this tab up, including ones not shown
   *  as a sub-tab (e.g. /mpsc, an alias for the bank). */
  match: string[];
}

export const COLLECTIBLE_TABS: CollectibleTab[] = [
  {
    id: 'bank',
    label: 'Bank',
    icon: IC.qbank,
    to: '/question-bank',
    subTabs: [
      { label: 'Questions', to: '/question-bank' },
      { label: 'Tests', to: '/tests' },
      { label: 'Papers', to: '/papers' },
      { label: 'Recall', to: '/recall' },
    ],
    // /mpsc is a working alias for the bank and /flashcards is where Recall
    // sends you — both belong to this tab even though neither is a sub-tab.
    match: ['/question-bank', '/tests', '/papers', '/recall', '/mpsc', '/flashcards', '/state-tax-officer', '/pyq', '/arena'],
  },
  {
    id: 'atlas',
    label: 'Atlas',
    icon: IC.map,
    to: '/map',
    subTabs: [
      { label: 'Map', to: '/map' },
      { label: 'Chronicle', to: '/timeline' },
      // Mind Maps has to be a real sub-tab, not just a `match`: dropping the
      // mobile More sheet and the per-page ModuleSwitcher left this route
      // with no navigation to it at all except a typed URL.
      { label: 'Mind Maps', to: '/mindmaps' },
    ],
    match: ['/map', '/timeline', '/mindmaps'],
  },
  {
    id: 'guides',
    label: 'Guides',
    icon: IC.codex,
    to: '/library',
    // The source's Guides frame is one grouped list, not a sub-tab rail.
    subTabs: [],
    match: ['/library', '/embed'],
  },
  {
    id: 'lab',
    label: 'Lab',
    icon: IC.code,
    to: '/code',
    subTabs: [
      { label: 'Python', to: '/code' },
      { label: 'Postgres', to: '/postgres' },
      { label: 'Nihongo', to: '/nihongo' },
      { label: 'Games', to: '/games' },
    ],
    match: ['/code', '/postgres', '/nihongo', '/games'],
  },
];

/** Locally-derivable counts. `bank` is absent on purpose — only the API
 *  knows it, so CollectibleTabBar fills it in once the request lands. */
export function staticTabCounts(): Partial<Record<CollectibleTabId, number>> {
  return {
    atlas: chapters.length,
    // The standalone guide apps the Guides list actually offers.
    guides: modules.filter((m) => m.kind === 'static').length,
    lab: COLLECTIBLE_TABS.find((t) => t.id === 'lab')!.subTabs.length,
  };
}

export function activeTabFor(pathname: string): CollectibleTabId | null {
  for (const tab of COLLECTIBLE_TABS) {
    if (tab.match.some((m) => pathname === m || pathname.startsWith(`${m}/`))) return tab.id;
  }
  return null;
}
