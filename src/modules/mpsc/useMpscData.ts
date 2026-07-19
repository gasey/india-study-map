import { useMemo } from 'react';
import { getBank } from '@/data/banks';
import type { BankQuestion, ExamPaper } from '@/data/banks/types';

// ============================================
// MPSC data layer — turns the flat bank (papers + questions) into the
// structures the UI needs: papers enriched with their questions, papers
// clustered into "sittings" (so Paper-I / Paper-II of the same exam group
// together for comparison), and the option lists that drive the filters.
// ============================================

export const BANK_ID = 'mpsc-old-questions';
export const ALL = 'all';

export interface PaperWithQuestions extends ExamPaper {
  questions: BankQuestion[];
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
  papers: PaperWithQuestions[];
  totalQuestions: number;
}

export interface MpscFilters {
  examType: string;
  year: string;
  subject: string;
  difficulty: string;
}

export const emptyFilters: MpscFilters = {
  examType: ALL,
  year: ALL,
  subject: ALL,
  difficulty: ALL,
};

/**
 * Derives the sitting-grouping key from the source filename rather than
 * `examName`/`post` — those are free text an LLM writes fresh per PDF during
 * extraction, so Paper-I/II/III of one real sitting can come back with
 * subtly different wording and silently fail to cluster. Filenames are
 * deterministic: siblings share everything up to the trailing "Paper-N".
 */
function sittingKey(p: ExamPaper): string {
  if (!p.sourceFile || p.sourceFile === 'seed') {
    return [p.examType, p.examName, p.post ?? '', p.year].join('|');
  }
  const base = p.sourceFile.split('/').pop() ?? p.sourceFile;
  const title = base
    .replace(/\.pdf$/i, '')
    .replace(/\.+$/, '')
    .replace(/[\s-]*paper[\s-]*[ivxlcdm\d]+\s*(\d{4})?\s*$/i, '')
    .replace(/\.+$/, '')
    .trim()
    .toLowerCase();
  return [p.examType, title, p.year].join('|');
}

export function useMpscData() {
  const bank = getBank(BANK_ID);

  return useMemo(() => {
    const papers = bank?.papers ?? [];
    const questions = bank?.questions ?? [];

    // Group questions under their paper.
    const byPaper = new Map<string, BankQuestion[]>();
    for (const q of questions) {
      if (!q.paperId) continue;
      const list = byPaper.get(q.paperId) ?? [];
      list.push(q);
      byPaper.set(q.paperId, list);
    }
    // Questions with no paper link (e.g. seed/legacy) still belong to the bank.
    const orphanQuestions = questions.filter((q) => !q.paperId);

    const papersWithQ: PaperWithQuestions[] = papers.map((p) => ({
      ...p,
      questions: byPaper.get(p.id) ?? [],
    }));

    // Cluster into sittings, then sort Paper-I, Paper-II, … within each.
    const sittingMap = new Map<string, Sitting>();
    for (const p of papersWithQ) {
      const key = sittingKey(p);
      let s = sittingMap.get(key);
      if (!s) {
        s = {
          key,
          examType: p.examType,
          examName: p.examName,
          post: p.post,
          year: p.year,
          label: [p.examName, p.post, p.year].filter(Boolean).join(' · '),
          papers: [],
          totalQuestions: 0,
        };
        sittingMap.set(key, s);
      }
      s.papers.push(p);
    }
    const sittings = [...sittingMap.values()];
    for (const s of sittings) {
      s.papers.sort((a, b) => (a.paperNumber ?? '').localeCompare(b.paperNumber ?? '', undefined, { numeric: true }));
      s.totalQuestions = s.papers.reduce((n, p) => n + p.questions.length, 0);
    }
    // Newest sittings first, then by exam name.
    sittings.sort((a, b) => b.year - a.year || a.examName.localeCompare(b.examName));

    // Filter option lists.
    const examTypes = [...new Set(papers.map((p) => p.examType))].sort();
    const years = [...new Set(papers.map((p) => p.year))].sort((a, b) => b - a);
    const subjects = [...new Set(questions.map((q) => q.subject))].sort();

    return {
      hasData: papers.length > 0 || questions.length > 0,
      papers: papersWithQ,
      orphanQuestions,
      sittings,
      questions,
      examTypes,
      years,
      subjects,
      totalPapers: papers.length,
      totalQuestions: questions.length,
    };
  }, [bank]);
}

/** Apply the shared filter bar to a question pool. */
export function filterQuestions(
  questions: BankQuestion[],
  paperById: Map<string, ExamPaper>,
  f: MpscFilters,
): BankQuestion[] {
  return questions.filter((q) => {
    if (f.subject !== ALL && q.subject !== f.subject) return false;
    if (f.difficulty !== ALL && q.difficulty !== f.difficulty) return false;
    const paper = q.paperId ? paperById.get(q.paperId) : undefined;
    if (f.examType !== ALL && paper?.examType !== f.examType) return false;
    if (f.year !== ALL && String(paper?.year ?? q.year) !== f.year) return false;
    return true;
  });
}
