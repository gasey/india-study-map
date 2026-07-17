import { Link } from 'react-router-dom';
import { useApp } from '@/lib/store';
import { modules, type ModuleCategory } from '@/modules/registry';
import { getChapter } from '@/data';
import { SHELL_STYLES } from '@/lib/shellStyles';
import { chapterCompletion, quizAccuracy, flashcardsRemaining, studyStreak, moduleProgress } from '@/lib/stats';
import { IC, IconSvg } from '@/components/shell/icons';

const MODULE_ICON: Record<string, string> = {
  map: IC.map,
  pyq: IC.pyq,
  codex: IC.codex,
  flashcards: IC.cards,
  mindmaps: IC.mind,
  chronicle: IC.chronicle,
  'lab-maths': IC.labs,
  'lab-english': IC.labs,
  'lab-paper2': IC.labs,
};

const CATEGORY_ORDER: ModuleCategory[] = ['Study', 'Practice', 'Labs'];

function moduleHref(m: (typeof modules)[number]) {
  return m.path;
}

function ModuleLink({ m, children, className, style }: { m: (typeof modules)[number]; children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  if (m.kind === 'static') {
    return (
      <a href={m.path} target="_blank" rel="noopener" className={className} style={style}>
        {children}
      </a>
    );
  }
  return (
    <Link to={moduleHref(m)} className={className} style={style}>
      {children}
    </Link>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3.5 mb-3">
      <span className="text-[11px] tracking-wider uppercase font-medium shrink-0" style={{ color: 'var(--text-secondary)' }}>
        {children}
      </span>
      <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
    </div>
  );
}

function Ring({ pct, size = 18 }: { pct: number; size?: number }) {
  const r = 6;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox="0 0 16 16">
      <circle cx={8} cy={8} r={r} fill="none" stroke="var(--border)" strokeWidth={2} />
      <circle
        cx={8}
        cy={8}
        r={r}
        fill="none"
        stroke={pct >= 100 ? '#2e8a5f' : 'var(--accent)'}
        strokeWidth={2}
        strokeDasharray={`${(c * pct) / 100} ${c}`}
        transform="rotate(-90 8 8)"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GreetingHeader({ compact }: { compact?: boolean }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const date = new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
  if (compact) {
    return <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{date}</span>;
  }
  return (
    <div>
      <div className="text-[11px] tracking-wider uppercase font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>{date}</div>
      <h1 className="text-3xl font-medium tracking-tight" style={{ color: 'var(--text-primary)' }}>{greeting}</h1>
    </div>
  );
}

/** Single wide "continue where you left off" banner — used by 1a / 2a. */
function ResumeBanner() {
  const { currentChapterId, progress } = useApp();
  const chapter = getChapter(currentChapterId);
  if (!chapter) return null;
  const attempted = Object.keys(progress[chapter.id]?.attempts ?? {}).length;
  const pct = chapter.quiz.length > 0 ? Math.round((attempted / chapter.quiz.length) * 100) : 0;
  return (
    <div
      className="rounded-lg px-6 py-5 flex items-center gap-8"
      style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}
    >
      <div className="flex-1 min-w-0">
        <div className={`text-[11px] tracking-wider uppercase font-medium mb-1.5 subject-${chapter.subject}`} style={{ color: 'var(--subject)' }}>
          Continue · {chapter.subject[0].toUpperCase() + chapter.subject.slice(1)}
        </div>
        <div className="text-lg font-medium mb-2.5" style={{ color: 'var(--text-primary)' }}>{chapter.title}</div>
        <div className="flex items-center gap-3">
          <div className="w-56 h-[3px] rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
            <div className="h-full" style={{ width: `${pct}%`, background: 'var(--accent)' }} />
          </div>
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {chapter.quiz.length > 0 ? `${attempted} of ${chapter.quiz.length} questions attempted` : `${chapter.facts.length} facts`}
          </span>
        </div>
      </div>
      <Link
        to="/map"
        className="px-5 py-2 rounded-lg text-sm font-medium shrink-0"
        style={{ border: '1px solid var(--accent)', color: 'var(--accent)' }}
      >
        Resume
      </Link>
    </div>
  );
}

/** Three-card "jump back in" row — used by 1b / 1c. */
function ResumeGrid() {
  const { currentChapterId, progress, deckProgress } = useApp();
  const chapter = getChapter(currentChapterId);
  const remaining = flashcardsRemaining(deckProgress);
  const attempted = chapter ? Object.keys(progress[chapter.id]?.attempts ?? {}).length : 0;

  const cards = [
    chapter && {
      kicker: `${chapter.subject[0].toUpperCase() + chapter.subject.slice(1)} · quiz`,
      title: chapter.title,
      meta: chapter.quiz.length > 0 ? `${attempted} of ${chapter.quiz.length} questions attempted` : `${chapter.facts.length} facts`,
      to: '/map',
      color: '#2e8a5f',
    },
    {
      kicker: 'Flashcards',
      title: remaining > 0 ? `${remaining} cards to review` : 'All cards known',
      meta: 'Across every deck',
      to: '/flashcards',
      color: 'var(--accent)',
    },
    {
      kicker: 'PYQ Practice',
      title: 'Old questions',
      meta: 'Filter by subject, topic, difficulty',
      to: '/pyq',
      color: '#9c6f33',
    },
  ].filter(Boolean) as { kicker: string; title: string; meta: string; to: string; color: string }[];

  return (
    <div className="grid grid-cols-3 gap-3">
      {cards.map((c) => (
        <Link
          key={c.kicker}
          to={c.to}
          className="rounded-lg px-4 py-3.5 flex flex-col gap-1"
          style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}
        >
          <div className="text-[11px] tracking-wider uppercase font-medium" style={{ color: c.color }}>{c.kicker}</div>
          <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{c.title}</div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{c.meta}</div>
        </Link>
      ))}
    </div>
  );
}

function StatStrip() {
  const { progress, bankProgress, deckProgress } = useApp();
  const { completed, total } = chapterCompletion(progress);
  const accuracy = quizAccuracy(progress, bankProgress);
  const remaining = flashcardsRemaining(deckProgress);
  const streak = studyStreak(progress, bankProgress);
  const stats = [
    { value: `${completed} / ${total}`, label: 'chapters completed' },
    { value: accuracy === null ? '—' : `${accuracy}%`, label: 'quiz accuracy, 30 days' },
    { value: String(remaining), label: 'flashcards to review' },
    { value: streak > 0 ? `${streak} day${streak === 1 ? '' : 's'}` : '—', label: 'study streak' },
  ];
  return (
    <div className="grid grid-cols-4 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="rounded-lg px-5 py-4" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
          <div className="text-2xl font-medium tracking-tight mb-0.5" style={{ color: 'var(--text-primary)' }}>{s.value}</div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

/** Grouped cards by category — used by 1a / 2a. */
function ModuleGroupedCards() {
  const { progress, bankProgress, deckProgress } = useApp();
  const prog = moduleProgress(progress, bankProgress, deckProgress);
  return (
    <div className="flex flex-col gap-6">
      {CATEGORY_ORDER.map((cat) => {
        const group = modules.filter((m) => m.category === cat);
        if (group.length === 0) return null;
        return (
          <div key={cat}>
            <SectionLabel>{cat}</SectionLabel>
            <div className="grid grid-cols-3 gap-3">
              {group.map((m) => (
                <ModuleLink
                  key={m.id}
                  m={m}
                  className="rounded-lg px-4 py-4 flex flex-col gap-2"
                  style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}
                >
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'var(--accent)' }}><IconSvg d={MODULE_ICON[m.id] ?? IC.map} size={20} /></span>
                    <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{prog[m.id]?.meta}</span>
                  </div>
                  <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{m.title}</div>
                  <div className="text-xs leading-snug" style={{ color: 'var(--text-secondary)' }}>{m.tagline}</div>
                </ModuleLink>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Flat rows with a progress bar — used by 1b. */
function ModuleRows() {
  const { progress, bankProgress, deckProgress } = useApp();
  const prog = moduleProgress(progress, bankProgress, deckProgress);
  return (
    <div className="flex flex-col">
      {modules.map((m) => {
        const p = prog[m.id];
        return (
          <ModuleLink
            key={m.id}
            m={m}
            className="grid items-center gap-5 px-2 py-2.5 transition-colors"
            style={{ gridTemplateColumns: '220px 90px 1fr 60px', borderBottom: '1px solid var(--border)' }}
          >
            <span className="flex items-center gap-2.5">
              <span style={{ color: 'var(--accent)' }}><IconSvg d={MODULE_ICON[m.id] ?? IC.map} size={16} /></span>
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{m.title}</span>
            </span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full text-center" style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>{m.category}</span>
            <span className="h-[3px] rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
              {p?.pct != null && <span className="block h-full" style={{ width: `${p.pct}%`, background: 'var(--accent)' }} />}
            </span>
            <span className="text-xs text-right" style={{ color: 'var(--text-muted)' }}>{p?.meta}</span>
          </ModuleLink>
        );
      })}
    </div>
  );
}

/** 4-col grid with a completion ring — used by 1c. */
function ModuleRingGrid() {
  const { progress, bankProgress, deckProgress } = useApp();
  const prog = moduleProgress(progress, bankProgress, deckProgress);
  return (
    <div className="grid grid-cols-4 gap-3">
      {modules.map((m) => {
        const p = prog[m.id];
        return (
          <ModuleLink
            key={m.id}
            m={m}
            className="rounded-lg px-4 py-4 flex flex-col gap-2.5"
            style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center justify-between">
              <span style={{ color: 'var(--accent)' }}><IconSvg d={MODULE_ICON[m.id] ?? IC.map} size={20} /></span>
              {p?.pct != null && <Ring pct={p.pct} size={18} />}
            </div>
            <div>
              <div className="text-sm font-medium mb-0.5" style={{ color: 'var(--text-primary)' }}>{m.title}</div>
              <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{m.category} · {p?.meta}</div>
            </div>
          </ModuleLink>
        );
      })}
    </div>
  );
}

export function Home() {
  const shellStyle = useApp((s) => s.shellStyle);
  const cfg = SHELL_STYLES[shellStyle];

  if (cfg.home.chrome === 'none') {
    // 1c — Focus Atlas: centered, chrome-free launcher.
    return <HomeFocusAtlas />;
  }

  if (cfg.home.chrome === 'topbar') {
    // 1b — Command Deck: stat strip + flat module rows.
    return (
      <div className="h-full overflow-y-auto scroll-panel">
        <div className="max-w-[1180px] mx-auto px-8 py-9 flex flex-col gap-7">
          <GreetingHeader />
          <StatStrip />
          <div>
            <SectionLabel>Jump back in</SectionLabel>
            <ResumeGrid />
          </div>
          <div>
            <SectionLabel>All modules</SectionLabel>
            <ModuleRows />
          </div>
        </div>
      </div>
    );
  }

  // 1a / 2a — rail chrome: greeting + resume banner + grouped module cards.
  return (
    <div className="h-full overflow-y-auto scroll-panel">
      <div className="max-w-[1000px] mx-auto px-8 py-9 flex flex-col gap-6">
        <GreetingHeader />
        <ResumeBanner />
        <ModuleGroupedCards />
      </div>
    </div>
  );
}

function HomeFocusAtlas() {
  const { progress, bankProgress } = useApp();
  const streak = studyStreak(progress, bankProgress);
  return (
    <div className="h-full overflow-y-auto scroll-panel flex justify-center py-16 px-6">
      <div className="w-full max-w-[820px] flex flex-col gap-8">
        <div className="flex items-center gap-3.5">
          <div className="w-[34px] h-[34px] rounded-lg flex items-center justify-center shrink-0" style={{ border: '1px solid var(--accent)' }}>
            <div className="w-3 h-3 rounded-[2px] rotate-45" style={{ background: 'var(--accent)' }} />
          </div>
          <div>
            <div className="text-xl font-medium tracking-tight" style={{ color: 'var(--text-primary)' }}>Jabreeze</div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>MPSC prep · {modules.length} modules</div>
          </div>
          <div className="flex-1" />
          {streak > 0 && (
            <span className="text-[11px] px-2.5 py-1 rounded-full" style={{ border: '1px solid var(--accent-soft)', color: 'var(--accent)' }}>
              {streak}-day streak
            </span>
          )}
        </div>
        <div>
          <SectionLabel>Today's plan</SectionLabel>
          <ResumeGrid />
        </div>
        <div>
          <SectionLabel>Modules</SectionLabel>
          <ModuleRingGrid />
        </div>
      </div>
    </div>
  );
}
