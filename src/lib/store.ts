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

/** Best completed attempt for one Current Affairs quiz day, keyed by date. */
interface CaAttempt {
  score: number;
  total: number;
  answeredAt: number;
  answers: Record<string, 'a' | 'b' | 'c' | 'd'>;
}

/** One finished MCQ test attempt — used by the MPSC module's test mode so a
 *  student can see score history and compare against a paper over time. */
export interface TestResult {
  /** Identifies what was attempted: a paper id, or a synthesized filter key. */
  targetId: string;
  /** Human label, e.g. 'General Studies Paper-II (DO) · 2019'. */
  label: string;
  score: number;
  total: number;
  /** Whole-test elapsed time in seconds. */
  durationSec: number;
  answeredAt: number;
}

/** Gauntlet Run (arena) — MCQ-gated dodge runner. Coins/upgrades/highscore. */
export interface ArenaUpgrades {
  /** Extra hits absorbed at run start (0-3). */
  shield: number;
  /** Extra revive questions per run (0-2, base 1 revive). */
  revive: number;
  /** +4s answer time per level (0-3). */
  focus: number;
  /** +0.25 starting multiplier per level (0-3). */
  boost: number;
}

export interface ArenaState {
  coins: number;
  highScore: number;
  bestStreak: number;
  runs: number;
  answered: number;
  correct: number;
  upgrades: ArenaUpgrades;
}

export interface ArenaRunResult {
  score: number;
  coins: number;
  answered: number;
  correct: number;
  streak: number;
}

export type ChronicleTrackMode = 'both' | 'history' | 'polity';
export type ChronicleView = 'canvas' | 'reading';
export type ChronicleLens = 'none' | 'heat' | 'mastery';

/** Right/wrong tally for one entry's attached questions — quiz rework (later
 *  phase) will read/write this; kept inert here so the schema lands once. */
export interface ChronicleMasteryRecord {
  r: number;
  w: number;
}

/** Derived mastery tier for one entry — 'unseen' until any attempt is
 *  recorded, then whichever side of right/wrong is ahead. */
export function chronicleMasteryOf(
  mastery: Record<string, ChronicleMasteryRecord>,
  entryId: string
): 'unseen' | 'strong' | 'weak' {
  const m = mastery[entryId];
  if (!m || m.r + m.w === 0) return 'unseen';
  return m.r >= m.w ? 'strong' : 'weak';
}

/** Chronicle module — master timeline. */
interface ChronicleState {
  /** entry id -> personal note. */
  notes: Record<string, string>;
  /** last viewport — restored on return; null before the first visit. */
  viewport: { zoom: number; panX: number } | null;
  trackMode: ChronicleTrackMode;
  /** Toolbar filter — lowers the LOD-computed ceiling, never raises it. No
   *  UI exposes this since the v2 design; kept for a future command-palette filter. */
  importanceCeiling: Importance;
  view: ChronicleView;
  /** Canvas overlay: 'heat' = exam-heat glow/badges, 'mastery' = quiz-record
   *  coloring (mutually exclusive, replaces the old `heat: boolean`). */
  lens: ChronicleLens;
  /** entry ids the user has pinned. */
  bookmarks: string[];
  /** entry id -> right/wrong tally from quiz attempts. */
  mastery: Record<string, ChronicleMasteryRecord>;
  xp: number;
  streak: number;
  /** toDateString() of the last day XP was earned — drives the streak bump. */
  lastStudyDay: string;
  /** Whether the first-run guided tour has been dismissed. */
  toured: boolean;
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
  /** keyed by quiz date (YYYY-MM-DD) — Current Affairs module. */
  caAttempts: Record<string, CaAttempt>;
  /** MCQ test attempts (most-recent-first) — MPSC module test mode. */
  testResults: TestResult[];
  eventIndex: number;
  /** Global basemap override — null = use each chapter's own choice. */
  basemapOverride: string | null;
  chronicle: ChronicleState;
  /** Gauntlet Run module — persists across runs. */
  arena: ArenaState;

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
  recordCaAttempt: (date: string, result: CaAttempt) => void;
  recordTestResult: (result: TestResult) => void;
  setEventIndex: (idx: number) => void;
  setBasemapOverride: (id: string | null) => void;
  setChronicleNote: (entryId: string, text: string) => void;
  setChronicleViewport: (v: { zoom: number; panX: number } | null) => void;
  setChronicleTrackMode: (m: ChronicleTrackMode) => void;
  setChronicleImportanceCeiling: (n: Importance) => void;
  setChronicleView: (v: ChronicleView) => void;
  setChronicleLens: (l: ChronicleLens) => void;
  toggleChronicleBookmark: (entryId: string) => void;
  recordChronicleMastery: (entryId: string, correct: boolean) => void;
  /** Bumps XP and the once-per-calendar-day streak counter. */
  addChronicleXp: (amount: number) => void;
  setChronicleToured: (v: boolean) => void;

  /** Bank a finished run: coins in, records, highscore. */
  arenaFinishRun: (r: ArenaRunResult) => void;
  /** Spend coins on one upgrade level. No-ops if unaffordable or maxed. */
  arenaBuyUpgrade: (key: keyof ArenaUpgrades, cost: number, max: number) => void;
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
      caAttempts: {},
      testResults: [],
      eventIndex: -1,
      basemapOverride: null,
      chronicle: {
        notes: {},
        viewport: null,
        trackMode: 'both',
        importanceCeiling: 5,
        view: 'canvas',
        lens: 'none',
        bookmarks: [],
        mastery: {},
        xp: 0,
        streak: 0,
        lastStudyDay: '',
        toured: false,
      },
      arena: {
        coins: 0,
        highScore: 0,
        bestStreak: 0,
        runs: 0,
        answered: 0,
        correct: 0,
        upgrades: { shield: 0, revive: 0, focus: 0, boost: 0 },
      },

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

      setChronicleView: (v) => set((s) => ({ chronicle: { ...s.chronicle, view: v } })),

      setChronicleLens: (l) => set((s) => ({ chronicle: { ...s.chronicle, lens: l } })),

      toggleChronicleBookmark: (entryId) =>
        set((s) => ({
          chronicle: {
            ...s.chronicle,
            bookmarks: s.chronicle.bookmarks.includes(entryId)
              ? s.chronicle.bookmarks.filter((id) => id !== entryId)
              : [...s.chronicle.bookmarks, entryId],
          },
        })),

      recordChronicleMastery: (entryId, correct) =>
        set((s) => {
          const prev = s.chronicle.mastery[entryId] ?? { r: 0, w: 0 };
          const next = correct ? { ...prev, r: prev.r + 1 } : { ...prev, w: prev.w + 1 };
          return { chronicle: { ...s.chronicle, mastery: { ...s.chronicle.mastery, [entryId]: next } } };
        }),

      addChronicleXp: (amount) =>
        set((s) => {
          const today = new Date().toDateString();
          const streak = s.chronicle.lastStudyDay === today ? s.chronicle.streak : s.chronicle.streak + 1;
          return { chronicle: { ...s.chronicle, xp: s.chronicle.xp + amount, streak, lastStudyDay: today } };
        }),

      setChronicleToured: (v) => set((s) => ({ chronicle: { ...s.chronicle, toured: v } })),

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

      arenaFinishRun: (r) =>
        set((s) => ({
          arena: {
            ...s.arena,
            coins: s.arena.coins + r.coins,
            highScore: Math.max(s.arena.highScore, r.score),
            bestStreak: Math.max(s.arena.bestStreak, r.streak),
            runs: s.arena.runs + 1,
            answered: s.arena.answered + r.answered,
            correct: s.arena.correct + r.correct,
          },
        })),

      arenaBuyUpgrade: (key, cost, max) =>
        set((s) => {
          const level = s.arena.upgrades[key];
          if (level >= max || s.arena.coins < cost) return s;
          return {
            arena: {
              ...s.arena,
              coins: s.arena.coins - cost,
              upgrades: { ...s.arena.upgrades, [key]: level + 1 },
            },
          };
        }),

      recordCaAttempt: (date, result) =>
        set((s) => {
          const prev = s.caAttempts[date];
          const next = prev && prev.score >= result.score ? prev : result;
          return { caAttempts: { ...s.caAttempts, [date]: next } };
        }),

      recordTestResult: (result) =>
        set((s) => ({ testResults: [result, ...s.testResults].slice(0, 200) })),
    }),
    {
      name: 'india-study-map',
      partialize: (s) => ({
        theme: s.theme,
        shellStyle: s.shellStyle,
        progress: s.progress,
        bankProgress: s.bankProgress,
        deckProgress: s.deckProgress,
        caAttempts: s.caAttempts,
        testResults: s.testResults,
        activeBaseLayerIds: s.activeBaseLayerIds,
        basemapOverride: s.basemapOverride,
        currentChapterId: s.currentChapterId,
        chronicle: s.chronicle,
        arena: s.arena,
      }),
      // Default persist merge is a shallow `{...current, ...persisted}` —
      // fine for top-level keys, but a persisted `chronicle` blob from
      // before a field was added (e.g. trackMode) would otherwise replace
      // the whole sub-object wholesale, leaving new fields `undefined`
      // instead of falling back to their default.
      merge: (persisted, current) => {
        const p = persisted as Partial<AppState>;
        return {
          ...current,
          ...p,
          chronicle: { ...current.chronicle, ...p.chronicle },
          arena: {
            ...current.arena,
            ...p.arena,
            upgrades: { ...current.arena.upgrades, ...p.arena?.upgrades },
          },
        };
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
