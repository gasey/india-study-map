import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/store';
import type { TimelineEvent } from '@/types';

interface TimelineProps {
  events: TimelineEvent[];
  onEventSelect: (event: TimelineEvent | null, index: number) => void;
}

export function Timeline({ events, onEventSelect }: TimelineProps) {
  const { eventIndex, setEventIndex } = useApp();
  const [playing, setPlaying] = useState(false);
  const timer = useRef<number | null>(null);

  function select(idx: number, fromAutoplay = false) {
    if (!fromAutoplay) setPlaying(false);
    if (idx === eventIndex && !fromAutoplay) {
      // Clicking the active dot deselects
      setEventIndex(-1);
      onEventSelect(null, -1);
    } else {
      setEventIndex(idx);
      onEventSelect(events[idx], idx);
    }
  }

  // Story mode: fly through the events like a guided tour.
  useEffect(() => {
    if (!playing) {
      if (timer.current) window.clearTimeout(timer.current);
      return;
    }
    const next = eventIndex + 1;
    if (next >= events.length) {
      setPlaying(false);
      return;
    }
    timer.current = window.setTimeout(() => select(next, true), eventIndex === -1 ? 200 : 3400);
    return () => { if (timer.current) window.clearTimeout(timer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, eventIndex, events.length]);

  function togglePlay() {
    if (playing) { setPlaying(false); return; }
    // Restart from the beginning if we're at the end or nothing selected yet
    if (eventIndex >= events.length - 1) {
      setEventIndex(-1);
      onEventSelect(null, -1);
    }
    setPlaying(true);
  }

  const active = eventIndex >= 0 ? events[eventIndex] : null;

  return (
    <div className="absolute left-0 right-0 bottom-16 lg:bottom-0 z-[400] pointer-events-none">
      <div className="mx-auto max-w-3xl px-4 pb-4 pointer-events-auto">
        {/* Active event description */}
        <AnimatePresence mode="wait">
          {active && (
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="mb-3 surface rounded-lg px-4 py-3 shadow-lg"
            >
              <div className="flex items-baseline gap-3 mb-1">
                <span
                  className="font-mono text-xs shrink-0"
                  style={{ color: 'var(--accent)' }}
                >
                  {active.date}
                </span>
                <span className="font-display text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {active.label}
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {active.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scrubber track */}
        <div className="surface rounded-full px-5 py-3 shadow-lg flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-transform hover:scale-105 active:scale-95"
            style={{ background: 'var(--accent)', color: '#fff' }}
            aria-label={playing ? 'Pause story' : 'Play the story'}
            title={playing ? 'Pause' : 'Play the story \u2014 fly through every event'}
          >
            {playing ? '\u23f8' : '\u25b6'}
          </button>
          <span className="label-eyebrow shrink-0">Timeline</span>
          <div className="flex-1 relative h-6 flex items-center">
            {/* Track line */}
            <div
              className="absolute left-0 right-0 h-px"
              style={{ background: 'var(--border)' }}
            />
            {/* Event dots */}
            <div className="relative w-full flex justify-between">
              {events.map((evt, idx) => {
                const isActive = idx === eventIndex;
                return (
                  <button
                    key={evt.id}
                    onClick={() => select(idx)}
                    className="group relative flex flex-col items-center"
                    aria-label={evt.label}
                  >
                    <motion.span
                      className="block rounded-full border-2"
                      style={{
                        background: isActive ? 'var(--accent)' : 'var(--bg-panel)',
                        borderColor: 'var(--accent)',
                      }}
                      animate={{
                        width: isActive ? 14 : 10,
                        height: isActive ? 14 : 10,
                      }}
                      transition={{ duration: 0.2 }}
                    />
                    {/* Hover label */}
                    <span
                      className="absolute top-6 whitespace-nowrap font-mono text-[10px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {evt.date.split('-')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
