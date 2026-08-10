import { useEffect, useMemo, useState } from 'react';
import * as api from '@/lib/mpscApi';
import { isMcqQuestion } from '@/data/banks/types';
import type { BankQuestion, ExamPaper } from '@/data/banks/types';
import type { Correction } from '@/lib/mpscApi';

// ============================================
// MPSC data layer — papers/sittings metadata (cheap, ~1,750 rows, fetched
// in full) plus URL-shaped filter state for the Browse/Practice tabs,
// which fetch one filtered/paginated/sampled slice at a time from the
// live API instead of ever holding all 76,093 questions in memory.
//
// Previously this fetched the *entire* bank (papers + questions, ~41MB)
// in one shot and did all filtering client-side — see git history before
// Phase 4. That already froze a tab once on a sibling backend attempt at
// the same pattern; /api/mpsc/questions now does the filtering server-side.
// ============================================

export const BANK_ID = 'mpsc-old-questions';
export const ALL = 'all';

export interface PaperWithCount extends ExamPaper {
  questionCount: number;
}

/** A group of papers from the same exam event — the unit students compare. */
export interface Sitting {
  key: string;
  examType: string;
  examName: string;
  post?: string;
  year: number;
  /** Label like "Combined Competitive Examination · District Officer · 2019". */
  label: string;
  papers: PaperWithCount[];
  totalQuestions: number;
}

/**
 * Papers + sittings metadata only — no question bodies. Powers Library.
 *
 * Sitting grouping used to be computed here client-side (a regex over
 * `sourceFile`, since `examName`/`post` are free text an LLM writes fresh
 * per PDF and can't be trusted to cluster). That heuristic now lives
 * server-side in `/api/papers/tree/` (`_sitting_key()` in mpsc_api's
 * main.py) — this hook just flattens the tree back into the flat
 * papers/sittings shape `MpscPage.tsx`'s Library tab already consumes, so
 * there's exactly one implementation of the grouping logic, not two.
 */
export function useBankPapers() {
  const [tree, setTree] = useState<api.PapersTree | null>(null);

  useEffect(() => {
    let cancelled = false;
    api.getPapersTree().then((r) => {
      if (!cancelled) setTree(r);
    }).catch(() => {
      if (!cancelled) setTree({ examTypes: [] });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return useMemo(() => {
    const sittings: Sitting[] = [];
    const papers: PaperWithCount[] = [];
    for (const et of tree?.examTypes ?? []) {
      for (const y of et.years) {
        for (const s of y.sittings) {
          sittings.push({
            key: s.key,
            examType: s.examType,
            examName: s.examName,
            post: s.post ?? undefined,
            year: s.year ?? 0,
            label: s.label,
            papers: s.papers,
            totalQuestions: s.totalQuestions,
          });
          papers.push(...s.papers);
        }
      }
    }
    sittings.sort((a, b) => b.year - a.year || a.examName.localeCompare(b.examName));

    const examTypes = [...new Set(papers.map((p) => p.examType))].sort();
    const posts = [...new Set(papers.map((p) => p.post).filter((p): p is string => !!p))].sort();
    const years = [...new Set(papers.map((p) => p.year).filter((y): y is number => y !== undefined))].sort((a, b) => b - a);

    return {
      loading: tree === null,
      papers,
      sittings,
      examTypes,
      posts,
      years,
      totalPapers: papers.length,
      totalQuestions: papers.reduce((n, p) => n + p.questionCount, 0),
    };
  }, [tree]);
}

// ---- URL-shaped filter state for Browse/Practice (server-side filtering) ----

export interface MpscFilters {
  examType: string[];
  post: string[];
  year: string[];
  paperId: string[];
  subject: string[];
  difficulty: string[];
  type: string[];
  search: string;
}

export const emptyFilters: MpscFilters = {
  examType: [], post: [], year: [], paperId: [], subject: [], difficulty: [], type: [], search: '',
};

const PAGE_SIZE = 25;

/** One filtered/sorted/paginated page of questions, fetched live.
 *
 *  Now surfaces `error` (previously a failed fetch was silently coerced to an
 *  empty result, which the UI could not tell apart from a legitimately empty
 *  filter) and a `retry` that re-runs the same fetch — both consumed by the
 *  Browse list's real error state. `retry` bumps a nonce so the effect re-runs
 *  even when the filters/sort are unchanged. */
export function useBankQuestionPage(filters: MpscFilters, offset: number, sortBy: api.BankQuestionQuery['sortBy'], sortDir: api.BankQuestionQuery['sortDir']) {
  const [state, setState] = useState<{ total: number; questions: BankQuestion[]; loading: boolean; error: boolean }>(
    { total: 0, questions: [], loading: true, error: false },
  );
  const [nonce, setNonce] = useState(0);
  const key = JSON.stringify({ filters, offset, sortBy, sortDir });

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: false }));
    api.listBankQuestions({ ...filters, sortBy, sortDir, limit: PAGE_SIZE, offset })
      .then((r) => {
        if (!cancelled) setState({ ...r, loading: false, error: false });
      })
      .catch(() => {
        if (!cancelled) setState({ total: 0, questions: [], loading: false, error: true });
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, nonce]);

  return { ...state, retry: () => setNonce((n) => n + 1) };
}

/** Per-dimension counts for the current filter combination — powers the
 *  FilterRail's option counts. Re-fetched whenever the filters change. */
export function useBankFacets(filters: MpscFilters) {
  const [facets, setFacets] = useState<Record<string, Record<string, number>>>({});
  const key = JSON.stringify(filters);

  useEffect(() => {
    let cancelled = false;
    api.getBankFacets(filters).then((r) => {
      if (!cancelled) setFacets(r);
    }).catch(() => {});
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return facets;
}

/** Overlays admin-authored corrections onto a page of raw questions — same
 *  overlay this bank has always done, just applied per-page now instead of
 *  once over the whole in-memory array. */
export function applyCorrections(questions: BankQuestion[], corrections: Record<string, Correction>): BankQuestion[] {
  if (Object.keys(corrections).length === 0) return questions;
  return questions.map((q) => {
    const c = corrections[q.id];
    if (!c || !isMcqQuestion(q)) return q;
    return {
      ...q,
      answerIndex: c.answerIndex ?? q.answerIndex,
      explanation: c.explanation ?? q.explanation,
      question: c.stem ?? q.question,
      options: c.options ?? q.options,
    };
  });
}
