import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/lib/store';
import { ModuleSwitcher } from '@/modules/ModuleSwitcher';
import { useHasDesktopChrome } from '@/lib/useShellChrome';
import type { BankQuestion, ExamPaper } from '@/data/banks/types';
import {
  useMpscData, filterQuestions, emptyFilters, ALL,
  type MpscFilters, type PaperWithQuestions, type Sitting,
} from './useMpscData';
import { TestRunner } from './TestRunner';
import { QuestionsTable } from './QuestionsTable';

// ============================================
// MPSC OLD QUESTIONS — module shell.
// Four flows: Library (browse real papers, grouped by exam sitting so
// Paper-I/II compare side by side), Browser (full-page searchable table),
// Practice (filtered drill), History (past test scores).
// A launched test takes over the whole panel.
// ============================================

type Tab = 'library' | 'browser' | 'practice' | 'history';

interface ActiveTest {
  title: string;
  targetId: string;
  questions: BankQuestion[];
}

const selectCls = 'px-2 py-1.5 rounded-md text-sm';
const selectStyle = { background: 'var(--bg-panel-elev)', color: 'var(--text-primary)', border: '1px solid var(--border)' } as const;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function MpscPage() {
  const { theme, toggleTheme, testResults } = useApp();
  const data = useMpscData();
  const hasDesktopChrome = useHasDesktopChrome('home');

  const [tab, setTab] = useState<Tab>('library');
  const [filters, setFilters] = useState<MpscFilters>(emptyFilters);
  const [activeTest, setActiveTest] = useState<ActiveTest | null>(null);

  const paperById = useMemo(() => {
    const m = new Map<string, ExamPaper>();
    for (const p of data.papers) m.set(p.id, p);
    return m;
  }, [data.papers]);

  const set = (patch: Partial<MpscFilters>) => setFilters((f) => ({ ...f, ...patch }));

  // Sittings passing the current filter (a sitting shows if any paper matches).
  const visibleSittings = useMemo(() => {
    return data.sittings.filter((s) => {
      if (filters.examType !== ALL && s.examType !== filters.examType) return false;
      if (filters.post !== ALL && s.post !== filters.post) return false;
      if (filters.year !== ALL && String(s.year) !== filters.year) return false;
      if (filters.subject !== ALL && !s.papers.some((p) => p.questions.some((q) => q.subject === filters.subject))) return false;
      return true;
    });
  }, [data.sittings, filters]);

  const practicePool = useMemo(
    () => filterQuestions(data.questions, paperById, filters),
    [data.questions, paperById, filters],
  );

  const launchPaperTest = (p: PaperWithQuestions) => {
    setActiveTest({
      title: `${p.paperSubject} ${p.paperNumber ?? ''} · ${p.year}`.replace(/\s+/g, ' ').trim(),
      targetId: p.id,
      questions: p.questions,
    });
  };

  const launchPracticeTest = () => {
    setActiveTest({
      title: 'Custom practice test',
      targetId: `filter|${filters.examType}|${filters.year}|${filters.subject}|${filters.difficulty}`,
      questions: shuffle(practicePool).slice(0, 25),
    });
  };

  // ---- Empty state (data not yet loaded) ----
  if (!data.hasData) {
    return (
      <Shell theme={theme} toggleTheme={toggleTheme} hasDesktopChrome={hasDesktopChrome}>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-sm">
            <div className="text-3xl mb-2">📚</div>
            <p className="font-medium mb-1">No MPSC questions loaded yet</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              The extraction pipeline is still processing the question papers. This page fills in automatically once the bank is populated.
            </p>
          </div>
        </div>
      </Shell>
    );
  }

  // ---- Active test takes over the panel ----
  if (activeTest) {
    return (
      <Shell theme={theme} toggleTheme={toggleTheme} hasDesktopChrome={hasDesktopChrome}>
        <main className="scroll-panel flex-1 min-h-0 overflow-y-auto px-5 py-6">
          <TestRunner
            title={activeTest.title}
            targetId={activeTest.targetId}
            questions={activeTest.questions}
            onExit={() => setActiveTest(null)}
          />
        </main>
      </Shell>
    );
  }

  return (
    <Shell theme={theme} toggleTheme={toggleTheme} hasDesktopChrome={hasDesktopChrome}>
      {/* Tabs */}
      <div className="shrink-0 flex items-center gap-1 px-5 pt-3 border-b" style={{ borderColor: 'var(--border)' }}>
        {(['library', 'browser', 'practice', 'history'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-3 py-2 text-sm capitalize rounded-t-md transition-colors"
            style={{
              color: tab === t ? 'var(--accent)' : 'var(--text-secondary)',
              borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent',
              fontWeight: tab === t ? 600 : 400,
            }}
          >
            {t === 'library' ? '📄 Library' : t === 'browser' ? '🔍 Browse' : t === 'practice' ? '✍️ Practice' : '📈 History'}
          </button>
        ))}
        <span className="ml-auto text-xs self-center" style={{ color: 'var(--text-secondary)' }}>
          {data.totalPapers} papers · {data.totalQuestions} questions
        </span>
      </div>

      {/* Filters (library + browser + practice) */}
      {tab !== 'history' && (
        <div className="shrink-0 flex flex-wrap items-center gap-2 px-5 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
          <select value={filters.examType} onChange={(e) => set({ examType: e.target.value })} className={selectCls} style={selectStyle}>
            <option key="all" value={ALL}>All exam types</option>
            {data.examTypes.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
          </select>
          <select value={filters.post} onChange={(e) => set({ post: e.target.value })} className={selectCls} style={selectStyle}>
            <option key="all" value={ALL}>All posts</option>
            {data.posts.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={filters.year} onChange={(e) => set({ year: e.target.value })} className={selectCls} style={selectStyle}>
            <option key="all" value={ALL}>All years</option>
            {data.years.map((y) => <option key={y} value={String(y)}>{y}</option>)}
          </select>
          <select value={filters.subject} onChange={(e) => set({ subject: e.target.value })} className={selectCls} style={selectStyle}>
            <option key="all" value={ALL}>All subjects</option>
            {data.subjects.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filters.difficulty} onChange={(e) => set({ difficulty: e.target.value })} className={selectCls} style={selectStyle}>
            <option value={ALL}>All levels</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          {(filters.examType !== ALL || filters.post !== ALL || filters.year !== ALL || filters.subject !== ALL || filters.difficulty !== ALL) && (
            <button onClick={() => setFilters(emptyFilters)} className="px-2.5 py-1.5 rounded-md text-sm hover:bg-[var(--bg-panel-elev)]" style={{ border: '1px solid var(--border)' }}>
              Clear
            </button>
          )}
        </div>
      )}

      <main className={`flex-1 min-h-0 ${tab === 'browser' ? 'overflow-hidden' : 'scroll-panel overflow-y-auto px-5 py-5'}`}>
        {tab === 'library' && (
          <>
            <div className="scroll-panel overflow-y-auto h-full px-5 py-5">
              <Library sittings={visibleSittings} onTakeTest={launchPaperTest} />
              <div className="mt-6 max-w-3xl mx-auto text-xs" style={{ color: 'var(--text-secondary)' }}>
                <Link to="/" className="hover:underline">← Back to Home</Link>
              </div>
            </div>
          </>
        )}
        {tab === 'browser' && <Browser questions={practicePool} paperById={paperById} />}
        {tab === 'practice' && (
          <>
            <Practice pool={practicePool} onStartTest={launchPracticeTest} />
            <div className="mt-6 max-w-3xl mx-auto text-xs" style={{ color: 'var(--text-secondary)' }}>
              <Link to="/" className="hover:underline">← Back to Home</Link>
            </div>
          </>
        )}
        {tab === 'history' && (
          <>
            <div className="scroll-panel overflow-y-auto h-full px-5 py-5">
              <History results={testResults} />
              <div className="mt-6 max-w-3xl mx-auto text-xs" style={{ color: 'var(--text-secondary)' }}>
                <Link to="/" className="hover:underline">← Back to Home</Link>
              </div>
            </div>
          </>
        )}
      </main>
    </Shell>
  );
}

// ---- Library: sittings with clustered papers + comparison ----
function Library({ sittings, onTakeTest }: { sittings: Sitting[]; onTakeTest: (p: PaperWithQuestions) => void }) {
  if (sittings.length === 0) {
    return <p className="text-center text-sm py-8" style={{ color: 'var(--text-secondary)' }}>No papers match these filters.</p>;
  }
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {sittings.map((s) => (
        <div key={s.key} className="rounded-xl p-4" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>{s.examType.replace('_', ' ')}</span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.year}</span>
          </div>
          <p className="font-medium text-sm mb-0.5">{s.examName}</p>
          {s.post && <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>{s.post}</p>}

          <div className="grid gap-2 sm:grid-cols-2">
            {s.papers.map((p) => (
              <div key={p.id} className="rounded-lg p-3 flex flex-col" style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)' }}>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-medium text-sm">{p.paperNumber ?? 'Paper'}</span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{p.questions.length} Q</span>
                </div>
                <span className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>{p.paperSubject}</span>
                <button
                  onClick={() => onTakeTest(p)}
                  disabled={p.questions.length === 0}
                  className="mt-auto px-2.5 py-1.5 rounded-md text-xs font-medium disabled:opacity-40"
                  style={{ background: 'var(--accent)', color: '#fff' }}
                >
                  {p.questions.length === 0 ? 'No questions' : 'Take test →'}
                </button>
              </div>
            ))}
          </div>
          {s.papers.length > 1 && (
            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
              🔗 {s.papers.length} papers in this sitting — {s.totalQuestions} questions total
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

// ---- Practice: quick drill launcher ----
function Practice({ pool, onStartTest }: { pool: BankQuestion[]; onStartTest: () => void }) {
  return (
    <div className="max-w-md mx-auto text-center rounded-xl p-8" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
      <div className="text-3xl mb-2">✍️</div>
      <p className="font-medium mb-1">{pool.length} questions match your filters</p>
      <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
        Start a {Math.min(25, pool.length)}-question practice test drawn from this pool, timed and scored like the real thing.
      </p>
      <button
        onClick={onStartTest}
        disabled={pool.length === 0}
        className="px-5 py-2.5 rounded-md text-sm font-medium disabled:opacity-40"
        style={{ background: 'var(--accent)', color: '#fff' }}
      >
        Start practice test
      </button>
    </div>
  );
}

// ---- Browser: full-page searchable table ----
function Browser({ questions, paperById }: { questions: BankQuestion[]; paperById: Map<string, ExamPaper> }) {
  return <QuestionsTable questions={questions} paperById={paperById} />;
}

// ---- History: past test scores + per-target best ----
function History({ results }: { results: ReturnType<typeof useApp.getState>['testResults'] }) {
  if (results.length === 0) {
    return <p className="text-center text-sm py-8" style={{ color: 'var(--text-secondary)' }}>No tests taken yet. Take one from the Library or Practice tab.</p>;
  }
  return (
    <div className="max-w-2xl mx-auto space-y-2">
      {results.map((r, i) => {
        const pct = Math.round((r.score / r.total) * 100);
        const d = new Date(r.answeredAt);
        return (
          <div key={i} className="rounded-lg px-4 py-3 flex items-center gap-3" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{r.label}</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {d.toLocaleDateString()} · {Math.floor(r.durationSec / 60)}m {r.durationSec % 60}s
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-semibold" style={{ color: pct >= 40 ? '#2e7d5b' : '#a5504a' }}>{r.score}/{r.total}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{pct}%</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---- Shared chrome ----
function Shell({ theme, toggleTheme, hasDesktopChrome, children }: {
  theme: string; toggleTheme: () => void; hasDesktopChrome: boolean; children: React.ReactNode;
}) {
  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--bg-app)', color: 'var(--text-primary)' }}>
      <header
        className="safe-top h-12 shrink-0 border-b flex items-center justify-between px-5 gap-3"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-panel)' }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className={hasDesktopChrome ? 'lg:hidden' : ''}><ModuleSwitcher /></span>
          <span className="label-eyebrow hidden md:inline">MPSC Old Questions</span>
        </div>
        <button
          onClick={toggleTheme}
          className={`${hasDesktopChrome ? 'lg:hidden' : ''} px-2 py-1 rounded-md text-sm hover:bg-[var(--bg-panel-elev)] transition-colors`}
          style={{ border: '1px solid var(--border)' }}
          title="Toggle theme"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </header>
      {children}
    </div>
  );
}

export default MpscPage;
