import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { chapters } from '@/data';
import { baseLayers } from '@/data/baseLayers';
import type { Importance } from '@/data/timeline/types';

type Theme = 'light' | 'dark';
type Mode = 'study' | 'quiz';
/** Which nav-shell arrangement wraps the app — see src/lib/shellStyles.ts. */
export type ShellStyle = '1a' | '1b' | '1c' | '2a';

interface ChapterProgress {
  /** quiz item id -> attempts (correct=true/false) */
  attempts: Record<string, { correct: boolean; at: number }[]>;
  /** total questions answered correctly at least once */
  completed: string[];
}

/** Per-deck progress — Flashcards module. */
interface DeckProgress {
  /** card ids marked "Known". */
  known: string[];
}

/** Per-question-bank progress — PYQ module. */
interface BankProgress {
  /** question id -> latest attempts */
  attempts: Record<string, { correct: boolean; at: number }[]>;
  /** correct at least once */
  mastered: string[];
}

export type ChronicleTrackMode = 'both' | 'history' | 'polity';

/** Chronicle module — master timeline. */
interface ChronicleState {
  /** entry id -> personal note. */
  notes: Record<string, string>;
  /** last viewport — restored on return; null before the first visit. */
  viewport: { zoom: number; panX: number } | null;
  trackMode: ChronicleTrackMode;
  /** Toolbar filter — lowers the LOD-computed ceiling, never raises it. */
  importanceCeiling: Importance;
  heat: boolean;
}

export interface AppState {
  theme: Theme;
  shellStyle: ShellStyle;
  currentChapterId: string;
  activeLayerIds: string[];
  /** Always-available base layer ids that are currently on. */
  activeBaseLayerIds: string[];
  mode: Mode;
  quizIndex: number;
  progress: Record<string, ChapterProgress>;
  /** keyed by bank id — decoupled from map chapters. */
  bankProgress: Record<string, BankProgress>;
  /** keyed by deck id — Flashcards module. */
  deckProgress: Record<string, DeckProgress>;
  eventIndex: number;
  /** Global basemap override — null = use each chapter's own choice. */
  basemapOverride: string | null;
  chronicle: ChronicleState;

  // actions
  toggleTheme: () => void;
  setShellStyle: (style: ShellStyle) => void;
  setChapter: (id: string) => void;
  toggleLayer: (layerId: string) => void;
  toggleBaseLayer: (layerId: string) => void;
  setActiveLayers: (layerIds: string[]) => void;
  setMode: (mode: Mode) => void;
  nextQuestion: () => void;
  resetQuiz: () => void;
  recordAttempt: (chapterId: string, quizId: string, correct: boolean) => void;
  recordBankAttempt: (bankId: string, questionId: string, correct: boolean) => void;
  resetBankProgress: (bankId: string) => void;
  markCard: (deckId: string, cardId: string, known: boolean) => void;
  resetDeckProgress: (deckId: string) => void;
  setEventIndex: (idx: number) => void;
  setBasemapOverride: (id: string | null) => void;
  setChronicleNote: (entryId: string, text: string) => void;
  setChronicleViewport: (v: { zoom: number; panX: number } | null) => void;
  setChronicleTrackMode: (m: ChronicleTrackMode) => void;
  setChronicleImportanceCeiling: (n: Importance) => void;
  toggleChronicleHeat: () => void;
}

function initialLayersFor(chapterId: string): string[] {
  const ch = chapters.find((c) => c.id === chapterId);
  if (!ch) return [];
  return ch.layers.filter((l) => l.defaultOn).map((l) => l.id);
}

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      shellStyle: '2a',
      currentChapterId: chapters[0]?.id ?? '',
      activeLayerIds: initialLayersFor(chapters[0]?.id ?? ''),
      activeBaseLayerIds: baseLayers.filter((l) => l.defaultOn).map((l) => l.id),
      mode: 'study',
      quizIndex: 0,
      progress: {},
      bankProgress: {},
      deckProgress: {},
      eventIndex: -1,
      basemapOverride: null,
      chronicle: { notes: {}, viewport: null, trackMode: 'both', importanceCeiling: 5, heat: false },

      toggleTheme: () =>
        set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),

      setShellStyle: (style) => set({ shellStyle: style }),

      setChapter: (id) =>
        set({
          currentChapterId: id,
          activeLayerIds: initialLayersFor(id),
          mode: 'study',
          quizIndex: 0,
          eventIndex: -1,
        }),

      toggleLayer: (layerId) =>
        set((s) => ({
          activeLayerIds: s.activeLayerIds.includes(layerId)
            ? s.activeLayerIds.filter((id) => id !== layerId)
            : [...s.activeLayerIds, layerId],
        })),

      toggleBaseLayer: (layerId) =>
        set((s) => ({
          activeBaseLayerIds: s.activeBaseLayerIds.includes(layerId)
            ? s.activeBaseLayerIds.filter((id) => id !== layerId)
            : [...s.activeBaseLayerIds, layerId],
        })),

      setActiveLayers: (layerIds) => set({ activeLayerIds: layerIds }),

      setMode: (mode) => set({ mode, quizIndex: 0 }),

      nextQuestion: () => set((s) => ({ quizIndex: s.quizIndex + 1 })),

      resetQuiz: () => set({ quizIndex: 0 }),

      setEventIndex: (idx) => set({ eventIndex: idx }),

      setBasemapOverride: (id) => set({ basemapOverride: id }),

      setChronicleNote: (entryId, text) =>
        set((s) => ({ chronicle: { ...s.chronicle, notes: { ...s.chronicle.notes, [entryId]: text } } })),

      setChronicleViewport: (v) => set((s) => ({ chronicle: { ...s.chronicle, viewport: v } })),

      setChronicleTrackMode: (m) => set((s) => ({ chronicle: { ...s.chronicle, trackMode: m } })),

      setChronicleImportanceCeiling: (n) => set((s) => ({ chronicle: { ...s.chronicle, importanceCeiling: n } })),

      toggleChronicleHeat: () => set((s) => ({ chronicle: { ...s.chronicle, heat: !s.chronicle.heat } })),

      recordAttempt: (chapterId, quizId, correct) =>
        set((s) => {
          const ch = s.progress[chapterId] ?? { attempts: {}, completed: [] };
          const prev = ch.attempts[quizId] ?? [];
          const next: ChapterProgress = {
            attempts: { ...ch.attempts, [quizId]: [...prev, { correct, at: Date.now() }] },
            completed:
              correct && !ch.completed.includes(quizId)
                ? [...ch.completed, quizId]
                : ch.completed,
          };
          return { progress: { ...s.progress, [chapterId]: next } };
        }),

      recordBankAttempt: (bankId, questionId, correct) =>
        set((s) => {
          const b = s.bankProgress[bankId] ?? { attempts: {}, mastered: [] };
          const prev = b.attempts[questionId] ?? [];
          const next: BankProgress = {
            attempts: { ...b.attempts, [questionId]: [...prev, { correct, at: Date.now() }] },
            mastered:
              correct && !b.mastered.includes(questionId)
                ? [...b.mastered, questionId]
                : b.mastered,
          };
          return { bankProgress: { ...s.bankProgress, [bankId]: next } };
        }),

      resetBankProgress: (bankId) =>
        set((s) => {
          const { [bankId]: _drop, ...rest } = s.bankProgress;
          return { bankProgress: rest };
        }),

      markCard: (deckId, cardId, known) =>
        set((s) => {
          const d = s.deckProgress[deckId] ?? { known: [] };
          const nextKnown = known
            ? d.known.includes(cardId) ? d.known : [...d.known, cardId]
            : d.known.filter((id) => id !== cardId);
          return { deckProgress: { ...s.deckProgress, [deckId]: { known: nextKnown } } };
        }),

      resetDeckProgress: (deckId) =>
        set((s) => {
          const { [deckId]: _drop, ...rest } = s.deckProgress;
          return { deckProgress: rest };
        }),
    }),
    {
      name: 'india-study-map',
      partialize: (s) => ({
        theme: s.theme,
        shellStyle: s.shellStyle,
        progress: s.progress,
        bankProgress: s.bankProgress,
        deckProgress: s.deckProgress,
        activeBaseLayerIds: s.activeBaseLayerIds,
        basemapOverride: s.basemapOverride,
        currentChapterId: s.currentChapterId,
        chronicle: s.chronicle,
      }),
      // Default persist merge is a shallow `{...current, ...persisted}` —
      // fine for top-level keys, but a persisted `chronicle` blob from
      // before a field was added (e.g. trackMode) would otherwise replace
      // the whole sub-object wholesale, leaving new fields `undefined`
      // instead of falling back to their default.
      merge: (persisted, current) => {
        const p = persisted as Partial<AppState>;
        return { ...current, ...p, chronicle: { ...current.chronicle, ...p.chronicle } };
      },
    }
  )
);

/** True once zustand/persist has finished reading localStorage. Components
 *  that snap to a persisted value on first mount (e.g. Chronicle's saved
 *  viewport) need this — reading the store before hydration completes sees
 *  the pre-hydration default, not the real persisted value. */
export function useHasHydrated() {
  const [hydrated, setHydrated] = useState(useApp.persist.hasHydrated());
  useEffect(() => {
    setHydrated(useApp.persist.hasHydrated());
    return useApp.persist.onFinishHydration(() => setHydrated(true));
  }, []);
  return hydrated;
}
