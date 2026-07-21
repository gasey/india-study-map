import { useRef, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { useApp } from '@/lib/store';
import type { Year } from '@/data/timeline/types';
import { useTimelineData } from './useTimelineData';
import { TimelineCanvas, type ChronicleScaleHandle, type ChronicleViewInfo } from './TimelineCanvas';
import { TopBar } from './TopBar';
import { ControlsRow } from './ControlsRow';
import { ReadingView } from './ReadingView';
import { CommandPalette } from './CommandPalette';
import { useCommandPalette } from './useCommandPalette';
import { EntryDrawer } from './EntryDrawer';
import { RangeQuiz } from './RangeQuiz';

// ============================================
// CHRONICLE — master timeline (history + polity lanes).
// Selection + the join data live here so the canvas, drawer, and range
// quiz all share one useTimelineData() call. The top bar/controls row/
// command palette also live here (not in TimelineCanvas) so they can
// drive the canvas's zoom/pan — see ChronicleScaleHandle/ChronicleViewInfo.
// ============================================

export function ChroniclePage() {
  const trackMode = useApp((s) => s.chronicle.trackMode);
  const view = useApp((s) => s.chronicle.view);
  const { renderEntries, orphanQuestions } = useTimelineData();
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [quizRange, setQuizRange] = useState<{ start: Year; end: Year } | null>(null);
  const [viewInfo, setViewInfo] = useState<ChronicleViewInfo | null>(null);
  const scaleHandleRef = useRef<ChronicleScaleHandle | null>(null);

  const selected = renderEntries.find((r) => r.entry.id === selectedEntryId) ?? null;

  function startQuizForVisibleRange() {
    const range = scaleHandleRef.current?.getVisibleYearRange();
    if (range) setQuizRange(range);
  }

  const palette = useCommandPalette({
    renderEntries,
    scaleHandleRef,
    onSelectEntry: setSelectedEntryId,
    onQuizCurrentRange: startQuizForVisibleRange,
  });

  return (
    <MotionConfig reducedMotion="user">
      <div className="h-full flex flex-col" style={{ background: 'var(--bg-app)', color: 'var(--text-primary)' }}>
        <TopBar viewInfo={viewInfo} onOpenPalette={palette.open} />
        <ControlsRow viewInfo={viewInfo} scaleHandleRef={scaleHandleRef} onStartQuiz={startQuizForVisibleRange} />

        <main className="relative flex-1 min-h-0">
          {/* TimelineCanvas stays mounted even in Reading view — era pills
              still drive its zoom/pan (see ChronicleScaleHandle), so its
              scale state must survive the switch. Hidden via visibility,
              not unmount, so ResizeObserver never sees a spurious 0 width. */}
          <div className={view === 'reading' ? 'invisible pointer-events-none absolute inset-0' : 'absolute inset-0'}>
            <TimelineCanvas
              renderEntries={renderEntries}
              orphanQuestions={orphanQuestions}
              selectedEntryId={selectedEntryId}
              onSelectEntry={setSelectedEntryId}
              onScaleReady={(handle) => { scaleHandleRef.current = handle; }}
              onViewChange={setViewInfo}
              active={view === 'canvas'}
            />
          </div>
          {view === 'reading' && <ReadingView renderEntries={renderEntries} onSelectEntry={setSelectedEntryId} />}
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

        <CommandPalette {...palette} />
      </div>
    </MotionConfig>
  );
}

export default ChroniclePage;
