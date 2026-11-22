import { useEffect, useMemo, useState } from 'react';
import { useApp } from '@/lib/store';
import { nihongoStages } from '@/data/nihongo/course';
import { GRAMMAR_LESSONS, type GrammarLesson } from '@/data/nihongo/grammarReference';
import { fetchTatoebaSentences, speakJapanese, type TatoebaSentence } from '@/data/nihongo/freeApis';
import { MiniQuiz } from '@/components/shared/MiniQuiz';

type Mode = 'reference' | 'stages';
type LevelFilter = 'ALL' | 'N5' | 'N4' | 'N3';

export function NihongoCourse() {
  const lastStage = useApp((s) => s.nihongoCourseLastStage);
  const setLastStage = useApp((s) => s.setNihongoCourseLastStage);

  const [mode, setMode] = useState<Mode>('reference');
  const [stageId, setStageId] = useState(() =>
    lastStage && nihongoStages.some((s) => s.id === lastStage) ? lastStage : nihongoStages[0].id,
  );
  const stage = nihongoStages.find((s) => s.id === stageId) ?? nihongoStages[0];

  // 32-lesson comprehensive reference state
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('ALL');
  const [search, setSearch] = useState('');
  const [selectedLessonId, setSelectedLessonId] = useState<string>(GRAMMAR_LESSONS[0].id);
  const [liveSentences, setLiveSentences] = useState<TatoebaSentence[]>([]);
  const [liveLoading, setLiveLoading] = useState(false);

  useEffect(() => {
    setLastStage(stageId);
  }, [stageId, setLastStage]);

  const filteredLessons = useMemo(() => {
    const q = search.trim().toLowerCase();
    return GRAMMAR_LESSONS.filter((l) => {
      if (levelFilter !== 'ALL' && l.level !== levelFilter) return false;
      if (!q) return true;
      return (
        l.title.toLowerCase().includes(q) ||
        l.idea.toLowerCase().includes(q) ||
        l.explanation.toLowerCase().includes(q)
      );
    });
  }, [levelFilter, search]);

  const activeLesson: GrammarLesson = useMemo(() => {
    return (
      filteredLessons.find((l) => l.id === selectedLessonId) ??
      filteredLessons[0] ??
      GRAMMAR_LESSONS[0]
    );
  }, [filteredLessons, selectedLessonId]);

  useEffect(() => {
    setLiveSentences([]);
  }, [activeLesson.id]);

  async function loadLiveExamplesForLesson(lesson: GrammarLesson) {
    const firstEx = lesson.examples[0]?.jp ?? lesson.title;
    // Extract a clean Japanese search token from title or first example
    const jpMatch = lesson.title.match(/[\u3040-\u30ff\u4e00-\u9faf]+/);
    const query = jpMatch ? jpMatch[0] : firstEx.slice(0, 4);
    setLiveLoading(true);
    try {
      const res = await fetchTatoebaSentences(query, { limit: 5 });
      setLiveSentences(res);
    } catch {
      setLiveSentences([]);
    } finally {
      setLiveLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Mode switcher: 32-Lesson Comprehensive Curriculum vs 6-Stage Quick Course */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          className="inline-flex rounded-lg p-1 gap-0.5"
          style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)' }}
        >
          <button
            type="button"
            onClick={() => setMode('reference')}
            className="px-3.5 py-1.5 rounded-md text-xs font-medium"
            style={{
              background: mode === 'reference' ? 'var(--accent-soft)' : 'transparent',
              color: mode === 'reference' ? 'var(--accent)' : 'var(--text-secondary)',
            }}
          >
            32-Lesson JLPT N5–N3 Curriculum
          </button>
          <button
            type="button"
            onClick={() => setMode('stages')}
            className="px-3.5 py-1.5 rounded-md text-xs font-medium"
            style={{
              background: mode === 'stages' ? 'var(--accent-soft)' : 'transparent',
              color: mode === 'stages' ? 'var(--accent)' : 'var(--text-secondary)',
            }}
          >
            6-Stage Quick-Start Drills
          </button>
        </div>

        {mode === 'reference' && (
          <div className="flex items-center gap-1.5">
            {(['ALL', 'N5', 'N4', 'N3'] as LevelFilter[]).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setLevelFilter(lvl)}
                className="px-2.5 py-1 rounded-md text-xs font-medium"
                style={{
                  background: levelFilter === lvl ? 'var(--accent)' : 'var(--bg-panel)',
                  color: levelFilter === lvl ? 'var(--on-accent)' : 'var(--text-secondary)',
                  border: `1px solid ${levelFilter === lvl ? 'var(--accent)' : 'var(--border)'}`,
                }}
              >
                {lvl === 'ALL' ? `All (${GRAMMAR_LESSONS.length})` : lvl}
              </button>
            ))}
          </div>
        )}
      </div>

      {mode === 'reference' ? (
        <div className="grid grid-cols-1 lg:grid-cols-[270px_minmax(0,1fr)] gap-4 items-start">
          {/* Sidebar lesson selector */}
          <div className="surface rounded-xl p-3 flex flex-col gap-2.5">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search 32 grammar lessons…"
              className="rounded-lg px-3 py-1.5 text-xs outline-none"
              style={{ background: 'var(--bg-app)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            />
            <div className="max-h-[520px] overflow-y-auto flex flex-col gap-1 pr-1">
              {filteredLessons.map((l) => {
                const isSel = l.id === activeLesson.id;
                return (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setSelectedLessonId(l.id)}
                    className="text-left px-2.5 py-2 rounded-lg flex items-start justify-between gap-2 transition-colors"
                    style={{
                      background: isSel ? 'var(--accent-soft)' : 'transparent',
                      color: isSel ? 'var(--accent)' : 'var(--text-primary)',
                    }}
                  >
                    <span className="text-xs font-medium leading-snug">
                      {l.order}. {l.title}
                    </span>
                    <span
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0"
                      style={{ background: 'var(--bg-panel-elev)', color: 'var(--text-secondary)' }}
                    >
                      {l.level}
                    </span>
                  </button>
                );
              })}
              {filteredLessons.length === 0 && (
                <p className="text-xs p-2" style={{ color: 'var(--text-muted)' }}>
                  No grammar lessons match your filter.
                </p>
              )}
            </div>
          </div>

          {/* Active lesson content */}
          <div className="surface rounded-xl p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="font-mono text-[10px] uppercase px-2 py-0.5 rounded font-semibold"
                    style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
                  >
                    JLPT {activeLesson.level} · Lesson {activeLesson.order} of {GRAMMAR_LESSONS.length}
                  </span>
                </div>
                <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {activeLesson.title}
                </h2>
              </div>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  disabled={activeLesson.order <= 1}
                  onClick={() => {
                    const prev = GRAMMAR_LESSONS.find((l) => l.order === activeLesson.order - 1);
                    if (prev) setSelectedLessonId(prev.id);
                  }}
                  className="px-2.5 py-1 rounded-md text-xs disabled:opacity-40"
                  style={{ background: 'var(--bg-panel-elev)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                >
                  ← Prev
                </button>
                <button
                  type="button"
                  disabled={activeLesson.order >= GRAMMAR_LESSONS.length}
                  onClick={() => {
                    const next = GRAMMAR_LESSONS.find((l) => l.order === activeLesson.order + 1);
                    if (next) setSelectedLessonId(next.id);
                  }}
                  className="px-2.5 py-1 rounded-md text-xs disabled:opacity-40"
                  style={{ background: 'var(--bg-panel-elev)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                >
                  Next →
                </button>
              </div>
            </div>

            {/* Core idea banner */}
            <div
              className="rounded-lg p-3.5 text-sm font-medium leading-relaxed"
              style={{
                background: 'var(--accent-soft)',
                color: 'var(--text-primary)',
                borderLeft: '3px solid var(--accent)',
              }}
            >
              {activeLesson.idea}
            </div>

            {/* Detailed multi-paragraph explanation */}
            <div className="flex flex-col gap-3 text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
              {activeLesson.explanation.split('\n\n').map((para, i) => (
                <p key={i} className="whitespace-pre-line">
                  {para}
                </p>
              ))}
            </div>

            {/* Key summary points */}
            <div className="rounded-lg p-4 flex flex-col gap-2" style={{ background: 'var(--bg-panel-elev)' }}>
              <div className="font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                Key Takeaways &amp; Rules
              </div>
              <ul className="flex flex-col gap-1.5 text-xs leading-relaxed pl-4 list-disc" style={{ color: 'var(--text-primary)' }}>
                {activeLesson.points.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            </div>

            {/* Curated example sentences with kana readings & TTS */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Example Sentences ({activeLesson.examples.length})
                </span>
                <button
                  type="button"
                  onClick={() => loadLiveExamplesForLesson(activeLesson)}
                  className="px-2.5 py-1 rounded-md text-xs font-medium"
                  style={{ background: 'var(--bg-panel-elev)', color: 'var(--accent)', border: '1px solid var(--border)' }}
                >
                  {liveLoading ? 'Fetching Tatoeba…' : '🌐 + Fetch More Live Tatoeba Sentences'}
                </button>
              </div>

              {activeLesson.examples.map((ex, i) => (
                <div
                  key={i}
                  className="rounded-lg p-3 flex items-center justify-between gap-3"
                  style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)' }}
                >
                  <div className="min-w-0">
                    <div className="text-base font-medium" style={{ color: 'var(--text-primary)' }}>
                      {ex.jp}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--accent)' }}>
                      {ex.reading}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                      {ex.en}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => speakJapanese(ex.jp)}
                    className="px-2.5 py-1.5 rounded-md text-xs font-medium shrink-0"
                    style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
                    title="Pronounce example sentence"
                  >
                    🔊
                  </button>
                </div>
              ))}

              {liveSentences.length > 0 && (
                <div className="mt-2 flex flex-col gap-1.5">
                  <div className="font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                    Live Sentences from Tatoeba REST API v1
                  </div>
                  {liveSentences.map((s) => (
                    <div
                      key={s.id}
                      className="rounded-lg p-3 flex items-center justify-between gap-3"
                      style={{ background: 'var(--bg-app)', border: '1px solid var(--border)' }}
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                          {s.jp}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {s.en}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => speakJapanese(s.jp)}
                        className="px-2 py-1 rounded text-xs shrink-0"
                        style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
                      >
                        🔊
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* 6-Stage Quick-Start Interactive Course */
        <div className="flex flex-col gap-4">
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {nihongoStages.map((s) => (
              <button
                key={s.id}
                onClick={() => setStageId(s.id)}
                className="shrink-0 text-xs px-3 py-1.5 rounded-full whitespace-nowrap"
                style={{
                  border: `1px solid ${stageId === s.id ? 'var(--accent)' : 'var(--border)'}`,
                  background: stageId === s.id ? 'var(--accent-soft)' : 'var(--bg-panel)',
                  color: stageId === s.id ? 'var(--accent)' : 'var(--text-secondary)',
                }}
              >
                {s.title}
              </button>
            ))}
          </div>

          <div className="surface rounded-lg p-5">
            <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{stage.title}</h2>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{stage.blurb}</p>

            <ul className="flex flex-col gap-2 mb-4">
              {stage.notes.map((n, i) => (
                <li key={i} className="text-sm leading-relaxed pl-4" style={{ color: 'var(--text-primary)', borderLeft: '2px solid var(--border)' }}>{n}</li>
              ))}
            </ul>

            {stage.example && (
              <div className="bordered rounded-md overflow-hidden mb-4">
                <div className="px-3 py-1.5 text-[11px] font-mono flex items-center justify-between" style={{ background: 'var(--bg-panel-elev)', color: 'var(--text-secondary)' }}>
                  <span>{stage.example.label}</span>
                  {stage.example.source && <span>{stage.example.source}</span>}
                </div>
                <pre className="px-3 py-3 text-xs overflow-x-auto whitespace-pre-wrap" style={{ background: 'var(--bg-app)', color: 'var(--text-primary)' }}>
                  <code>{stage.example.snippet}</code>
                </pre>
              </div>
            )}
          </div>

          {stage.quiz.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>Quick check</h3>
              <MiniQuiz questions={stage.quiz} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
