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
//  - 'static' → a standalone HTML file served from /public,
//               opened in-app via /embed/:id (see EmbedPage.tsx) —
//               never target="_blank", it has its own chrome but
//               stays inside this shell.
//
// category/subgroup drive the Study ▾ / Practice ▾ nav dropdowns
// (ModuleGroupMenu) and the mobile ModuleSwitcher pill. Study is a
// flat list; Practice is grouped by subgroup, in this fixed order:
// In-app modules, Exam guides, Labs, Quick practice (one-offs).
// ============================================

export type ModuleCategory = 'Study' | 'Practice';
export type PracticeSubgroup = 'In-app modules' | 'Exam guides' | 'Labs' | 'Quick practice (one-offs)';

export interface AppModule {
  id: string;
  title: string;
  /** Switcher menu group. */
  category: ModuleCategory;
  /** Practice-only sub-grouping — ignored for Study items. */
  subgroup?: PracticeSubgroup;
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
  // ---- Study ----
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
    id: 'chronicle',
    title: 'Chronicle Timeline',
    category: 'Study',
    tagline: 'Master timeline — history & polity, Indus Valley to today',
    glyph: '⏳',
    kind: 'route',
    path: '/timeline',
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
    id: 'codex',
    title: 'Polity Codex',
    category: 'Study',
    tagline: 'Full polity study guide — notes, mock test, flashcards',
    glyph: '📜',
    kind: 'static',
    path: '/codex/index.html',
  },
  {
    id: 'study-mindset',
    title: 'The Comfort Trap',
    category: 'Study',
    tagline: 'Why confusion feels unbearable, and how to sit with it',
    glyph: '🧭',
    kind: 'static',
    path: '/study-mindset/index.html',
  },
  {
    id: 'mindset',
    title: 'Return to Peace',
    category: 'Study',
    tagline: 'Daily reset, a 2-minute Sit-With-It practice, your confusion map',
    glyph: '🌿',
    kind: 'route',
    path: '/mindset',
  },
  {
    id: 'nihongo-lab',
    title: 'Nihongo Lab',
    category: 'Study',
    tagline: 'Personal Japanese study desk — grammar course, kanji, SRS, games',
    glyph: '🈂️',
    kind: 'static',
    path: '/nihongo-lab/index.html',
  },

  // ---- Practice: In-app modules ----
  {
    id: 'pyq',
    title: 'PYQ Practice',
    category: 'Practice',
    subgroup: 'In-app modules',
    tagline: 'Question banks — filter by subject, topic, difficulty',
    glyph: '📝',
    kind: 'route',
    path: '/pyq',
  },
  {
    id: 'flashcards',
    title: 'Flashcards',
    category: 'Practice',
    subgroup: 'In-app modules',
    tagline: 'Rapid recall — flip, mark Known or Review',
    glyph: '🃏',
    kind: 'route',
    path: '/flashcards',
  },
  {
    id: 'arena',
    title: 'Gauntlet Run',
    category: 'Practice',
    subgroup: 'In-app modules',
    tagline: 'Dodge runner — MCQ gates, revives & upgrades earned by knowledge',
    glyph: '🏃',
    kind: 'route',
    path: '/arena',
  },
  {
    id: 'mpsc',
    title: 'MPSC Old Questions',
    category: 'Practice',
    subgroup: 'In-app modules',
    tagline: 'Real Mizoram PSC papers — browse by exam/year, take timed MCQ tests',
    glyph: '🏛️',
    kind: 'route',
    path: '/mpsc',
  },
  {
    id: 'state-tax-officer',
    title: 'State Tax Officer',
    category: 'Practice',
    subgroup: 'In-app modules',
    tagline: 'Group B Gazetted — primers, question bank, full mock tests',
    glyph: '🎯',
    kind: 'route',
    path: '/state-tax-officer',
  },
  {
    id: 'ca',
    title: 'Current Affairs',
    category: 'Practice',
    subgroup: 'In-app modules',
    tagline: 'Daily MCQ quiz — summary, key facts, topic breakdown',
    glyph: '📰',
    kind: 'route',
    path: '/current-affairs',
  },

  // ---- Practice: Exam guides ----
  {
    id: 'jso',
    title: 'MPSC JSO — Cyber Forensic',
    category: 'Practice',
    subgroup: 'Exam guides',
    tagline: '49 units, 543 questions — Browse / Test / Exam Plan modes',
    glyph: '🕵️',
    kind: 'static',
    path: '/mpsc-jso-prep/index.html',
  },
  {
    id: 'system-analyst',
    title: 'MPSC System Analyst',
    category: 'Practice',
    subgroup: 'Exam guides',
    tagline: '727 concepts, 662 questions — Study guide, Daily test, Mock test',
    glyph: '🖥️',
    kind: 'static',
    path: '/mpsc-system-analyst/index.html',
  },

  // ---- Practice: Labs ----
  {
    id: 'lab-maths',
    title: 'Aptitude Hub',
    category: 'Practice',
    subgroup: 'Labs',
    tagline: 'Maths & reasoning — MPSC 2025-pattern questions',
    glyph: '🔢',
    kind: 'static',
    path: '/labs/maths/index.html',
  },
  {
    id: 'lab-english',
    title: 'General English',
    category: 'Practice',
    subgroup: 'Labs',
    tagline: 'MCQ masterclass — MPSC old questions',
    glyph: '🔤',
    kind: 'static',
    path: '/labs/english/index.html',
  },
  {
    id: 'lab-paper2',
    title: 'Paper-II Lab',
    category: 'Practice',
    subgroup: 'Labs',
    tagline: 'Arithmetic & reasoning drills',
    glyph: '🧮',
    kind: 'static',
    path: '/labs/paper2/index.html',
  },

  // ---- Practice: Quick practice (one-offs) ----
  {
    id: 'essay',
    title: 'Essay Practice',
    category: 'Practice',
    subgroup: 'Quick practice (one-offs)',
    tagline: 'Descriptive writing bank',
    glyph: '✍️',
    kind: 'static',
    path: '/quick-practice/essay.html',
  },
  {
    id: 'jao-gk',
    title: 'JAO Paper 2 — GK',
    category: 'Practice',
    subgroup: 'Quick practice (one-offs)',
    tagline: 'General knowledge drill',
    glyph: '📘',
    kind: 'static',
    path: '/quick-practice/jao-paper2-gk.html',
  },
  {
    id: 'may-2026-ca',
    title: 'May 2026 Current Affairs',
    category: 'Practice',
    subgroup: 'Quick practice (one-offs)',
    tagline: 'One-liners',
    glyph: '🗓️',
    kind: 'static',
    path: '/quick-practice/may-2026-current-affairs.html',
  },
  {
    id: 'mizoram-ca',
    title: 'Mizoram Current Affairs Quiz',
    category: 'Practice',
    subgroup: 'Quick practice (one-offs)',
    tagline: 'May 2026 quiz',
    glyph: '📰',
    kind: 'static',
    path: '/quick-practice/mizoram-current-affairs-quiz.html',
  },
  {
    id: 'eng-mcq-masterclass',
    title: 'English MCQ Masterclass',
    category: 'Practice',
    subgroup: 'Quick practice (one-offs)',
    tagline: 'MCQ drill set',
    glyph: '🔤',
    kind: 'static',
    path: '/quick-practice/mpsc-english-mcq-masterclass.html',
  },
  {
    id: 'mpsc-practice-qs',
    title: 'MPSC Practice Questions',
    category: 'Practice',
    subgroup: 'Quick practice (one-offs)',
    tagline: 'Mixed practice',
    glyph: '📄',
    kind: 'static',
    path: '/quick-practice/mpsc-practice-questions.html',
  },
  {
    id: 'tenses-voice',
    title: 'Tenses & Voice',
    category: 'Practice',
    subgroup: 'Quick practice (one-offs)',
    tagline: 'Grammar drill',
    glyph: '🔤',
    kind: 'static',
    path: '/quick-practice/tenses-and-voice.html',
  },
  {
    id: 'mpsc-mcq-practice-hub',
    title: 'MPSC MCQ Practice Hub',
    category: 'Practice',
    subgroup: 'Quick practice (one-offs)',
    tagline: 'Mixed MCQ practice',
    glyph: '📄',
    kind: 'static',
    path: '/quick-practice/mpsc-mcq-practice-hub.html',
  },
];
