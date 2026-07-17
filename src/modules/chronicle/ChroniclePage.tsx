import { useState } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { useApp } from '@/lib/store';
import { ModuleSwitcher } from '@/modules/ModuleSwitcher';
import { useHasDesktopChrome } from '@/lib/useShellChrome';
import type { Year } from '@/data/timeline/types';
import { useTimelineData } from './useTimelineData';
import { TimelineCanvas } from './TimelineCanvas';
import { EntryDrawer } from './EntryDrawer';
import { RangeQuiz } from './RangeQuiz';

// ============================================
// CHRONICLE — master timeline (history + polity lanes).
// Selection + the join data live here so the canvas, drawer, and range
// quiz all share one useTimelineData() call.
// ============================================

export function ChroniclePage() {
  const { theme, toggleTheme } = useApp();
  const trackMode = useApp((s) => s.chronicle.trackMode);
  const hasDesktopChrome = useHasDesktopChrome('home');
  const { renderEntries, orphanQuestions } = useTimelineData();
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [quizRange, setQuizRange] = useState<{ start: Year; end: Year } | null>(null);

  const selected = renderEntries.find((r) => r.entry.id === selectedEntryId) ?? null;

  return (
    <MotionConfig reducedMotion="user">
      <div className="h-full flex flex-col" style={{ background: 'var(--bg-app)', color: 'var(--text-primary)' }}>
        <header
          className="safe-top h-12 shrink-0 border-b flex items-center justify-between px-5 gap-3"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-panel)' }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className={hasDesktopChrome ? 'lg:hidden' : ''}>
              <ModuleSwitcher />
            </span>
            <span className="label-eyebrow hidden md:inline">Chronicle — Master Timeline</span>
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

        <main className="relative flex-1 min-h-0">
          <TimelineCanvas
            renderEntries={renderEntries}
            orphanQuestions={orphanQuestions}
            selectedEntryId={selectedEntryId}
            onSelectEntry={setSelectedEntryId}
            onStartRangeQuiz={(start, end) => setQuizRange({ start, end })}
          />
          <AnimatePresence>
            {selected && (
              <EntryDrawer
                key={selected.entry.id}
                renderEntry={selected}
                onClose={() => setSelectedEntryId(null)}
                onSelectEntry={setSelectedEntryId}
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {quizRange && (
              <RangeQuiz
                key={`${quizRange.start}-${quizRange.end}`}
                startYear={quizRange.start}
                endYear={quizRange.end}
                trackMode={trackMode}
                renderEntries={renderEntries}
                onClose={() => setQuizRange(null)}
                onSelectEntry={setSelectedEntryId}
              />
            )}
          </AnimatePresence>
        </main>
      </div>
    </MotionConfig>
  );
}

export default ChroniclePage;
