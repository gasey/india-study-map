import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { ChronicleTrackMode } from '@/lib/store';
import { formatYear, type Year, type TimelineEntry } from '@/data/timeline/types';
import type { BankQuestion } from '@/data/banks/types';
import type { TimelineRenderEntry } from './useTimelineData';
import { QuestionCard } from './EntryDrawer';

interface RangeQuizProps {
  startYear: Year;
  endYear: Year;
  trackMode: ChronicleTrackMode;
  renderEntries: TimelineRenderEntry[];
  onClose: () => void;
  onSelectEntry: (id: string) => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** "Quiz range" (spec §6): every attached question whose entry falls
 *  inside the current on-screen year range, respecting the track filter —
 *  shuffled into a single MCQ session, reusing EntryDrawer's QuestionCard. */
export function RangeQuiz({ startYear, endYear, trackMode, renderEntries, onClose, onSelectEntry }: RangeQuizProps) {
  const { questions, questionEntry, entryById } = useMemo(() => {
    const lo = Math.min(startYear, endYear);
    const hi = Math.max(startYear, endYear);
    const inRange = renderEntries.filter((r) => {
      if (trackMode !== 'both' && r.entry.track !== trackMode) return false;
      const entryEnd = r.entry.endYear ?? r.entry.year;
      return r.entry.year <= hi && entryEnd >= lo;
    });
    const seen = new Set<string>();
    const qMap = new Map<string, TimelineEntry>();
    const eMap = new Map<string, TimelineEntry>();
    const qs: BankQuestion[] = [];
    for (const r of inRange) {
      eMap.set(r.entry.id, r.entry);
      for (const q of r.questions) {
        if (seen.has(q.id)) continue;
        seen.add(q.id);
        qMap.set(q.id, r.entry);
        qs.push(q);
      }
    }
    return { questions: shuffle(qs), questionEntry: qMap, entryById: eMap };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [idx, setIdx] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [session, setSession] = useState({ right: 0, wrong: 0 });
  const [wrongEntryIds, setWrongEntryIds] = useState<Set<string>>(new Set());

  const q = questions[idx];
  const done = idx >= questions.length;
  const weakEntries = [...wrongEntryIds]
    .map((id) => entryById.get(id))
    .filter((e): e is TimelineEntry => e !== undefined);

  function handleAnswered(correct: boolean) {
    setAnswered(true);
    setSession((s) => ({ right: s.right + (correct ? 1 : 0), wrong: s.wrong + (correct ? 0 : 1) }));
    if (!correct && q) {
      const entry = questionEntry.get(q.id);
      if (entry) setWrongEntryIds((prev) => new Set(prev).add(entry.id));
    }
  }

  function next() {
    setAnswered(false);
    setIdx((i) => i + 1);
  }

  return (
    <motion.div
      className="fixed inset-0 z-[700] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.45)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-lg max-h-[85dvh] overflow-y-auto scroll-panel rounded-xl p-5"
        style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <span
              className="grid place-items-center w-9 h-9 rounded-xl text-lg shrink-0"
              style={{
                background: 'linear-gradient(135deg, var(--accent), var(--accent-light))',
                boxShadow: '0 2px 8px color-mix(in srgb, var(--accent) 40%, transparent)',
              }}
            >
              ✦
            </span>
            <div>
              <h2 className="text-lg font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
                Quiz range
              </h2>
              <p className="text-xs tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                {formatYear(Math.round(Math.min(startYear, endYear)))} – {formatYear(Math.round(Math.max(startYear, endYear)))}
                {questions.length > 0 && ` · ${questions.length} question${questions.length === 1 ? '' : 's'}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md hover:bg-[var(--bg-panel-elev)] transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            title="Close"
          >
            ✕
          </button>
        </div>

        {questions.length > 0 && !done && (
          <div className="h-1.5 rounded-full mb-4 overflow-hidden" style={{ background: 'var(--bg-panel-elev)' }}>
            <div
              className="h-full rounded-full transition-[width] duration-500 ease-out"
              style={{
                width: `${(idx / questions.length) * 100}%`,
                background: 'linear-gradient(90deg, var(--accent), var(--accent-light))',
              }}
            />
          </div>
        )}

        {questions.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            No attached questions in this range yet — zoom/pan to a denser era, or answer questions from an entry's
            drawer first.
          </p>
        ) : done ? (
          <div className="text-center py-4">
            <motion.div
              className="text-5xl mb-2"
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 16 }}
            >
              {session.wrong === 0 ? '🏆' : session.right >= session.wrong ? '🎉' : '🏁'}
            </motion.div>
            <p className="text-2xl font-bold mb-0.5 tabular-nums" style={{ color: 'var(--text-primary)' }}>
              {session.right} <span style={{ color: 'var(--text-muted)' }}>/ {questions.length}</span>
            </p>
            <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
              {Math.round((session.right / questions.length) * 100)}% correct
              {session.wrong === 0 ? ' — flawless!' : session.right >= session.wrong ? ' — nicely done' : ' — keep at it'}
            </p>
            {weakEntries.length > 0 && (
              <div className="mt-4 text-left">
                <p className="label-eyebrow mb-2" style={{ fontSize: 10 }}>
                  Weak entries — revisit these
                </p>
                <div className="flex flex-col gap-1.5">
                  {weakEntries.map((entry) => (
                    <button
                      key={entry.id}
                      onClick={() => {
                        onSelectEntry(entry.id);
                        onClose();
                      }}
                      className="text-left px-2.5 py-1.5 rounded-md text-xs hover:bg-[var(--bg-panel-elev)] transition-colors"
                      style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                    >
                      {entry.title}{' '}
                      <span style={{ color: 'var(--text-muted)' }}>— {formatYear(entry.year, entry.circa)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between text-xs mb-2.5">
              <span className="font-medium tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                Question {idx + 1} of {questions.length}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded-full text-[11px] font-semibold tabular-nums" style={{ color: '#2e7d5b', background: 'rgba(46,125,91,0.14)' }}>
                  {session.right} ✓
                </span>
                <span className="px-1.5 py-0.5 rounded-full text-[11px] font-semibold tabular-nums" style={{ color: '#a5504a', background: 'rgba(165,80,74,0.12)' }}>
                  {session.wrong} ✗
                </span>
              </span>
            </div>
            {/* Keyed on q.id → remounts (and replays the enter slide) each
                question, without AnimatePresence's exit-hold, which otherwise
                stalled the answered-state flow and hid the Next button. */}
            <motion.div
              key={q.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.25 }}
            >
              <QuestionCard question={q} onAnswered={handleAnswered} />
            </motion.div>
            {answered && (
              <motion.div
                className="mt-3 flex justify-end"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  onClick={next}
                  className="px-5 py-2 rounded-lg text-sm font-semibold transition-all hover:brightness-110 active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent), var(--accent-light))',
                    color: '#fff',
                    boxShadow: '0 2px 8px color-mix(in srgb, var(--accent) 40%, transparent)',
                  }}
                >
                  {idx + 1 < questions.length ? 'Next →' : 'Finish'}
                </button>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
