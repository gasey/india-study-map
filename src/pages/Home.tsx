import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/store';
import { modules, type ModuleCategory } from '@/modules/registry';
import { getChapter } from '@/data';
import { moduleProgress, quizAccuracy, studyStreak, flashcardsRemaining } from '@/lib/stats';
import { weakTopics } from '@/lib/weakTopics';
import { levelInfo } from '@/lib/xp';
import { listResumableAttempts } from '@/modules/mpsc/useAttemptState';
import { pyStages } from '@/data/python/lessons';
import { pgStages } from '@/data/postgres/lessons';
import { nihongoStages } from '@/data/nihongo/course';
import { IC, IconSvg } from '@/components/shell/icons';
import { DailyLearningReset } from '@/components/mindset/DailyLearningReset';

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

// ============================================
// TODAY'S PLAN — ported from the redesign prototype's hero
// (Jabreeze - Redesign.dc.html, the "planSteps" sc-for block), ~line 18800.
// Every step is real: weakest topic, a resumable sitting, flashcards due.
// Fewer than 3 real items just means fewer cards — nothing here is padded
// with invented steps, and the "built from your last N days" line only
// claims what quizAccuracy(..., 7) actually computed.
// ============================================
interface PlanStep {
  n: number;
  label: string;
  meta: string;
  tag: string;
  color: string;
  to: string;
}

function TodaysPlanHero() {
  const navigate = useNavigate();
  const { progress, bankProgress, deckProgress } = useApp();
  const topics = weakTopics(progress, bankProgress, 1);
  const resumable = listResumableAttempts();
  const cardsDue = flashcardsRemaining(deckProgress);
  const weekAccuracy = quizAccuracy(progress, bankProgress, 7);

  const steps: PlanStep[] = [];
  if (topics.length > 0) {
    steps.push({ n: steps.length + 1, label: `Drill ${topics[0].label}`, meta: `${topics[0].accuracy}% accuracy`, tag: 'WEAK', color: 'var(--bad)', to: '/question-bank' });
  }
  if (resumable.length > 0) {
    const r = resumable[0];
    steps.push({ n: steps.length + 1, label: 'Resume your paused test', meta: `${r.answered} of ${r.total} answered`, tag: 'DRILL', color: 'var(--accent)', to: '/tests' });
  }
  if (cardsDue > 0) {
    steps.push({ n: steps.length + 1, label: 'Flashcards due', meta: `${cardsDue} cards`, tag: 'RECALL', color: 'var(--forest)', to: '/flashcards' });
  }

  const totalMin = steps.length * 15;

  if (steps.length === 0) {
    return (
      <div className="rounded-2xl p-5 flex items-center" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Answer a few questions anywhere in the app and your plan for today will build itself here.
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative rounded-2xl p-5 flex flex-col gap-4 overflow-hidden"
      style={{
        background: 'linear-gradient(148deg, color-mix(in srgb, var(--accent) 34%, var(--bg-panel)) 0%, color-mix(in srgb, var(--indigo, var(--accent)) 22%, var(--bg-panel)) 52%, var(--bg-panel) 100%)',
        border: '1px solid color-mix(in srgb, var(--accent) 36%, transparent)',
        boxShadow: '0 18px 44px -22px color-mix(in srgb, var(--accent) 60%, transparent)',
      }}
    >
      <div className="relative flex items-start gap-3.5">
        <div className="flex-1 min-w-0">
          <div className="font-mono text-[10px] tracking-wider uppercase mb-1.5" style={{ color: 'var(--accent)' }}>Today's plan · ~{totalMin} min</div>
          <div className="text-[19px] font-semibold tracking-tight mb-1">{steps[0].label}</div>
          {weekAccuracy !== null && (
            <div className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>Built from your last 7 days: {weekAccuracy}% accuracy overall.</div>
          )}
        </div>
        <button
          onClick={() => navigate(steps[0].to)}
          className="px-4 py-2 rounded-lg text-[13px] font-semibold shrink-0"
          style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}
        >
          Start session
        </button>
      </div>
      <div className="relative flex flex-col gap-2">
        {steps.map((p) => (
          <div
            key={p.n}
            onClick={() => navigate(p.to)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] cursor-pointer"
            style={{ background: 'color-mix(in srgb, var(--bg-panel) 82%, transparent)', border: '1px solid color-mix(in srgb, var(--text-primary) 8%, transparent)' }}
          >
            <span className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" style={{ border: `1px solid ${p.color}`, color: p.color }}>{p.n}</span>
            <span className="text-[13px] font-medium flex-1 min-w-0 truncate">{p.label}</span>
            <span className="font-mono text-[11px] whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>{p.meta}</span>
            <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded" style={{ letterSpacing: '0.04em', color: p.color, border: `1px solid ${p.color}` }}>{p.tag}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Level/XP card + the 2 real stat tiles beneath it — ported from the
 *  prototype's "xpStats" block. No rank tile: see lib/xp.ts and the
 *  Home-redesign plan for why (needs seeing other users' data, deferred). */
function LevelCard() {
  const { progress, bankProgress, arena } = useApp();
  const streak = studyStreak(progress, bankProgress);
  const accuracy = quizAccuracy(progress, bankProgress, 30);
  const lvl = levelInfo(progress, bankProgress, arena);
  return (
    <div className="rounded-xl p-4" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
      <div className="flex items-baseline justify-between mb-3.5">
        <span className="font-mono text-[10px] tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>Level {lvl.level} · {lvl.title}</span>
        <span className="font-mono text-[11px]" style={{ color: 'var(--text-secondary)' }}>{lvl.xpIntoLevel} / {lvl.xpForNextLevel} XP</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden mb-4" style={{ background: 'var(--border)' }}>
        <div className="h-full rounded-full" style={{ width: `${(lvl.xpIntoLevel / lvl.xpForNextLevel) * 100}%`, background: 'var(--accent)' }} />
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <div className="text-lg font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>{streak}</div>
          <div className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Day streak</div>
        </div>
        <div>
          <div className="text-lg font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>{accuracy ?? '—'}{accuracy !== null && '%'}</div>
          <div className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>30-day accuracy</div>
        </div>
      </div>
    </div>
  );
}

/** Real per-topic accuracy from actual attempt history — see lib/weakTopics.ts.
 *  A topic only shows once it has enough attempts to mean something
 *  (MIN_ATTEMPTS in weakTopics.ts). */
function WeakTopicsPanel() {
  const { progress, bankProgress } = useApp();
  const topics = weakTopics(progress, bankProgress);
  if (topics.length === 0) return null;
  return (
    <div className="rounded-xl p-4 flex-1" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
      <div className="font-mono text-[10px] tracking-wider uppercase mb-3" style={{ color: 'var(--text-muted)' }}>Weakest topics</div>
      <div className="flex flex-col gap-2.5">
        {topics.map((t) => (
          <div key={t.key} className="grid gap-2.5 items-center" style={{ gridTemplateColumns: 'minmax(0,1fr) 64px 38px' }}>
            <span className="text-xs truncate" style={{ color: 'var(--text-primary)' }}>{t.label}</span>
            <span className="h-1.5 rounded-full overflow-hidden block" style={{ background: 'var(--border)' }}>
              <span className="block h-full" style={{ width: `${t.accuracy}%`, background: t.accuracy < 50 ? 'var(--bad)' : t.accuracy < 70 ? 'var(--warn)' : 'var(--ok)' }} />
            </span>
            <span className="font-mono text-[11px] text-right" style={{ color: 'var(--text-secondary)' }}>{t.accuracy}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// JUMP BACK IN — ported from the prototype's "resumeCards" block. 5 real
// surfaces: paused test, Python (pythonLastStage store field), Postgres
// (postgresLastStage, same idea), Games, Study Map. Deliberately no
// "saved Question Bank filter" card — no filter-persistence exists to
// back it honestly; adding one just for this card would be inventing
// state to match a screenshot.
// ============================================
interface ResumeCard { kicker: string; title: string; meta: string; color: string; to: string }

function JumpBackInGrid() {
  const { currentChapterId, progress, arena, pythonLastStage, postgresLastStage, nihongoCourseLastStage } = useApp();
  const cards: ResumeCard[] = [];

  const resumable = listResumableAttempts();
  if (resumable.length > 0) {
    const r = resumable[0];
    cards.push({ kicker: 'Mock test · paused', title: 'Continue your sitting', meta: `${r.answered} of ${r.total} answered`, color: 'var(--warn)', to: '/tests' });
  }

  const chapter = getChapter(currentChapterId);
  if (chapter) {
    const attempted = Object.keys(progress[chapter.id]?.attempts ?? {}).length;
    cards.push({ kicker: 'Study Map', title: chapter.title, meta: chapter.quiz.length > 0 ? `${attempted} of ${chapter.quiz.length} quiz questions attempted` : `${chapter.facts.length} facts`, color: 'var(--blue)', to: '/map' });
  }

  if (pythonLastStage) {
    const stage = pyStages.find((s) => s.id === pythonLastStage);
    if (stage) cards.push({ kicker: 'Python', title: stage.title, meta: 'Continue this stage', color: 'var(--forest)', to: '/code' });
  }

  if (postgresLastStage) {
    const stage = pgStages.find((s) => s.id === postgresLastStage);
    if (stage) cards.push({ kicker: 'Postgres', title: stage.title, meta: 'Continue this stage', color: 'var(--forest)', to: '/postgres' });
  }

  if (nihongoCourseLastStage) {
    const stage = nihongoStages.find((s) => s.id === nihongoCourseLastStage);
    if (stage) cards.push({ kicker: 'Nihongo', title: stage.title, meta: 'Continue this stage', color: 'var(--forest)', to: '/nihongo' });
  }

  if (arena.runs > 0) {
    cards.push({ kicker: 'Games', title: 'Gauntlet Run', meta: `Best ${arena.highScore.toLocaleString()} · 🪙 ${arena.coins}`, color: 'var(--indigo)', to: '/games' });
  }

  if (cards.length === 0) return null;

  return (
    <div>
      <SectionLabel>Jump back in</SectionLabel>
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
        {cards.map((c) => (
          <Link
            key={c.kicker}
            to={c.to}
            className="rounded-xl px-4 py-3.5 flex flex-col gap-1.5"
            style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}
          >
            <span className="font-mono text-[9px] tracking-wider uppercase" style={{ color: c.color }}>{c.kicker}</span>
            <span className="text-[13px] font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{c.title}</span>
            <span className="text-[11px] leading-snug" style={{ color: 'var(--text-secondary)' }}>{c.meta}</span>
          </Link>
        ))}
      </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
        <DailyLearningReset />
        <div className="grid gap-4 grid-cols-1 lg:[grid-template-columns:minmax(0,1.55fr)_minmax(0,1fr)]">
          <TodaysPlanHero />
          <div className="flex flex-col gap-4">
            <LevelCard />
            <WeakTopicsPanel />
          </div>
        </div>
        <JumpBackInGrid />
        <ModuleGroupedCards />
      </div>
    </div>
  );
}
