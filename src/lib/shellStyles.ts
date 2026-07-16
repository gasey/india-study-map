import type { ShellStyle } from './store';

/**
 * Config for each of the four redesign directions (Claude Design handoff,
 * "Redesign for modern UX and scalability"). Applied by AppShell + the
 * Study Map screen to arrange rail/topbar/panels differently, while every
 * variant reuses the same underlying pages and data.
 *
 * Desktop-only distinctions — on mobile every style collapses to the same
 * drawer + bottom-sheet chrome the app already used.
 */
export interface ShellConfig {
  id: ShellStyle;
  label: string;
  blurb: string;
  /** Chrome on Home + every non-Map module page. */
  home: {
    chrome: 'rail' | 'topbar' | 'none';
  };
  /** Chrome on the Study Map screen specifically. */
  map: {
    rail: boolean;
    /** Top bar carrying a breadcrumb + nav (Command Deck only). */
    topBar: boolean;
    leftPanel: 'docked' | 'docked-tree' | 'floating';
    rightPanel: 'docked' | 'floating';
    /** Floating breadcrumb + mode pill overlaid on the map (no docked chrome above it). */
    breadcrumbOverlay: boolean;
  };
}

export const SHELL_STYLES: Record<ShellStyle, ShellConfig> = {
  '1a': {
    id: '1a',
    label: 'Rail & Launcher',
    blurb: 'Icon rail scales to any number of modules; docked chapter tree and facts/quiz columns.',
    home: { chrome: 'rail' },
    map: { rail: true, topBar: false, leftPanel: 'docked', rightPanel: 'docked', breadcrumbOverlay: false },
  },
  '1b': {
    id: '1b',
    label: 'Command Deck',
    blurb: 'Top nav + search bar; map gets full width, chapter tree collapses into groups.',
    home: { chrome: 'topbar' },
    map: { rail: false, topBar: true, leftPanel: 'docked-tree', rightPanel: 'docked', breadcrumbOverlay: false },
  },
  '1c': {
    id: '1c',
    label: 'Focus Atlas',
    blurb: 'Map-first, everything floats — Home is a centered launcher with no persistent chrome at all.',
    home: { chrome: 'none' },
    map: { rail: false, topBar: false, leftPanel: 'floating', rightPanel: 'floating', breadcrumbOverlay: true },
  },
  '2a': {
    id: '2a',
    label: 'Unified Rail',
    blurb: 'One rail, every content type as a tab — the refined pick. Docked chapter tree and facts/quiz columns.',
    home: { chrome: 'rail' },
    map: { rail: true, topBar: false, leftPanel: 'docked', rightPanel: 'docked', breadcrumbOverlay: false },
  },
};

export const SHELL_STYLE_ORDER: ShellStyle[] = ['2a', '1a', '1b', '1c'];
