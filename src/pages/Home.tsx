import { Link } from 'react-router-dom';
import { useApp } from '@/lib/store';
import { modules, type ModuleCategory } from '@/modules/registry';
import { getChapter } from '@/data';
import { moduleProgress } from '@/lib/stats';
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

const CATEGORY_ORDER: ModuleCategory[] = ['Study', 'Practice'];

function moduleHref(m: (typeof modules)[number]) {
  return m.kind === 'static' ? `/embed/${m.id}` : m.path;
}

function ModuleLink({ m, children, className, style }: { m: (typeof modules)[number]; children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
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

export function Home() {
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
