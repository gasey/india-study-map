export interface ExamView {
  id: string;
  label: string;
  shortLabel: string;
  path: string;
  description: string;
  meta: string;
}

export interface CompiledExam {
  id: 'jso' | 'informatics-officer' | 'system-analyst' | 'system-manager';
  title: string;
  shortTitle: string;
  glyph: string;
  badge: string;
  summary: string;
  highlights: string[];
  questionCount?: number;
  views: ExamView[];
}

export const COMPILED_IT_EXAMS: CompiledExam[] = [
  {
    id: 'jso',
    title: 'MPSC JSO — Cyber Forensic',
    shortTitle: 'JSO',
    glyph: '🕵️',
    badge: 'MPSC · Cyber Forensic',
    summary:
      'Complete Junior Scientific Officer (Cyber Forensic) workbench with 245 conceptual guide sections, 1,575 syllabus & past-paper MCQs, 5-unit Paper IV bank (380 Qs), Maths focus, and General Science guide.',
    highlights: ['53 units · 245 concept sections', '1,575 workbench MCQs', '380 Paper IV Bank Qs (Units I–V)'],
    questionCount: 1575,
    views: [
      {
        id: 'main',
        label: 'Full Prep Workbench',
        shortLabel: 'Full Prep',
        path: '/mpsc-jso-prep/index.html',
        description: '53 units, 245 concept sections, 1,575 questions — Study, Concept Guide, Question Bank, Visual Lab & Custom Tests',
        meta: '53 units · 1,575 Qs',
      },
      {
        id: 'guide',
        label: 'Comprehensive Conceptual Guide',
        shortLabel: 'Concept Guide',
        path: '/mpsc-jso-prep/index.html?mode=guide',
        description: '245 comprehensive syllabus-mapped conceptual guide sections across Paper IV, Paper III, Paper II & Paper I',
        meta: '245 concept sections',
      },
      {
        id: 'qbank',
        label: 'Unified JSO Question Bank & MCQ Practice',
        shortLabel: 'Question Bank',
        path: '/mpsc-jso-prep/index.html?mode=qbank',
        description: '1,575 searchable MCQs across all 4 papers with interactive attempt mode, reveal mode & filtered timed drills',
        meta: '1,575 MCQs',
      },
      {
        id: 'p4-bank',
        label: 'Paper IV — Real & 5-Unit Question Bank',
        shortLabel: 'Paper IV Bank',
        path: '/mpsc-jso-p4-bank/index.html',
        description: '380 Paper IV questions (305 real MPSC/MUDAL past questions including 100 official-key 2026 items + 75 Units III–V syllabus drills)',
        meta: '380 Qs · Units I–V',
      },
      {
        id: 'maths',
        label: 'JSO Maths Focus',
        shortLabel: 'Maths Focus',
        path: '/mpsc-jso-prep/maths-focus-guide.html',
        description: 'Paper III Unit III — 30 marks: sets, permutations, statistics & probability, with mock',
        meta: 'Paper III · 30 marks',
      },
      {
        id: 'science',
        label: 'General Science Study Guide',
        shortLabel: 'Science Guide',
        path: '/mpsc-jso-prep/science-study-guide.html',
        description: 'General Science compiled from past MPSC direct-exam papers',
        meta: 'Past direct papers',
      },
    ],
  },
  {
    id: 'informatics-officer',
    title: 'MPSC Informatics Officer',
    shortTitle: 'Informatics Officer',
    glyph: '💻',
    badge: 'MPSC · 2026 ICT',
    summary:
      '2026 ICT syllabus trainer covering all 5 papers with study guide, past papers, essays, calc lab, repeats, and timed mocks.',
    highlights: ['2026 ICT syllabus · 5 papers', 'Study guide & past papers', 'Essays, Calc Lab & Mocks'],
    views: [
      {
        id: 'main',
        label: 'Study Trainer',
        shortLabel: 'Study Trainer',
        path: '/mpsc-informatics-officer/index.html',
        description: '2026 ICT syllabus · 5 papers, study guide, past papers, essays, calc lab and MCQ drills',
        meta: '5 papers · Full trainer',
      },
    ],
  },
  {
    id: 'system-analyst',
    title: 'MPSC System Analyst',
    shortTitle: 'System Analyst',
    glyph: '🖥️',
    badge: 'MPSC · Technical',
    summary:
      'Deep CS & systems concept guide, 1,369 questions, daily & mock tests, plus the dedicated Technical Paper I revision guide.',
    highlights: ['962 concepts · 1,369 questions', 'Daily, Practice & Mock tests', 'Tech I Revision Guide (385 Qs)'],
    questionCount: 1369,
    views: [
      {
        id: 'main',
        label: 'Study Trainer',
        shortLabel: 'Study Trainer',
        path: '/mpsc-system-analyst/index.html',
        description: '962 concepts, 1,369 questions — Concept guide, Daily and Mock tests, Calc Lab & Repeats',
        meta: '962 concepts · 1,369 Qs',
      },
      {
        id: 'tech1',
        label: 'Technical Paper I — Revision Guide',
        shortLabel: 'Tech I Guide',
        path: '/mpsc-system-analyst/study-guide-tech1.html',
        description: 'Discrete Mathematics & Data Structures — 24 topics, 135 concept cards, 385 past questions',
        meta: '24 topics · 385 Qs',
      },
    ],
  },
  {
    id: 'system-manager',
    title: 'MUDAL System Manager',
    shortTitle: 'System Manager',
    glyph: '🗂️',
    badge: 'MUDAL · Systems',
    summary:
      'Focused System Manager trainer with 298 concepts, 843 questions, 38 calculation drills, daily tests, and full mocks.',
    highlights: ['298 concepts · 843 questions', '38 calculation drills', 'Study, Daily & Mock tests'],
    questionCount: 843,
    views: [
      {
        id: 'main',
        label: 'Study Trainer',
        shortLabel: 'Study Trainer',
        path: '/mpsc-system-manager/index.html',
        description: '298 concepts, 843 questions, 38 calc drills — Study, Daily test, Calc Lab & Mock test',
        meta: '298 concepts · 843 Qs',
      },
    ],
  },
];

export type CompiledExamId = CompiledExam['id'];

export function findCompiledExam(id: string | null | undefined): CompiledExam | undefined {
  return COMPILED_IT_EXAMS.find((exam) => exam.id === id);
}

export function findExamView(exam: CompiledExam, viewId: string | null | undefined): ExamView {
  return exam.views.find((v) => v.id === viewId) ?? exam.views[0];
}
