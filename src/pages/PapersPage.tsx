import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePapersTree } from '@/modules/mpsc/usePapersTree';
import type { PapersTreeSitting } from '@/lib/mpscApi';

// ============================================
// Papers browse — exam type -> year -> sitting sidebar driving a paper list.
// Sourced from GET /api/papers/tree/, which groups on the server using the
// same source_file heuristic the old client-side sittingKey() used (see
// useMpscData.ts's useBankPapers() and mpsc_api's main.py _sitting_key()).
// Scoped to MPSC Old Questions today — State Tax Officer/Polity Codex stay
// in Library, per HANDOFF.md's migration map.
// ============================================

export default function PapersPage() {
  const { tree, loading } = usePapersTree();
  const [expandedExamTypes, setExpandedExamTypes] = useState<Set<string>>(new Set());
  const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set());
  const [selectedSitting, setSelectedSitting] = useState<PapersTreeSitting | null>(null);

  const examTypes = tree?.examTypes ?? [];

  // Auto-expand the first exam type/year so the tree isn't empty on first load.
  useMemo(() => {
    if (examTypes.length > 0 && expandedExamTypes.size === 0) {
      setExpandedExamTypes(new Set([examTypes[0].examType]));
      if (examTypes[0].years.length > 0) {
        setExpandedYears(new Set([`${examTypes[0].examType}|${examTypes[0].years[0].year}`]));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examTypes.length]);

  const toggleExamType = (examType: string) => {
    setExpandedExamTypes((prev) => {
      const next = new Set(prev);
      if (next.has(examType)) next.delete(examType);
      else next.add(examType);
      return next;
    });
  };

  const toggleYear = (key: string) => {
    setExpandedYears((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="h-full flex overflow-hidden">
      <aside
        className="w-[280px] shrink-0 overflow-y-auto scroll-panel px-3 py-4"
        style={{ borderRight: '1px solid var(--border)' }}
      >
        <div className="text-[11px] tracking-wider uppercase font-medium mb-3 px-1" style={{ color: 'var(--text-secondary)' }}>
          Papers
        </div>
        {loading && <div className="text-sm px-1" style={{ color: 'var(--text-secondary)' }}>Loading…</div>}
        {!loading && examTypes.length === 0 && (
          <div className="text-sm px-1" style={{ color: 'var(--text-secondary)' }}>No papers found.</div>
        )}
        {examTypes.map((et) => (
          <div key={et.examType || '(none)'} className="mb-1">
            <button
              type="button"
              onClick={() => toggleExamType(et.examType)}
              className="w-full text-left text-sm font-medium px-1 py-1.5 rounded flex items-center gap-1.5"
              style={{ color: 'var(--text-primary)' }}
            >
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {expandedExamTypes.has(et.examType) ? '▾' : '▸'}
              </span>
              {et.examType || 'Unspecified'}
            </button>
            {expandedExamTypes.has(et.examType) && (
              <div className="ml-4">
                {et.years.map((y) => {
                  const yearKey = `${et.examType}|${y.year}`;
                  return (
                    <div key={yearKey}>
                      <button
                        type="button"
                        onClick={() => toggleYear(yearKey)}
                        className="w-full text-left text-xs px-1 py-1 rounded flex items-center gap-1.5"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        <span>{expandedYears.has(yearKey) ? '▾' : '▸'}</span>
                        {y.year ?? 'Undated'}
                      </button>
                      {expandedYears.has(yearKey) && (
                        <div className="ml-4">
                          {y.sittings.map((s) => (
                            <button
                              key={s.key}
                              type="button"
                              onClick={() => setSelectedSitting(s)}
                              className="w-full text-left text-xs px-1.5 py-1 rounded truncate"
                              style={{
                                color: selectedSitting?.key === s.key ? 'var(--accent)' : 'var(--text-secondary)',
                                background: selectedSitting?.key === s.key ? 'var(--bg-panel-elev)' : undefined,
                              }}
                              title={s.label}
                            >
                              {s.label} · {s.papers.length}p
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </aside>

      <main className="flex-1 overflow-y-auto scroll-panel px-8 py-9">
        {!selectedSitting && (
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Select a sitting from the sidebar to see its papers.
          </div>
        )}
        {selectedSitting && (
          <div className="max-w-[760px]">
            <h1 className="text-xl font-medium tracking-tight mb-1" style={{ color: 'var(--text-primary)' }}>
              {selectedSitting.label}
            </h1>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              {selectedSitting.papers.length} papers · {selectedSitting.totalQuestions} questions total
            </p>
            <div className="flex flex-col gap-2.5">
              {selectedSitting.papers.map((p) => (
                <div
                  key={p.id}
                  className="rounded-lg p-4 flex items-center justify-between gap-3"
                  style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {p.paperSubject} {p.paperNumber ? `— Paper ${p.paperNumber}` : ''}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {p.questionCount} questions
                    </div>
                  </div>
                  <Link
                    to={`/mpsc?tab=browser&paperId=${encodeURIComponent(p.id)}`}
                    className="text-xs px-2.5 py-1.5 rounded-md shrink-0"
                    style={{ background: 'var(--accent)', color: 'var(--bg-app)' }}
                  >
                    Browse questions
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
