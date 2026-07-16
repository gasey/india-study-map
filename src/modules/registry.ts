// ============================================
// MODULE REGISTRY
//
// Jabreeze is a shell of modules. The map is one module;
// PYQ practice is another; the Polity Codex static guide
// is a third. Adding a future page (mock tests, flashcards,
// current affairs, notes…) = one entry here + one lazy
// component (or a static file in /public).
//
// kind:
//  - 'route'  → an in-app React page, code-split via lazy()
//  - 'static' → a standalone HTML file served from /public
//               (drop-in pages like the Polity Codex guide)
// ============================================

export type ModuleCategory = 'Study' | 'Practice' | 'Labs';

export interface AppModule {
  id: string;
  title: string;
  /** Switcher menu group. */
  category: ModuleCategory;
  /** One-liner for the switcher menu. */
  tagline: string;
  /** Emoji glyph for the switcher. */
  glyph: string;
  kind: 'route' | 'static';
  /** Route path ('/pyq') or static href ('/codex/index.html'). */
  path: string;
  /** Grey out + "soon" badge without removing from the menu. */
  comingSoon?: boolean;
}

export const modules: AppModule[] = [
  {
    id: 'map',
    title: 'Study Map',
    category: 'Study',
    tagline: 'Interactive chapters — geography, history, polity',
    glyph: '🗺️',
    kind: 'route',
    path: '/map',
  },
  {
    id: 'pyq',
    title: 'PYQ Practice',
    category: 'Practice',
    tagline: 'Question banks — filter by subject, topic, difficulty',
    glyph: '📝',
    kind: 'route',
    path: '/pyq',
  },
  {
    id: 'codex',
    title: 'Polity Codex',
    category: 'Study',
    tagline: 'Full polity study guide — notes, mock test, flashcards',
    glyph: '📜',
    kind: 'static',
    path: '/codex/index.html',
  },
  {
    id: 'flashcards',
    title: 'Flashcards',
    category: 'Practice',
    tagline: 'Rapid recall — flip, mark Known or Review',
    glyph: '🃏',
    kind: 'route',
    path: '/flashcards',
  },
  {
    id: 'mindmaps',
    title: 'Mind Maps',
    category: 'Study',
    tagline: 'Topics as collapsible trees — click through to the map',
    glyph: '🧠',
    kind: 'route',
    path: '/mindmaps',
  },
  {
    id: 'lab-maths',
    title: 'Aptitude Hub',
    category: 'Labs',
    tagline: 'Maths & reasoning — MPSC 2025-pattern questions',
    glyph: '🔢',
    kind: 'static',
    path: '/labs/maths/index.html',
  },
  {
    id: 'lab-english',
    title: 'General English',
    category: 'Labs',
    tagline: 'MCQ masterclass — MPSC old questions',
    glyph: '🔤',
    kind: 'static',
    path: '/labs/english/index.html',
  },
  {
    id: 'lab-paper2',
    title: 'Paper-II Lab',
    category: 'Labs',
    tagline: 'Arithmetic & reasoning drills',
    glyph: '🧮',
    kind: 'static',
    path: '/labs/paper2/index.html',
  },
  // Future examples — flip comingSoon off when built:
  // { id: 'ca', title: 'Current Affairs', tagline: 'Monthly CA digests + quizzes', glyph: '📰', kind: 'route', path: '/current-affairs', comingSoon: true },
];
