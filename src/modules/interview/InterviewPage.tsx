import { useEffect, useMemo, useState } from 'react';
import { useApp } from '@/lib/store';
import { ModuleSwitcher } from '@/modules/ModuleSwitcher';
import { HomeBackLink } from '@/components/shell/HomeBackLink';
import { useHasDesktopChrome } from '@/lib/useShellChrome';
import { interviewCategories, totalInterviewQuestions } from '@/data/interview/questions';
import { briefs, totalBriefs } from '@/data/interview/briefs';
import { concepts, conceptUnits, totalConcepts } from '@/data/interview/concepts';

// ============================================
// INTERVIEW PREP — MUDAL System Manager
//
// Three tabs over static reference content:
//  - Q&A       → src/data/interview/questions.ts (rehearsal)
//  - Briefs    → src/data/interview/briefs.ts    (org/personal dossiers)
//  - Concepts  → src/data/interview/concepts.ts  (syllabus explanations)
//
// Only "reviewed"/"read"/"learned" state needs persistence, so it gets its
// own localStorage key rather than touching the global store — this is
// personal study progress the rest of the app has no reason to depend on.
// Question, brief and concept ids share one Set; concept ids are prefixed
// `c-` so they can't collide with the other two.
// ============================================

const STORAGE_KEY = 'interview-reviewed-v1';

type Tab = 'questions' | 'briefs' | 'concepts';

function loadReviewed(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

export function InterviewPage() {
  const { theme, toggleTheme } = useApp();
  const hasDesktopChrome = useHasDesktopChrome('home');

  const [tab, setTab] = useState<Tab>('questions');
  const [reviewed, setReviewed] = useState<Set<string>>(() => loadReviewed());
  const [openCategory, setOpenCategory] = useState<string | null>(interviewCategories[0]?.id ?? null);
  const [openBrief, setOpenBrief] = useState<string | null>(briefs[0]?.id ?? null);
  const [openUnit, setOpenUnit] = useState<string | null>(conceptUnits[0] ?? null);
  const [query, setQuery] = useState('');
  const [hideReviewed, setHideReviewed] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...reviewed]));
  }, [reviewed]);

  function toggleReviewed(id: string) {
    setReviewed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const q = query.trim().toLowerCase();

  const filteredCategories = useMemo(() => {
    return interviewCategories
      .map((cat) => ({
        ...cat,
        questions: cat.questions.filter((item) => {
          if (hideReviewed && reviewed.has(item.id)) return false;
          if (!q) return true;
          return (
            item.q.toLowerCase().includes(q) ||
            item.points.some((p) => p.toLowerCase().includes(q)) ||
            cat.title.toLowerCase().includes(q)
          );
        }),
      }))
      .filter((cat) => cat.questions.length > 0);
  }, [q, hideReviewed, reviewed]);

  const filteredBriefs = useMemo(() => {
    return briefs.filter((b) => {
      if (hideReviewed && reviewed.has(b.id)) return false;
      if (!q) return true;
      return (
        b.title.toLowerCase().includes(q) ||
        b.tagline.toLowerCase().includes(q) ||
        b.sections.some(
          (s) =>
            s.heading.toLowerCase().includes(q) ||
            (s.body ?? '').toLowerCase().includes(q) ||
            (s.bullets ?? []).some((x) => x.toLowerCase().includes(q))
        )
      );
    });
  }, [q, hideReviewed, reviewed]);

  const filteredUnits = useMemo(() => {
    return conceptUnits
      .map((unit) => ({
        unit,
        items: concepts.filter((c) => {
          if (c.unit !== unit) return false;
          if (hideReviewed && reviewed.has(c.id)) return false;
          if (!q) return true;
          return (
            c.term.toLowerCase().includes(q) ||
            c.short.toLowerCase().includes(q) ||
            c.unit.toLowerCase().includes(q) ||
            c.explain.some((x) => x.toLowerCase().includes(q)) ||
            (c.example ?? '').toLowerCase().includes(q) ||
            (c.exam ?? '').toLowerCase().includes(q)
          );
        }),
      }))
      .filter((g) => g.items.length > 0);
  }, [q, hideReviewed, reviewed]);

  const conceptsLearned = useMemo(() => concepts.filter((c) => reviewed.has(c.id)).length, [reviewed]);

  const questionsReviewed = useMemo(
    () => interviewCategories.reduce((n, c) => n + c.questions.filter((i) => reviewed.has(i.id)).length, 0),
    [reviewed]
  );
  const briefsRead = useMemo(() => briefs.filter((b) => reviewed.has(b.id)).length, [reviewed]);

  const selectCls = 'px-2 py-1.5 rounded-md text-sm';
  const selectStyle = {
    background: 'var(--bg-panel-elev)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border)',
  } as const;

  function tabBtnStyle(active: boolean) {
    return {
      background: active ? 'var(--bg-panel-elev)' : 'transparent',
      color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
      border: '1px solid var(--border)',
      fontWeight: active ? 600 : 400,
    } as const;
  }

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--bg-app)', color: 'var(--text-primary)' }}>
      <header
        className="lg:hidden safe-top h-12 shrink-0 border-b flex items-center justify-between px-5 gap-3"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-panel)' }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <HomeBackLink hasDesktopChrome={hasDesktopChrome} />
          <span className={hasDesktopChrome ? 'lg:hidden' : ''}><ModuleSwitcher /></span>
          <span className="label-eyebrow hidden md:inline">Interview Prep</span>
        </div>
        <button
          onClick={toggleTheme}
          className={`bordered ${hasDesktopChrome ? 'lg:hidden' : ''} px-2 py-1 rounded-md text-sm hover:bg-[var(--bg-panel-elev)] transition-colors`}
          title="Toggle theme"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </header>

      {/* Tabs */}
      <div className="shrink-0 flex items-center gap-2 px-5 pt-3">
        <button
          onClick={() => setTab('questions')}
          className="px-3 py-1.5 rounded-md text-sm transition-colors"
          style={tabBtnStyle(tab === 'questions')}
        >
          🎤 Q&amp;A <span className="opacity-60">({questionsReviewed}/{totalInterviewQuestions})</span>
        </button>
        <button
          onClick={() => setTab('briefs')}
          className="px-3 py-1.5 rounded-md text-sm transition-colors"
          style={tabBtnStyle(tab === 'briefs')}
        >
          📚 Briefs <span className="opacity-60">({briefsRead}/{totalBriefs})</span>
        </button>
        <button
          onClick={() => setTab('concepts')}
          className="px-3 py-1.5 rounded-md text-sm transition-colors"
          style={tabBtnStyle(tab === 'concepts')}
        >
          🧩 Concepts <span className="opacity-60">({conceptsLearned}/{totalConcepts})</span>
        </button>
      </div>

      {/* Controls */}
      <div className="shrink-0 flex flex-wrap items-center gap-2 px-5 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <input
          type="text"
          placeholder={
            tab === 'questions' ? 'Search questions…' : tab === 'briefs' ? 'Search briefs…' : 'Search concepts…'
          }
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`${selectCls} w-56`}
          style={selectStyle}
        />
        <label className="flex items-center gap-1.5 text-sm cursor-pointer select-none" style={{ color: 'var(--text-secondary)' }}>
          <input type="checkbox" checked={hideReviewed} onChange={(e) => setHideReviewed(e.target.checked)} />
          {tab === 'questions' ? 'Hide reviewed' : tab === 'briefs' ? 'Hide read' : 'Hide learned'}
        </label>
        <button
          onClick={() => setReviewed(new Set())}
          className="bordered px-2.5 py-1.5 rounded-md text-sm hover:bg-[var(--bg-panel-elev)] transition-colors"
        >
          Reset progress
        </button>
      </div>

      <main className="scroll-panel flex-1 min-h-0 overflow-y-auto px-5 py-6">
        <div className="max-w-3xl mx-auto space-y-3">
          {tab === 'questions' ? (
            <>
              {filteredCategories.length === 0 && <Empty query={query} />}
              {filteredCategories.map((cat) => {
                const isOpen = openCategory === cat.id || q.length > 0;
                const catReviewed = cat.questions.filter((item) => reviewed.has(item.id)).length;

                return (
                  <section key={cat.id} className="surface rounded-lg border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                    <button
                      onClick={() => setOpenCategory(isOpen && !q ? null : cat.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--bg-panel-elev)] transition-colors"
                    >
                      <span className="text-xl">{cat.glyph}</span>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium">{cat.title}</div>
                        <div className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{cat.blurb}</div>
                      </div>
                      <span className="text-xs shrink-0" style={{ color: 'var(--text-secondary)' }}>
                        {catReviewed}/{cat.questions.length}
                      </span>
                      <span className="shrink-0" style={{ color: 'var(--text-secondary)' }}>{isOpen ? '▾' : '▸'}</span>
                    </button>

                    {isOpen && (
                      <div className="border-t divide-y" style={{ borderColor: 'var(--border)' }}>
                        {cat.questions.map((item) => (
                          <QuestionRow
                            key={item.id}
                            question={item.q}
                            points={item.points}
                            isReviewed={reviewed.has(item.id)}
                            onToggleReviewed={() => toggleReviewed(item.id)}
                          />
                        ))}
                      </div>
                    )}
                  </section>
                );
              })}
            </>
          ) : tab === 'concepts' ? (
            <>
              {filteredUnits.length === 0 && <Empty query={query} />}
              {filteredUnits.map((g) => {
                const isOpen = openUnit === g.unit || q.length > 0;
                const learned = g.items.filter((c) => reviewed.has(c.id)).length;

                return (
                  <section key={g.unit} className="surface rounded-lg border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                    <button
                      onClick={() => setOpenUnit(isOpen && !q ? null : g.unit)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--bg-panel-elev)] transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-medium">{g.unit}</div>
                      </div>
                      <span className="text-xs shrink-0" style={{ color: 'var(--text-secondary)' }}>
                        {learned}/{g.items.length}
                      </span>
                      <span className="shrink-0" style={{ color: 'var(--text-secondary)' }}>{isOpen ? '▾' : '▸'}</span>
                    </button>

                    {isOpen && (
                      <div className="border-t divide-y" style={{ borderColor: 'var(--border)' }}>
                        {g.items.map((c) => (
                          <ConceptRow
                            key={c.id}
                            concept={c}
                            isLearned={reviewed.has(c.id)}
                            onToggleLearned={() => toggleReviewed(c.id)}
                          />
                        ))}
                      </div>
                    )}
                  </section>
                );
              })}
            </>
          ) : (
            <>
              {filteredBriefs.length === 0 && <Empty query={query} />}
              {filteredBriefs.map((b) => {
                const isOpen = openBrief === b.id || q.length > 0;
                const isRead = reviewed.has(b.id);

                return (
                  <section key={b.id} className="surface rounded-lg border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                    <div className="w-full flex items-center gap-3 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isRead}
                        onChange={() => toggleReviewed(b.id)}
                        className="shrink-0"
                        title="Mark as read"
                      />
                      <button
                        onClick={() => setOpenBrief(isOpen && !q ? null : b.id)}
                        className="flex items-center gap-3 min-w-0 flex-1 text-left"
                      >
                        <span className="text-xl">{b.glyph}</span>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium" style={{ color: isRead ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                            {b.title}
                          </div>
                          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{b.tagline}</div>
                        </div>
                        <span className="shrink-0" style={{ color: 'var(--text-secondary)' }}>{isOpen ? '▾' : '▸'}</span>
                      </button>
                    </div>

                    {isOpen && (
                      <div className="border-t px-4 py-3 space-y-4" style={{ borderColor: 'var(--border)' }}>
                        {b.sections.map((s, i) => (
                          <div key={i}>
                            <h3 className="text-sm font-semibold mb-1.5">{s.heading}</h3>
                            {s.body && (
                              <p className="text-sm mb-1.5" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                {s.body}
                              </p>
                            )}
                            {s.bullets && s.bullets.length > 0 && (
                              <ul className="space-y-1 list-disc list-outside ml-5 text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                                {s.bullets.map((x, j) => (
                                  <li key={j}>{x}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                );
              })}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function Empty({ query }: { query: string }) {
  return (
    <p className="text-sm py-8 text-center" style={{ color: 'var(--text-secondary)' }}>
      Nothing matches “{query}”.
    </p>
  );
}

function ConceptRow({
  concept,
  isLearned,
  onToggleLearned,
}: {
  concept: import('@/data/interview/concepts').Concept;
  isLearned: boolean;
  onToggleLearned: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="px-4 py-3">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={isLearned}
          onChange={onToggleLearned}
          className="mt-1 shrink-0"
          title="Mark as learned"
        />
        <button onClick={() => setExpanded((v) => !v)} className="flex-1 min-w-0 text-left">
          <div className="text-sm font-medium" style={{ color: isLearned ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
            {concept.term}
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{concept.short}</div>
        </button>
        <span
          className="shrink-0 text-xs cursor-pointer"
          style={{ color: 'var(--text-secondary)' }}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? '▾' : '▸'}
        </span>
      </div>

      {expanded && (
        <div className="mt-2 ml-7 space-y-2">
          <ul className="space-y-1 list-disc list-outside ml-4 text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            {concept.explain.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>

          {concept.example && (
            <div
              className="text-sm rounded-md px-3 py-2"
              style={{ background: 'var(--bg-panel-elev)', color: 'var(--text-secondary)', lineHeight: 1.55 }}
            >
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Example · </span>
              {concept.example}
            </div>
          )}

          {concept.exam && (
            <div
              className="text-sm rounded-md px-3 py-2"
              style={{ background: 'var(--bg-panel-elev)', color: 'var(--text-secondary)', lineHeight: 1.55 }}
            >
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>🎯 Exam angle · </span>
              {concept.exam}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function QuestionRow({
  question,
  points,
  isReviewed,
  onToggleReviewed,
}: {
  question: string;
  points: string[];
  isReviewed: boolean;
  onToggleReviewed: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="px-4 py-3">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={isReviewed}
          onChange={onToggleReviewed}
          className="mt-1 shrink-0"
          title="Mark reviewed"
        />
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex-1 min-w-0 text-left text-sm"
          style={{ color: isReviewed ? 'var(--text-secondary)' : 'var(--text-primary)' }}
        >
          {question}
        </button>
        <span
          className="shrink-0 text-xs cursor-pointer"
          style={{ color: 'var(--text-secondary)' }}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? '▾' : '▸'}
        </span>
      </div>
      {expanded && (
        <ul className="mt-2 ml-7 space-y-1 list-disc list-outside text-sm" style={{ color: 'var(--text-secondary)' }}>
          {points.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default InterviewPage;
