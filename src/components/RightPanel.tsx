import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useApp } from '@/lib/store';
import { FactsPanel } from './FactsPanel';
import { QuizPanel } from './QuizPanel';
import type { Chapter } from '@/types';

interface RightPanelProps {
  chapter: Chapter;
  mapClick: { lat: number; lng: number } | null;
  clearMapClick: () => void;
  setShowAnswer: (show: boolean) => void;
  /** Render without the desktop column chrome — used inside the mobile sheet. */
  frameless?: boolean;
}

export function RightPanel({ chapter, mapClick, clearMapClick, setShowAnswer, frameless }: RightPanelProps) {
  const mode = useApp((s) => s.mode);

  return (
    <aside className={frameless ? 'h-full w-full overflow-hidden' : 'surface w-96 shrink-0 border-l overflow-hidden h-full'}>
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.25 }}
          className="h-full"
        >
          {mode === 'study' ? (
            <FactsPanel chapter={chapter} />
          ) : (
            <QuizPanel
              chapter={chapter}
              mapClick={mapClick}
              clearMapClick={clearMapClick}
              setShowAnswer={setShowAnswer}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </aside>
  );
}
