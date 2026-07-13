import { motion } from 'framer-motion';
import { useApp } from '@/lib/store';
import { chapters } from '@/data';
import { getConnections, tagLabel } from '@/lib/connections';
import type { Chapter } from '@/types';

interface FactsPanelProps {
  chapter: Chapter;
}

export function FactsPanel({ chapter }: FactsPanelProps) {
  const { setMode, setChapter, progress } = useApp();
  const chapterProgress = progress[chapter.id];
  const completedCount = chapterProgress?.completed.length ?? 0;
  const totalQuiz = chapter.quiz.length;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-5 border-b border-themed">
        <div className="label-eyebrow mb-1">{chapter.subject}</div>
        <h2 className="font-display text-2xl leading-tight" style={{ color: 'var(--text-primary)' }}>
          {chapter.title}
        </h2>
        <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
          {chapter.summary}
        </p>
      </div>

      {/* Focus banner — the one sentence the chapter exists to teach */}
      {chapter.focus && (
        <div
          className="px-6 py-4 border-b border-themed"
          style={{ background: 'var(--bg-panel-elev)' }}
        >
          <div className="label-eyebrow mb-2" style={{ color: 'var(--accent)' }}>
            The Idea
          </div>
          <p
            className="font-display text-base leading-snug italic"
            style={{ color: 'var(--text-primary)' }}
          >
            “{chapter.focus}”
          </p>
        </div>
      )}

      {/* Facts */}
      <div className="px-6 py-5 flex-1 overflow-y-auto">
        <div className="label-eyebrow mb-3">Key Facts</div>
        <ul className="space-y-3">
          {chapter.facts.map((fact, idx) => (
            <motion.li
              key={fact.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04, ease: [0.22, 1, 0.36, 1] }}
              className="flex gap-3"
            >
              <span
                className="font-mono text-xs mt-1 shrink-0"
                style={{ color: 'var(--text-muted)' }}
              >
                {String(idx + 1).padStart(2, '0')}
              </span>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                {fact.text}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Cross-subject connections — same river/place, different chapter */}
      {(() => {
        const conns = getConnections(chapter, chapters);
        if (conns.length === 0) return null;
        return (
          <div className="px-6 py-5 border-t border-themed">
            <div className="label-eyebrow mb-1">Connections</div>
            <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
              The same rivers, places, and ranges appear elsewhere — geography carries history.
            </p>
            <ul className="space-y-2">
              {conns.map(({ chapter: c, shared }) => (
                <li key={c.id}>
                  <button
                    onClick={() => setChapter(c.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-md border transition-all hover:translate-x-0.5 hover:shadow-sm subject-${c.subject}`}
                    style={{ borderColor: 'var(--border)', background: 'var(--bg-panel-elev)' }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="subject-dot" />
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {c.title}
                      </span>
                      <span className="ml-auto text-xs" style={{ color: 'var(--text-muted)' }}>
                        {c.subject}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {shared.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] px-1.5 py-0.5 rounded-full font-mono"
                          style={{
                            background: 'color-mix(in srgb, var(--subject) 12%, transparent)',
                            color: 'var(--subject)',
                          }}
                        >
                          {tagLabel(t)}
                        </span>
                      ))}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      })()}

      {/* Quiz launcher */}
      <div className="px-6 py-5 border-t border-themed surface-elev">
        <div className="flex items-center justify-between mb-3">
          <div className="label-eyebrow">Chapter Quiz</div>
          <div className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
            {completedCount}/{totalQuiz}
          </div>
        </div>
        <button
          onClick={() => setMode('quiz')}
          className="w-full py-3 rounded-md font-medium text-sm transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          {completedCount === 0 ? 'Start quiz' : completedCount === totalQuiz ? 'Retake quiz' : 'Continue quiz'}
        </button>
        <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
          {totalQuiz} questions — mix of map-click and multiple choice.
        </p>
      </div>
    </div>
  );
}
