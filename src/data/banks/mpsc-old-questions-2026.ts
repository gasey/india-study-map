import type { QuestionBank } from './types';

// Lazy-loaded from public/mpsc_bank_converted.json
let cachedBank: QuestionBank | null = null;

export async function loadMpscOldQuestions(): Promise<QuestionBank> {
  if (cachedBank) return cachedBank;
  const res = await fetch('/mpsc_bank_converted.json');
  const data = await res.json();
  cachedBank = {
    id: 'mpsc-old-questions-2026',
    title: 'MPSC Old Questions (73,405 Qs)',
    description: 'Complete extraction from 1,899 exam papers (2011–2026)',
    questions: data.questions.map((q: any) => ({ ...q, type: 'mcq' })),
    papers: data.papers,
  };
  return cachedBank;
}

// Sync export for index.ts compatibility
export const mpscOldQuestions: QuestionBank = {
  id: 'mpsc-old-questions-2026',
  title: 'MPSC Old Questions (Loading...)',
  description: '',
  questions: [],
  papers: [],
};
