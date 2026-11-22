import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  COMPILED_IT_EXAMS,
  findCompiledExam,
  findExamView,
  type CompiledExam,
  type CompiledExamId,
  type ExamView,
} from './catalog';

const LAST_OPENED_KEY = 'ism.it-exams.last';

interface LastOpened {
  examId: CompiledExamId;
  viewId: string;
}

function readLastOpened(): LastOpened | null {
  try {
    const raw = window.localStorage.getItem(LAST_OPENED_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<LastOpened>;
    const exam = findCompiledExam(parsed.examId);
    if (!exam) return null;
    const view = findExamView(exam, parsed.viewId);
    return { examId: exam.id, viewId: view.id };
  } catch {
    return null;
  }
}

function writeLastOpened(next: LastOpened) {
  try {
    window.localStorage.setItem(LAST_OPENED_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage quota / privacy errors.
  }
}

function frameKey(examId: CompiledExamId, viewId: string) {
  return `${examId}:${viewId}`;
}

export function ItExamsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const examParam = searchParams.get('exam');
  const viewParam = searchParams.get('view');

  const activeExam: CompiledExam | undefined = useMemo(
    () => findCompiledExam(examParam),
    [examParam],
  );
  const activeView: ExamView | undefined = useMemo(
    () => (activeExam ? findExamView(activeExam, viewParam) : undefined),
    [activeExam, viewParam],
  );

  const [lastOpened, setLastOpened] = useState<LastOpened | null>(() => readLastOpened());
  const [mountedFrames, setMountedFrames] = useState<Array<{ exam: CompiledExam; view: ExamView }>>([]);
  const [loadedKeys, setLoadedKeys] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!activeExam || !activeView) return;
    const key = frameKey(activeExam.id, activeView.id);
    setMountedFrames((prev) => {
      if (prev.some((item) => frameKey(item.exam.id, item.view.id) === key)) return prev;
      return [...prev, { exam: activeExam, view: activeView }];
    });
    const nextLast = { examId: activeExam.id, viewId: activeView.id };
    setLastOpened(nextLast);
    writeLastOpened(nextLast);
  }, [activeExam, activeView]);

  function openOverview() {
    setSearchParams({});
  }

  function openExam(examId: CompiledExamId, viewId?: string) {
    const exam = findCompiledExam(examId);
    if (!exam) return;
    const view = findExamView(exam, viewId);
    const params: Record<string, string> = { exam: exam.id };
    if (view.id !== exam.views[0].id) {
      params.view = view.id;
    }
    setSearchParams(params);
  }

  const activeKey = activeExam && activeView ? frameKey(activeExam.id, activeView.id) : null;
  const totalTools = COMPILED_IT_EXAMS.reduce((sum, exam) => sum + exam.views.length, 0);

  const resumeExam = lastOpened ? findCompiledExam(lastOpened.examId) : undefined;
  const resumeView = resumeExam && lastOpened ? findExamView(resumeExam, lastOpened.viewId) : undefined;

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: 'var(--bg-app)' }}>
      {/* Mobile-only compact back row — desktop uses AppHeader */}
      <div
        className="lg:hidden shrink-0 flex items-center gap-3 px-4 h-11 safe-top"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-panel)' }}
      >
        <Link to="/" className="text-sm shrink-0" style={{ color: 'var(--text-secondary)' }}>
          ← Home
        </Link>
        <span className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
          IT &amp; Technical Exams
        </span>
      </div>

      {/* Unified exam switcher bar */}
      <div
        className="shrink-0 px-3 sm:px-5 py-2 flex flex-col gap-2"
        style={{ background: 'var(--bg-panel)', borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={openOverview}
            className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors shrink-0"
            style={{
              background: !activeExam ? 'var(--accent-soft)' : 'transparent',
              color: !activeExam ? 'var(--accent)' : 'var(--text-secondary)',
              border: `1px solid ${!activeExam ? 'var(--accent)' : 'transparent'}`,
            }}
          >
            Overview
          </button>

          <div className="w-px h-4 mx-0.5 shrink-0" style={{ background: 'var(--border)' }} />

          {COMPILED_IT_EXAMS.map((exam) => {
            const isActive = activeExam?.id === exam.id;
            return (
              <button
                key={exam.id}
                type="button"
                onClick={() => openExam(exam.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-colors shrink-0"
                style={{
                  background: isActive ? 'var(--accent-soft)' : 'transparent',
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  border: `1px solid ${isActive ? 'var(--accent)' : 'transparent'}`,
                }}
              >
                <span aria-hidden="true">{exam.glyph}</span>
                <span>{exam.shortTitle}</span>
              </button>
            );
          })}

          {activeView && (
            <a
              href={activeView.path}
              target="_blank"
              rel="noreferrer"
              className="ml-auto px-2.5 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap shrink-0 transition-colors hover:bg-[var(--bg-panel-elev)]"
              style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
              title="Open this trainer in its own browser tab"
            >
              Standalone ↗
            </a>
          )}
        </div>

        {/* Secondary sub-view pills for exams with companion banks/guides */}
        {activeExam && activeView && activeExam.views.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
            <span
              className="text-[10px] font-mono uppercase tracking-wider shrink-0 mr-1"
              style={{ color: 'var(--text-muted)' }}
            >
              {activeExam.shortTitle} tools:
            </span>
            {activeExam.views.map((view) => {
              const selected = activeView.id === view.id;
              return (
                <button
                  key={view.id}
                  type="button"
                  onClick={() => openExam(activeExam.id, view.id)}
                  className="px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors shrink-0"
                  style={{
                    background: selected ? 'var(--accent)' : 'var(--bg-panel-elev)',
                    color: selected ? 'var(--on-accent)' : 'var(--text-secondary)',
                    border: `1px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
                  }}
                >
                  {view.shortLabel}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main content area: Overview grid OR keep-alive iframe workspace */}
      <div className="flex-1 relative overflow-hidden">
        {!activeExam && (
          <div className="h-full overflow-y-auto scroll-panel">
            <div className="max-w-[1040px] mx-auto px-5 sm:px-8 py-7 flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div
                    className="font-mono text-[10px] uppercase tracking-wider mb-1.5"
                    style={{ color: 'var(--accent)' }}
                  >
                    Compiled Hub · {COMPILED_IT_EXAMS.length} Exams · {totalTools} Study Tools
                  </div>
                  <h1
                    className="text-2xl font-semibold tracking-tight"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    IT &amp; Technical Exams
                  </h1>
                  <p className="text-sm mt-1 max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
                    JSO, Informatics Officer, System Analyst, and System Manager compiled in one workspace.
                    Switch tabs above anytime without losing your place or active quiz.
                  </p>
                </div>

                {resumeExam && resumeView && (
                  <button
                    type="button"
                    onClick={() => openExam(resumeExam.id, resumeView.id)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap self-start sm:self-auto shrink-0"
                    style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}
                  >
                    Resume {resumeExam.shortTitle} →
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {COMPILED_IT_EXAMS.map((exam) => {
                  const isLast = lastOpened?.examId === exam.id;
                  return (
                    <div
                      key={exam.id}
                      className="surface rounded-xl p-5 flex flex-col gap-3.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-2xl leading-none shrink-0" aria-hidden="true">
                            {exam.glyph}
                          </span>
                          <div className="min-w-0">
                            <div
                              className="font-mono text-[10px] uppercase tracking-wider"
                              style={{ color: 'var(--text-muted)' }}
                            >
                              {exam.badge}
                            </div>
                            <h2
                              className="text-base font-semibold tracking-tight truncate"
                              style={{ color: 'var(--text-primary)' }}
                            >
                              {exam.title}
                            </h2>
                          </div>
                        </div>
                        {isLast && (
                          <span
                            className="font-mono text-[10px] uppercase px-2 py-0.5 rounded shrink-0"
                            style={{
                              background: 'var(--accent-soft)',
                              color: 'var(--accent)',
                            }}
                          >
                            Last opened
                          </span>
                        )}
                      </div>

                      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {exam.summary}
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {exam.highlights.map((item) => (
                          <span
                            key={item}
                            className="text-[11px] px-2 py-0.5 rounded-md"
                            style={{
                              background: 'var(--bg-panel-elev)',
                              color: 'var(--text-secondary)',
                              border: '1px solid var(--border)',
                            }}
                          >
                            {item}
                          </span>
                        ))}
                      </div>

                      <div
                        className="pt-3 mt-auto flex flex-wrap items-center gap-2"
                        style={{ borderTop: '1px solid var(--border)' }}
                      >
                        <button
                          type="button"
                          onClick={() => openExam(exam.id, exam.views[0].id)}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-90"
                          style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}
                        >
                          Open {exam.views[0].shortLabel} →
                        </button>

                        {exam.views.slice(1).map((view) => (
                          <button
                            key={view.id}
                            type="button"
                            onClick={() => openExam(exam.id, view.id)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-[var(--bg-panel-elev)]"
                            style={{
                              color: 'var(--text-primary)',
                              border: '1px solid var(--border)',
                            }}
                            title={view.description}
                          >
                            {view.shortLabel}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Keep-alive iframes: mounted on first visit, hidden when another tab is active */}
        {mountedFrames.map(({ exam, view }) => {
          const key = frameKey(exam.id, view.id);
          const visible = activeKey === key;
          const loaded = Boolean(loadedKeys[key]);
          return (
            <div
              key={key}
              className={visible ? 'h-full w-full relative' : 'hidden'}
              aria-hidden={!visible}
            >
              {visible && !loaded && (
                <div
                  className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
                  style={{ background: 'var(--bg-app)' }}
                >
                  <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Loading {exam.shortTitle} — {view.shortLabel}…
                  </div>
                </div>
              )}
              <iframe
                src={view.path}
                title={`${exam.title} — ${view.label}`}
                className="h-full w-full border-0 block"
                onLoad={() => setLoadedKeys((prev) => ({ ...prev, [key]: true }))}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ItExamsPage;
