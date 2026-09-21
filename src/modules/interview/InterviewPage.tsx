import { useEffect, useMemo, useState } from 'react';
import { useApp } from '@/lib/store';
import { ModuleSwitcher } from '@/modules/ModuleSwitcher';
import { HomeBackLink } from '@/components/shell/HomeBackLink';
import { useHasDesktopChrome } from '@/lib/useShellChrome';
import { interviewCategories, totalInterviewQuestions } from '@/data/interview/questions';

// ============================================
// INTERVIEW PREP — MUDAL System Manager
//
// Static reference content (src/data/interview/questions.ts), rendered as
// a filterable accordion. Only "reviewed" state needs persistence, so it
// gets its own localStorage key rather than touching the global store —
// this is personal study content, not app progress the rest of the app
// depends on.
// ============================================

const STORAGE_KEY = 'interview-reviewed-v1';
const ALL = 'all';

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

  const [reviewed, setReviewed] = useState<Set<string>>(() => loadReviewed());
  const [openCategory, setOpenCategory] = useState<string | null>(interviewCategories[0]?.id ?? null);
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

  const filtered = useMemo(() => {
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

  const reviewedCount = reviewed.size;
  const selectCls = 'px-2 py-1.5 rounded-md text-sm';
  const selectStyle = { background: 'var(--bg-panel-elev)', color: 'var(--text-primary)', border: '1px solid var(--border)' } as const;

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

      {/* Controls */}
      <div className="shrink-0 flex flex-wrap items-center gap-2 px-5 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <input
          type="text"
          placeholder="Search questions…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`${selectCls} w-56`}
          style={selectStyle}
        />
        <label className="flex items-center gap-1.5 text-sm cursor-pointer select-none" style={{ color: 'var(--text-secondary)' }}>
          <input type="checkbox" checked={hideReviewed} onChange={(e) => setHideReviewed(e.target.checked)} />
          Hide reviewed
        </label>
        <button
          onClick={() => setReviewed(new Set())}
          className="bordered px-2.5 py-1.5 rounded-md text-sm hover:bg-[var(--bg-panel-elev)] transition-colors"
        >
          Reset progress
        </button>
        <div className="ml-auto text-xs" style={{ color: 'var(--text-secondary)' }}>
          {reviewedCount}/{totalInterviewQuestions} reviewed
        </div>
      </div>

      {/* Categories */}
      <main className="scroll-panel flex-1 min-h-0 overflow-y-auto px-5 py-6">
        <div className="max-w-3xl mx-auto space-y-3">
          {filtered.length === 0 && (
            <p className="text-sm py-8 text-center" style={{ color: 'var(--text-secondary)' }}>
              No questions match "{query}".
            </p>
          )}

          {filtered.map((cat) => {
            const isOpen = openCategory === cat.id || q.length > 0;
            const catReviewed = cat.questions.filter((item) => reviewed.has(item.id)).length;

            return (
              <section
                key={cat.id}
                className="surface rounded-lg border overflow-hidden"
                style={{ borderColor: 'var(--border)' }}
              >
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
        </div>
      </main>
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
        <span className="shrink-0 text-xs cursor-pointer" style={{ color: 'var(--text-secondary)' }} onClick={() => setExpanded((v) => !v)}>
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
