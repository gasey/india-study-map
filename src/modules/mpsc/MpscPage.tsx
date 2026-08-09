import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApp } from '@/lib/store';
import { ModuleSwitcher } from '@/modules/ModuleSwitcher';
import { useHasDesktopChrome } from '@/lib/useShellChrome';
import * as api from '@/lib/mpscApi';
import type { BankQuestionQuery, Correction } from '@/lib/mpscApi';
import { isMcqQuestion } from '@/data/banks/types';
import type { ExamPaper, McqBankQuestion } from '@/data/banks/types';
import {
  useBankPapers, useBankQuestionPage, useBankFacets, applyCorrections,
  ALL, BANK_ID, type MpscFilters, type PaperWithCount, type Sitting,
} from './useMpscData';
import { FilterRail } from './FilterRail';
import { PaginationControls } from './FilterBar';
import { TestPlayer } from './TestPlayer';
import { loadPaper, savePaper } from './useAttemptState';
import { QuestionList } from './QuestionList';
import { HomeBackLink } from '@/components/shell/HomeBackLink';

// ============================================
// MPSC OLD QUESTIONS — module shell.
// Four flows: Library (browse real papers, grouped by exam sitting so
// Paper-I/II compare side by side), Browser (paginated, server-filtered
// table), Practice (server-sampled filtered drill), History (past test
// scores). A launched test takes over the whole panel.
//
// Browser/Practice share one URL-serialized filter (`MpscFilters`, via
// useSearchParams) driving live /api/mpsc/questions calls — see
// useMpscData.ts for why this replaced a full-dataset client fetch.
// Library keeps its own much smaller client-side filter over paper
// metadata only (examType/post/year — subject/difficulty aren't
// available without fetching question bodies, which Library deliberately
// doesn't do).
//
// The State Tax Officer prep set (different bank, different data) lives at
// its own route (/state-tax-officer, see StateTaxOfficerPage.tsx) rather
// than as a tab here — it was briefly a tab, but that wired it to this
// module's data via useMpscData(), which reads a different bank entirely
// and silently showed 0 questions.
// ============================================

type Tab = 'library' | 'browser' | 'practice' | 'history';
type SortKey = NonNullable<BankQuestionQuery['sortBy']>;

interface ActiveTest {
  title: string;
  targetId: string;
  questions: McqBankQuestion[];
}

const FILTER_KEYS = ['examType', 'post', 'year', 'paperId', 'subject', 'difficulty', 'type'] as const;

function filtersFromParams(sp: URLSearchParams): MpscFilters {
  return {
    examType: sp.getAll('examType'),
    post: sp.getAll('post'),
    year: sp.getAll('year'),
    paperId: sp.getAll('paperId'),
    subject: sp.getAll('subject'),
    difficulty: sp.getAll('difficulty'),
    type: sp.getAll('type'),
    search: sp.get('search') ?? '',
  };
}

const selectCls = 'px-2 py-1.5 rounded-md text-sm';
const selectStyle = { background: 'var(--bg-panel-elev)', color: 'var(--text-primary)', border: '1px solid var(--border)' } as const;

export function MpscPage() {
  const { theme, toggleTheme, testResults } = useApp();
  const papersData = useBankPapers();
  const hasDesktopChrome = useHasDesktopChrome('home');

  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab');
  const [tab, setTab] = useState<Tab>(
    (['library', 'browser', 'practice', 'history'] as const).includes(initialTab as Tab) ? (initialTab as Tab) : 'library',
  );
  const [activeTest, setActiveTest] = useState<ActiveTest | null>(null);
  const [loadingPaperId, setLoadingPaperId] = useState<string | null>(null);
  const [samplingTest, setSamplingTest] = useState(false);

  // Library's own filter — cheap client-side filter over paper metadata
  // only (examType/post/year). Subject/difficulty are question-level and
  // no longer available without a per-paper fetch, so they're dropped here
  // rather than left silently broken.
  const [libraryFilters, setLibraryFilters] = useState({ examType: ALL, post: ALL, year: ALL });

  // Browse/Practice's shared filter, sort, and page position — all live in
  // the URL so a filtered view is shareable/refreshable.
  const filters = useMemo(() => filtersFromParams(searchParams), [searchParams]);
  const offset = Number(searchParams.get('offset') ?? 0) || 0;
  const sortBy = (searchParams.get('sortBy') as SortKey) || 'year';
  const sortDir = (searchParams.get('sortDir') as 'asc' | 'desc') || 'desc';

  const setFilters = (patch: Partial<MpscFilters>) => {
    setSearchParams((prev) => {
      const merged = { ...filtersFromParams(prev), ...patch };
      const next = new URLSearchParams(prev);
      for (const key of FILTER_KEYS) next.delete(key);
      for (const key of FILTER_KEYS) for (const v of merged[key]) next.append(key, v);
      if (merged.search) next.set('search', merged.search);
      else next.delete('search');
      next.delete('offset'); // any filter change invalidates the current page position
      return next;
    });
  };

  const setOffset = (o: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (o > 0) next.set('offset', String(o));
      else next.delete('offset');
      return next;
    });
  };

  // The card list picks a sort as one (key, direction) pair from a dropdown,
  // rather than the old table's click-a-column-header-to-toggle behaviour.
  const setSortExplicit = (key: SortKey, dir: 'asc' | 'desc') => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('sortBy', key);
      next.set('sortDir', dir);
      next.delete('offset');
      return next;
    });
  };

  const page = useBankQuestionPage(filters, offset, sortBy, sortDir);
  const facets = useBankFacets(filters);

  // Header badge needs the TRUE bank-wide question total, including the
  // ~2,324 questions with no paper_id — papersData.totalQuestions only
  // sums each paper's questionCount, which excludes those by construction.
  // One cheap unfiltered fetch (limit:1, only .total matters), independent
  // of whatever filters Browse/Practice currently have active.
  const [globalQuestionTotal, setGlobalQuestionTotal] = useState<number | null>(null);
  useEffect(() => {
    api.listBankQuestions({ limit: 1 }).then((r) => setGlobalQuestionTotal(r.total)).catch(() => {});
  }, []);

  // Admin-authored corrections overlaid on whatever page/sample of
  // questions is currently fetched — same overlay this bank has always
  // done, just applied per-fetch now instead of once over one global array.
  const [corrections, setCorrections] = useState<Record<string, Correction>>({});
  const refetchCorrections = () => api.getCorrections(BANK_ID).then(setCorrections).catch(() => {});
  useEffect(() => {
    refetchCorrections();
  }, []);

  const correctedPage = useMemo(() => applyCorrections(page.questions, corrections), [page.questions, corrections]);

  const paperById = useMemo(() => {
    const m = new Map<string, ExamPaper>();
    for (const p of papersData.papers) m.set(p.id, p);
    return m;
  }, [papersData.papers]);

  const visibleSittings = useMemo(() => {
    return papersData.sittings.filter((s) => {
      if (libraryFilters.examType !== ALL && s.examType !== libraryFilters.examType) return false;
      if (libraryFilters.post !== ALL && s.post !== libraryFilters.post) return false;
      if (libraryFilters.year !== ALL && String(s.year) !== libraryFilters.year) return false;
      return true;
    });
  }, [papersData.sittings, libraryFilters]);

  const launchPaperTest = async (p: PaperWithCount) => {
    if (p.questionCount === 0) return;
    setLoadingPaperId(p.id);
    try {
      // Resume the stored paper if this sitting was already started, so the
      // saved answers still line up (see useAttemptState.ts).
      const saved = loadPaper<McqBankQuestion>(p.id);
      const items = saved ?? applyCorrections(
        (await api.listBankQuestions({ paperId: [p.id], type: ['mcq'], limit: 100 })).questions,
        corrections,
      ).filter(isMcqQuestion);
      if (!saved) savePaper(p.id, items);
      setActiveTest({
        title: `${p.paperSubject} ${p.paperNumber ?? ''} · ${p.year}`.replace(/\s+/g, ' ').trim(),
        targetId: p.id,
        questions: items,
      });
    } finally {
      setLoadingPaperId(null);
    }
  };

  const launchPracticeTest = async () => {
    setSamplingTest(true);
    try {
      const targetId = `filter|${JSON.stringify(filters)}`;
      const saved = loadPaper<McqBankQuestion>(targetId);
      const items = saved ?? applyCorrections(
        (await api.sampleBankQuestions(filters, 25)).questions,
        corrections,
      ).filter(isMcqQuestion);
      if (!saved) savePaper(targetId, items);
      setActiveTest({ title: 'Custom practice test', targetId, questions: items });
    } finally {
      setSamplingTest(false);
    }
  };

  // ---- Loading state ----
  if (papersData.loading) {
    return (
      <Shell theme={theme} toggleTheme={toggleTheme} hasDesktopChrome={hasDesktopChrome}>
        <main className="flex-1 flex items-center justify-center">
          <p style={{ color: 'var(--text-secondary)' }}>Loading MPSC Old Questions…</p>
        </main>
      </Shell>
    );
  }

  // ---- Active test takes over the panel ----
  if (activeTest) {
    return (
      <Shell theme={theme} toggleTheme={toggleTheme} hasDesktopChrome={hasDesktopChrome}>
        {/* TestPlayer manages its own two-pane layout and scrolling, so it
            gets the raw height rather than a padded scroll container. */}
        <main className="flex-1 min-h-0">
          <TestPlayer
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
      <div className="shrink-0 flex items-center gap-1 px-5 pt-3 border-b overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
        {(['library', 'browser', 'practice', 'history'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-3 py-2 text-sm rounded-t-md transition-colors whitespace-nowrap"
            style={{
              color: tab === t ? 'var(--accent)' : 'var(--text-secondary)',
              borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent',
              fontWeight: tab === t ? 600 : 400,
            }}
          >
            {t === 'library'
              ? '📄 Library'
              : t === 'browser'
                ? '🔍 Browse'
                : t === 'practice'
                  ? '✍️ Practice'
                  : '📈 History'}
          </button>
        ))}
        <span className="ml-auto text-xs self-center whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
          {papersData.totalPapers} papers · {globalQuestionTotal ?? papersData.totalQuestions} questions
        </span>
      </div>

      {/* Library's own lightweight filter row — paper metadata only */}
      {tab === 'library' && (
        <div className="shrink-0 flex flex-wrap items-center gap-2 px-5 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
          <select value={libraryFilters.examType} onChange={(e) => setLibraryFilters((f) => ({ ...f, examType: e.target.value }))} className={selectCls} style={selectStyle}>
            <option key="all" value={ALL}>All exam types</option>
            {papersData.examTypes.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
          </select>
          <select value={libraryFilters.post} onChange={(e) => setLibraryFilters((f) => ({ ...f, post: e.target.value }))} className={selectCls} style={selectStyle}>
            <option key="all" value={ALL}>All posts</option>
            {papersData.posts.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={libraryFilters.year} onChange={(e) => setLibraryFilters((f) => ({ ...f, year: e.target.value }))} className={selectCls} style={selectStyle}>
            <option key="all" value={ALL}>All years</option>
            {papersData.years.map((y) => <option key={y} value={String(y)}>{y}</option>)}
          </select>
          {(libraryFilters.examType !== ALL || libraryFilters.post !== ALL || libraryFilters.year !== ALL) && (
            <button onClick={() => setLibraryFilters({ examType: ALL, post: ALL, year: ALL })} className="px-2.5 py-1.5 rounded-md text-sm hover:bg-[var(--bg-panel-elev)]" style={{ border: '1px solid var(--border)' }}>
              Clear
            </button>
          )}
        </div>
      )}

      <main className={`flex-1 min-h-0 ${tab === 'browser' ? 'overflow-hidden' : 'scroll-panel overflow-y-auto px-5 py-5'}`}>
        {tab === 'library' && (
          <div className="scroll-panel overflow-y-auto h-full px-5 py-5">
            <Library sittings={visibleSittings} loadingPaperId={loadingPaperId} onTakeTest={launchPaperTest} />
            <div className="mt-6 max-w-3xl mx-auto text-xs" style={{ color: 'var(--text-secondary)' }}>
              <Link to="/" className="hover:underline">← Back to Home</Link>
            </div>
          </div>
        )}
        {tab === 'browser' && (
          <div className="flex gap-4 h-full px-5 py-5">
            <FilterRail filters={filters} onChange={setFilters} facets={facets} />
            <div className="flex-1 min-w-0 rounded-xl flex flex-col min-h-0" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
              <QuestionList
                questions={correctedPage}
                paperById={paperById}
                corrections={corrections}
                total={page.total}
                bankTotal={globalQuestionTotal}
                sortBy={sortBy}
                sortDir={sortDir}
                onSortChange={setSortExplicit}
                onStartTest={launchPracticeTest}
                startingTest={samplingTest}
              />
              <div className="px-4 pb-4 shrink-0">
                <PaginationControls offset={offset} limit={25} count={correctedPage.length} onOffsetChange={setOffset} />
              </div>
            </div>
          </div>
        )}
        {tab === 'practice' && (
          <div className="flex gap-4 min-h-full">
            <FilterRail filters={filters} onChange={setFilters} facets={facets} />
            <div className="flex-1">
              <Practice total={page.total} loading={samplingTest} onStartTest={launchPracticeTest} />
              <div className="mt-6 max-w-3xl mx-auto text-xs" style={{ color: 'var(--text-secondary)' }}>
                <Link to="/" className="hover:underline">← Back to Home</Link>
              </div>
            </div>
          </div>
        )}
        {tab === 'history' && (
          <div className="scroll-panel overflow-y-auto h-full px-5 py-5">
            <History results={testResults} />
            <div className="mt-6 max-w-3xl mx-auto text-xs" style={{ color: 'var(--text-secondary)' }}>
              <Link to="/" className="hover:underline">← Back to Home</Link>
            </div>
          </div>
        )}
      </main>
    </Shell>
  );
}

// ---- Library: sittings with clustered papers + comparison ----
function Library({ sittings, loadingPaperId, onTakeTest }: { sittings: Sitting[]; loadingPaperId: string | null; onTakeTest: (p: PaperWithCount) => void }) {
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
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{p.questionCount} Q</span>
                </div>
                <span className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>{p.paperSubject}</span>
                <button
                  onClick={() => onTakeTest(p)}
                  disabled={p.questionCount === 0 || loadingPaperId === p.id}
                  className="mt-auto px-2.5 py-1.5 rounded-md text-xs font-medium disabled:opacity-40"
                  style={{ background: 'var(--accent)', color: '#fff' }}
                >
                  {p.questionCount === 0 ? 'No questions' : loadingPaperId === p.id ? 'Loading…' : 'Take test →'}
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
function Practice({ total, loading, onStartTest }: { total: number; loading: boolean; onStartTest: () => void }) {
  return (
    <div className="max-w-md mx-auto text-center rounded-xl p-8" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
      <div className="text-3xl mb-2">✍️</div>
      <p className="font-medium mb-1">{total} question{total === 1 ? '' : 's'} match your filters</p>
      <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
        Start a {Math.min(25, total)}-question practice test drawn from this pool, timed and scored like the real thing.
      </p>
      <button
        onClick={onStartTest}
        disabled={total === 0 || loading}
        className="px-5 py-2.5 rounded-md text-sm font-medium disabled:opacity-40"
        style={{ background: 'var(--accent)', color: '#fff' }}
      >
        {loading ? 'Loading…' : 'Start practice test'}
      </button>
    </div>
  );
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
      {/* Hidden at desktop widths — AppHeader already covers the title there. */}
      <header
        className="lg:hidden safe-top h-12 shrink-0 border-b flex items-center justify-between px-5 gap-3"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-panel)' }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <HomeBackLink hasDesktopChrome={hasDesktopChrome} />
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
