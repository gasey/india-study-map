import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/store';
import { distanceKm } from '@/lib/geo';
import type { Chapter, QuizItem } from '@/types';

interface QuizPanelProps {
  chapter: Chapter;
  /** The lat/lng the user clicked on the map (if any) for the current question. */
  mapClick: { lat: number; lng: number } | null;
  /** Clear the map click (called when moving to next question). */
  clearMapClick: () => void;
  /** Tell parent to show/hide the answer marker on the map. */
  setShowAnswer: (show: boolean) => void;
}

export function QuizPanel({ chapter, mapClick, clearMapClick, setShowAnswer }: QuizPanelProps) {
  const { setMode, quizIndex, nextQuestion, resetQuiz, recordAttempt } = useApp();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);

  const item: QuizItem | undefined = chapter.quiz[quizIndex];
  const total = chapter.quiz.length;

  function handleSubmit() {
    if (!item) return;
    let correct = false;

    if (item.type === 'mcq') {
      if (selectedOption === null) return;
      correct = selectedOption === item.answerIndex;
    } else if (item.type === 'map_click') {
      if (!mapClick) return;
      const dist = distanceKm(mapClick, { lat: item.answer.lat, lng: item.answer.lng });
      correct = dist <= item.answer.toleranceKm;
    }

    setLastCorrect(correct);
    setSubmitted(true);
    setShowAnswer(true);
    recordAttempt(chapter.id, item.id, correct);
  }

  function handleNext() {
    setSubmitted(false);
    setSelectedOption(null);
    setLastCorrect(null);
    setShowAnswer(false);
    clearMapClick();
    nextQuestion();
  }

  function handleExit() {
    setSubmitted(false);
    setSelectedOption(null);
    setLastCorrect(null);
    setShowAnswer(false);
    clearMapClick();
    resetQuiz();
    setMode('study');
  }

  // Finished
  if (!item) {
    return (
      <div className="h-full flex flex-col">
        <div className="px-6 py-5 border-b border-themed flex items-center justify-between">
          <div>
            <div className="label-eyebrow mb-1">Chapter Quiz</div>
            <h2 className="font-display text-2xl" style={{ color: 'var(--text-primary)' }}>
              Complete
            </h2>
          </div>
        </div>
        <div className="px-6 py-8 flex-1 flex flex-col items-center justify-center text-center">
          {(() => {
            const prog = useApp.getState().progress[chapter.id];
            const got = prog ? chapter.quiz.filter((q) => prog.completed.includes(q.id)).length : 0;
            const pct = total ? Math.round((got / total) * 100) : 0;
            const C = 2 * Math.PI * 34;
            return (
              <div className="relative w-24 h-24 mb-4 anim-correct">
                <svg viewBox="0 0 80 80" className="w-24 h-24 -rotate-90">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="var(--border)" strokeWidth="7" />
                  <motion.circle
                    cx="40" cy="40" r="34" fill="none"
                    stroke="var(--accent)" strokeWidth="7" strokeLinecap="round"
                    strokeDasharray={C}
                    initial={{ strokeDashoffset: C }}
                    animate={{ strokeDashoffset: C * (1 - pct / 100) }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-display text-xl" style={{ color: 'var(--text-primary)' }}>
                  {pct}%
                </div>
              </div>
            );
          })()}
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            You've finished the {chapter.title} quiz.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => { resetQuiz(); setSubmitted(false); setLastCorrect(null); }}
              className="px-4 py-2 rounded-md text-sm font-medium border border-themed hover:bg-[var(--bg-panel-elev)] transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              Retake
            </button>
            <button
              onClick={handleExit}
              className="px-4 py-2 rounded-md text-sm font-medium"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              Back to chapter
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header with progress */}
      <div className="px-6 py-5 border-b border-themed">
        <div className="flex items-center justify-between mb-3">
          <div className="label-eyebrow">
            Question {quizIndex + 1} of {total}
          </div>
          <button
            onClick={handleExit}
            className="text-xs hover:underline"
            style={{ color: 'var(--text-muted)' }}
          >
            Exit quiz
          </button>
        </div>
        {/* Progress bar */}
        <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
          <motion.div
            className="h-full"
            style={{ background: 'var(--accent)' }}
            initial={{ width: 0 }}
            animate={{ width: `${(quizIndex / total) * 100}%` }}
            transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question body */}
      <div className="scroll-panel px-6 py-5 flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.3 }}
          >
            <p
              className="font-display text-lg leading-snug mb-5"
              style={{ color: 'var(--text-primary)' }}
            >
              {item.question}
            </p>

            {item.type === 'mcq' && (
              <div className="space-y-2">
                {item.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = submitted && idx === item.answerIndex;
                  const isWrong = submitted && isSelected && idx !== item.answerIndex;

                  return (
                    <button
                      key={idx}
                      onClick={() => !submitted && setSelectedOption(idx)}
                      disabled={submitted}
                      className={`w-full text-left px-4 py-3 rounded-md border transition-all text-sm ${
                        isCorrect
                          ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                          : isWrong
                          ? 'border-[#c46a3d] bg-[#c46a3d]/10'
                          : isSelected
                          ? 'border-[var(--accent)] bg-[var(--bg-panel-elev)]'
                          : 'border-themed hover:bg-[var(--bg-panel-elev)]'
                      }`}
                      style={{ color: 'var(--text-primary)' }}
                    >
                      <span className="font-mono text-xs mr-3" style={{ color: 'var(--text-muted)' }}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}

            {item.type === 'map_click' && (
              <div
                className="rounded-md border border-themed px-4 py-3 surface-elev"
              >
                <div className="label-eyebrow mb-2">Map click required</div>
                {mapClick ? (
                  <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                    Your guess: <span className="font-mono">
                      {mapClick.lat.toFixed(2)}, {mapClick.lng.toFixed(2)}
                    </span>
                  </p>
                ) : (
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Click anywhere on the map to place your answer.
                  </p>
                )}
              </div>
            )}

            {/* Result + explanation */}
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-5 rounded-md border px-4 py-3 ${lastCorrect ? 'anim-correct' : 'anim-shake'}`}
                style={{
                  borderColor: lastCorrect ? 'var(--accent)' : '#c46a3d',
                  background: lastCorrect ? 'rgba(58, 122, 122, 0.08)' : 'rgba(196, 106, 61, 0.08)',
                }}
              >
                <div
                  className="text-sm font-medium mb-1"
                  style={{ color: lastCorrect ? 'var(--accent)' : '#c46a3d' }}
                >
                  {lastCorrect ? 'Correct.' : 'Not quite.'}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  {item.explanation}
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer actions */}
      <div className="px-6 py-4 border-t border-themed surface-elev">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={item.type === 'mcq' ? selectedOption === null : !mapClick}
            className="w-full py-3 rounded-md font-medium text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:opacity-90 enabled:active:scale-[0.98]"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            Submit answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full py-3 rounded-md font-medium text-sm transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            {quizIndex + 1 < total ? 'Next question' : 'Finish'}
          </button>
        )}
      </div>
    </div>
  );
}
