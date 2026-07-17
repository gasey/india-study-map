import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '@/lib/store';
import { chapters } from '@/data';
import type { Chapter } from '@/types';
import { timelineEntries } from '@/data/timeline';
import { TRACKS, formatYear, type TimelineEntry } from '@/data/timeline/types';
import { banks } from '@/data/banks';
import type { BankQuestion } from '@/data/banks/types';
import type { TimelineRenderEntry } from './useTimelineData';

interface EntryDrawerProps {
  renderEntry: TimelineRenderEntry;
  onClose: () => void;
  onSelectEntry: (id: string) => void;
}

function bankIdForQuestion(questionId: string): string | undefined {
  return banks.find((b) => b.questions.some((q) => q.id === questionId))?.id;
}

/** Chapters sharing a tag with this entry — same pattern as PyqPage's
 *  relatedChapters, one-directional (entry -> chapters). */
function relatedChapters(entry: TimelineEntry): Chapter[] {
  if (!entry.tags?.length) return [];
  return chapters.filter((c) => c.tags?.some((t) => entry.tags!.includes(t))).slice(0, 3);
}

function relatedEntries(entry: TimelineEntry): TimelineEntry[] {
  const linked = (entry.linksTo ?? [])
    .map((id) => timelineEntries.find((e) => e.id === id))
    .filter((e): e is TimelineEntry => e !== undefined);
  const linkedIds = new Set(linked.map((e) => e.id));
  const sameTag = entry.tags?.length
    ? timelineEntries
        .filter((e) => e.id !== entry.id && !linkedIds.has(e.id) && e.tags?.some((t) => entry.tags!.includes(t)))
        .slice(0, 3)
    : [];
  return [...linked, ...sameTag];
}

export function QuestionCard({ question, onAnswered }: { question: BankQuestion; onAnswered?: (correct: boolean) => void }) {
  const recordBankAttempt = useApp((s) => s.recordBankAttempt);
  const [picked, setPicked] = useState<number | null>(null);

  function answer(i: number) {
    if (picked !== null) return;
    setPicked(i);
    const correct = i === question.answerIndex;
    const bankId = bankIdForQuestion(question.id);
    if (bankId) recordBankAttempt(bankId, question.id, correct);
    onAnswered?.(correct);
  }

  const wasCorrect = picked !== null && picked === question.answerIndex;

  return (
    <div className="rounded-lg p-3" style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)' }}>
      <p className="text-sm font-medium mb-2.5 leading-relaxed">{question.question}</p>
      <div className="space-y-1.5">
        {question.options.map((opt, i) => {
          const isAnswer = i === question.answerIndex;
          const isPicked = i === picked;
          let style: React.CSSProperties = { background: 'var(--bg-panel)', border: '1px solid var(--border)' };
          if (picked !== null) {
            if (isAnswer) style = { background: 'rgba(46,125,91,0.14)', border: '1px solid #2e7d5b' };
            else if (isPicked) style = { background: 'rgba(165,80,74,0.12)', border: '1px solid #a5504a' };
            else style = { ...style, opacity: 0.55 };
          }
          const mark = picked !== null && isAnswer ? '✓' : picked !== null && isPicked ? '✗' : null;
          return (
            <button
              key={i}
              onClick={() => answer(i)}
              disabled={picked !== null}
              className="w-full flex items-center gap-2 text-left px-2.5 py-2 rounded text-xs transition-colors enabled:hover:brightness-105"
              style={style}
            >
              <span
                className="grid place-items-center w-5 h-5 shrink-0 rounded-full text-[10px] font-semibold"
                style={{
                  color: mark === '✓' ? '#2e7d5b' : mark === '✗' ? '#a5504a' : 'var(--text-secondary)',
                  background: mark ? 'var(--bg-panel)' : 'transparent',
                  border: mark ? '1px solid currentColor' : '1px solid var(--border)',
                }}
              >
                {mark ?? String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1">{opt}</span>
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <p className="mt-2.5 text-xs font-semibold" style={{ color: wasCorrect ? '#2e7d5b' : '#a5504a' }}>
            {wasCorrect ? '✓ Correct' : '✗ Not quite'}
          </p>
          <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {question.explanation}
          </p>
        </motion.div>
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="label-eyebrow mb-2" style={{ fontSize: 10 }}>
      {children}
    </div>
  );
}

export function EntryDrawer({ renderEntry, onClose, onSelectEntry }: EntryDrawerProps) {
  const { entry, questions } = renderEntry;
  const track = TRACKS[entry.track];
  const navigate = useNavigate();
  const setChapter = useApp((s) => s.setChapter);
  const note = useApp((s) => s.chronicle.notes[entry.id] ?? '');
  const setChronicleNote = useApp((s) => s.setChronicleNote);

  function jumpToChapter(chapterId: string) {
    setChapter(chapterId);
    navigate('/map');
  }

  const dateLine = entry.endYear !== undefined
    ? `${formatYear(entry.year, entry.circa)} – ${formatYear(entry.endYear, entry.circa)}`
    : formatYear(entry.year, entry.circa);

  const directChapter = entry.chapterId ? chapters.find((c) => c.id === entry.chapterId) : undefined;
  const tagChapters = relatedChapters(entry).filter((c) => c.id !== directChapter?.id);
  const related = relatedEntries(entry);

  return (
    <motion.div
      className="fixed inset-x-0 bottom-0 z-[600] lg:absolute lg:inset-x-auto lg:right-0 lg:top-0 lg:bottom-0 lg:w-[400px] flex flex-col rounded-t-2xl lg:rounded-none border-t lg:border-t-0 lg:border-l max-h-[75dvh] lg:max-h-none shadow-[0_-8px_32px_rgba(0,0,0,0.18)] lg:shadow-none"
      style={{ background: 'var(--bg-panel)', borderColor: 'var(--border)' }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.3 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className={`${track.cssClass} flex items-center justify-between px-4 py-3 border-b shrink-0`}
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wide shrink-0"
            style={{ color: 'var(--subject)', border: '1px solid var(--subject)' }}
          >
            {track.label}
          </span>
          <span className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
            {dateLine}
          </span>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-md shrink-0 hover:bg-[var(--bg-panel-elev)] transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          title="Close"
        >
          ✕
        </button>
      </div>

      <div className="scroll-panel flex-1 min-h-0 overflow-y-auto px-4 py-4 flex flex-col gap-5">
        <div>
          <h2 className="text-lg font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
            {entry.title}
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {entry.summary}
          </p>
          {entry.detail && (
            <p className="text-sm leading-relaxed mt-2" style={{ color: 'var(--text-primary)' }}>
              {entry.detail}
            </p>
          )}
        </div>

        {questions.length > 0 && (
          <div>
            <SectionLabel>Questions ({questions.length})</SectionLabel>
            <div className="flex flex-col gap-2">
              {questions.map((q) => (
                <QuestionCard key={q.id} question={q} />
              ))}
            </div>
          </div>
        )}

        {(directChapter || tagChapters.length > 0) && (
          <div>
            <SectionLabel>On the map</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {directChapter && (
                <button
                  onClick={() => jumpToChapter(directChapter.id)}
                  className="px-2.5 py-1.5 rounded-md text-xs hover:opacity-80 transition-opacity"
                  style={{ border: '1px solid var(--accent)', color: 'var(--accent)' }}
                >
                  🗺️ {directChapter.title}
                </button>
              )}
              {tagChapters.map((c) => (
                <button
                  key={c.id}
                  onClick={() => jumpToChapter(c.id)}
                  className="px-2.5 py-1.5 rounded-md text-xs hover:opacity-80 transition-opacity"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                >
                  🗺️ {c.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {related.length > 0 && (
          <div>
            <SectionLabel>Related</SectionLabel>
            <div className="flex flex-col gap-1.5">
              {related.map((e) => (
                <button
                  key={e.id}
                  onClick={() => onSelectEntry(e.id)}
                  className="text-left px-2.5 py-1.5 rounded-md text-xs hover:bg-[var(--bg-panel-elev)] transition-colors"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                >
                  {e.title}{' '}
                  <span style={{ color: 'var(--text-muted)' }}>
                    — {formatYear(e.year, e.circa)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <SectionLabel>My note</SectionLabel>
          <textarea
            value={note}
            onChange={(e) => setChronicleNote(entry.id, e.target.value)}
            placeholder="Jot a study note for this entry…"
            rows={3}
            className="w-full rounded-md px-2.5 py-2 text-xs resize-none"
            style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          />
        </div>
      </div>
    </motion.div>
  );
}
