import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { allPrimers, PRIMER_CATEGORIES, UNIT_LABELS } from '@/data/banks';
import { isMcqQuestion } from '@/data/banks/types';
import type { BankQuestion, DescriptiveBankQuestion, ExamPaper, McqBankQuestion } from '@/data/banks/types';
import { useAuthStore } from '@/lib/authStore';
import { renderEmphasis } from '@/lib/renderEmphasis';
import * as api from '@/lib/mpscApi';
import type { Correction } from '@/lib/mpscApi';
import { useApp } from '@/lib/store';
import { isDue } from '@/lib/sm2';
import type { FlashCard } from '@/data/decks/types';
import { FlashcardFlip } from '@/modules/flashcards/FlashcardFlip';
import { QuestionReviewPanel } from './QuestionReviewPanel';
import { DescriptiveQuestionCard } from './DescriptiveQuestionCard';
import './state-tax-officer.css';

/** Synthetic deck id — the Review tab reuses `deckProgress`'s per-card SM-2
 *  schedule map rather than a new store slice, same shape, same actions. */
const STO_REVIEW_DECK_ID = 'sto-review';

const BANK_ID = 'mpsc-state-tax-officer';

interface Props {
  allQuestions: BankQuestion[];
  papers: ExamPaper[];
}

const PREP_TABS = ['overview', 'primers', 'bank', 'descriptive', 'exam-browse', 'yearly-browse', 'paper-browse', 'mock', 'progress', 'review'] as const;
type PrepTab = (typeof PREP_TABS)[number];
type MockState = 'setup' | 'running' | 'review';
interface MockResults {
  correct: number; wrong: number; unattempted: number; score: number; total: number;
}

// Maps both BankQuestion.topic (snake_case, e.g. "gs2_economy") and primer
// `unit` codes (upper-dash, e.g. "GS2-ECONOMY") to one of the CSS subject
// classes defined in state-tax-officer.css, so a topic is always the same
// color whether it's shown on a question card or a primer card.
function subjectClass(unitOrTopic: string | undefined): string {
  const key = (unitOrTopic ?? '').toLowerCase().replace(/-/g, '_');
  if (key.startsWith('eng')) return 'sto-unit-english';
  if (key === 'gs1_current') return 'sto-unit-current';
  if (key.startsWith('gs1_history')) return 'sto-unit-history';
  if (key === 'gs2_economy') return 'sto-unit-economy';
  if (key === 'gs2_geography') return 'sto-unit-geography';
  if (key === 'gs2_polity') return 'sto-unit-polity';
  if (key === 'gs3_mizoram') return 'sto-unit-mizoram';
  if (key === 'gs3_scitech') return 'sto-unit-scitech';
  if (key === 'gs3_aptitude') return 'sto-unit-aptitude';
  if (key === 'essay') return 'sto-unit-essay';
  return '';
}

// De-slugged topic, used only where no question object is at hand to supply
// its own `topicLabel` — see topicLabels in the component.
function deslug(topic: string | undefined): string {
  return (topic ?? '').replace(/_/g, ' ');
}

// renderEmphasis moved to lib/renderEmphasis.tsx — the MPSC bank's
// QuestionCard renders corrected stems too, and that regex's
// fill-in-the-blank gotcha is not worth having two copies of.

/**
 * The shared "Direction (Question Nos. 11-20): ..." header, or the table a run
 * of data-interpretation questions all refer to. Without it a stem like
 * "The property was divided ______ the two brothers" gives no hint of what is
 * being tested, and a DI question is simply unanswerable.
 */
function StemContext({ text }: { text: string }) {
  return (
    <p
      className="text-xs px-2.5 py-1.5 rounded"
      style={{ background: 'var(--bg-panel-elev)', color: 'var(--text-secondary)', borderLeft: '2px solid var(--accent)' }}
    >
      {text}
    </p>
  );
}

function confidenceLabel(q: BankQuestion): 'high' | 'medium' | 'low' {
  // BankQuestion has no confidence field of its own; difficulty stands in
  // (mirrors the source data: high-confidence answers were marked 'medium'
  // difficulty, low-confidence 'hard' — see mpsc-state-tax-prep SOLVE_INSTRUCTIONS).
  if (q.difficulty === 'hard') return 'low';
  if (q.difficulty === 'easy') return 'high';
  return 'medium';
}

/**
 * How much to trust this question's marked answer. Papers whose official MPSC
 * answer key has been published carry `answerSource: 'official'`; everything
 * else was solved by the extraction pipeline and is a considered guess. The
 * two must never look alike on screen.
 */
function answerProvenance(q: BankQuestion): { label: string; cls: string; title: string } {
  if (q.answerSource === 'official') {
    return {
      label: '✓ official answer key',
      cls: 'sto-conf-official',
      title: q.answerKeyRef
        ? `Answer published by MPSC — ${q.answerKeyRef}`
        : 'Answer taken from the published MPSC final answer key.',
    };
  }
  const c = confidenceLabel(q);
  return {
    label: `${c} confidence · inferred`,
    cls: `sto-conf-${c}`,
    title: 'No official MPSC key has been published for this paper. This answer was worked out from the question and may be wrong — flag it if you disagree.',
  };
}

/**
 * One MCQ's full card — stem, options, provenance badges, expandable
 * explanation, review panel. Shared by the Question Bank tab and the By
 * Paper browse tab so a question looks identical wherever it's browsed from.
 */
function QuestionCard({
  q, questionExamName, questionSitting, corrections, isOpen, onToggle,
}: {
  q: McqBankQuestion;
  questionExamName: (q: BankQuestion) => string;
  questionSitting: (q: BankQuestion) => ExamPaper | null;
  corrections: Record<string, Correction>;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const paper = questionSitting(q);
  const correction = corrections[q.id];
  return (
    <div className="sto-card space-y-2">
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <span className={`sto-pill sto-subject ${subjectClass(q.topic)}`}>{q.topicLabel || deslug(q.topic)}</span>
        {(() => {
          const prov = answerProvenance(q);
          return <span className={`sto-pill ${prov.cls}`} title={prov.title}>{prov.label}</span>;
        })()}
        {q.figureBased && (
          <span className="sto-pill sto-conf-low" title="The printed options are diagrams, so they can't be shown as text here. Open the original paper to attempt it.">
            ▦ figure-based
          </span>
        )}
        {q.compensated && (
          <span className="sto-pill sto-conf-medium" title="MPSC withdrew this question and gave the mark to every candidate. It has no correct answer and is excluded from mock tests.">
            ⊘ compensated by MPSC
          </span>
        )}
        {q.sourceDefect === 'duplicate-options' && (
          <span className="sto-pill sto-conf-medium" title="The printed paper offers the same option twice. This is the paper's own misprint, reproduced faithfully — the question can't be answered as set, so it's excluded from mock tests.">
            ⚠ misprint in original paper
          </span>
        )}
        {correction && <span className="sto-pill" style={{ color: '#2e7d4f', borderColor: '#2e7d4f' }}>✓ corrected by admin</span>}
        <span className="ml-auto" style={{ color: 'var(--text-secondary)' }}>
          {questionExamName(q)}{paper?.year ? `, ${paper.year}` : ''}
        </span>
      </div>
      {q.passage && <StemContext text={q.passage} />}
      <p className="text-sm font-medium">{renderEmphasis(q.question)}</p>
      {q.figureBased ? (
        <p className="text-xs italic p-2 rounded" style={{ background: 'var(--bg-panel-elev)', color: 'var(--text-secondary)' }}>
          This question's options are printed as diagrams, so they can't be shown as text.
          {q.answerSource === 'official' && typeof q.answerIndex === 'number' &&
            ` The official key gives (${String.fromCharCode(97 + q.answerIndex)}).`}
        </p>
      ) : (
        <div className="space-y-1.5">
          {q.options.map((opt, j) => (
            <div key={j} className={`sto-opt ${j === q.answerIndex ? 'sto-opt-correct' : ''}`}>
              <span className="sto-opt-letter">{String.fromCharCode(97 + j)}</span>
              <span>{opt}</span>
            </div>
          ))}
        </div>
      )}
      {q.compensated && (
        <p className="text-xs italic" style={{ color: 'var(--text-secondary)' }}>
          No option is marked correct: MPSC withdrew this question and awarded the mark to every candidate.
        </p>
      )}
      {q.disputeNote && (
        <p className="text-xs p-2 rounded" style={{ background: 'var(--bg-panel-elev)', color: 'var(--text-secondary)', borderLeft: '2px solid #9a6b12' }}>
          <strong>Disputed:</strong> {q.disputeNote} The marked answer is still the one MPSC published.
        </p>
      )}
      {correction?.note && (
        <div className="text-xs p-2 rounded" style={{ background: 'var(--accent-soft)', color: 'var(--text-primary)' }}>
          <strong>Admin note:</strong> {correction.note}
        </div>
      )}
      <button
        onClick={onToggle}
        className="text-xs font-medium"
        style={{ color: 'var(--accent)' }}
      >
        {isOpen ? '▾ Hide explanation' : '▸ Show explanation'}
      </button>
      {isOpen && (
        <div className="text-sm p-2.5 rounded" style={{ background: 'var(--bg-app)', color: 'var(--text-secondary)' }}>
          {q.explanation}
        </div>
      )}
      <QuestionReviewPanel bankId={BANK_ID} questionId={q.id} options={q.options} />
    </div>
  );
}

export function StateTaxOfficerEnhanced({ allQuestions, papers }: Props) {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab');
  const [prepTab, setPrepTab] = useState<PrepTab>(
    (PREP_TABS as readonly string[]).includes(initialTab ?? '') ? (initialTab as PrepTab) : 'overview',
  );
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [mockState, setMockState] = useState<MockState>('setup');
  const [mockAnswers, setMockAnswers] = useState<Record<number, number>>({});
  const [testQuestions, setTestQuestions] = useState<McqBankQuestion[]>([]);
  const [testResults, setTestResults] = useState<MockResults | null>(null);

  const { user } = useAuthStore();
  const [corrections, setCorrections] = useState<Record<string, Correction>>({});
  const refetchCorrections = () => api.getCorrections(BANK_ID).then(setCorrections).catch(() => {});
  useEffect(() => {
    refetchCorrections();
  }, []);

  // Admin-corrected answer/explanation/subparts overlaid on top of the
  // static bundle — applied to the WHOLE pool (MCQ and descriptive alike)
  // before splitting into tabs, so a correction to a descriptive sub-part
  // takes effect in the Descriptive tab too, not just the scored MCQ bank.
  const correctedAllQuestions = useMemo(() => {
    if (Object.keys(corrections).length === 0) return allQuestions;
    return allQuestions.map((q) => {
      const c = corrections[q.id];
      if (!c) return q;
      if (isMcqQuestion(q)) {
        return {
          ...q,
          answerIndex: c.answerIndex ?? q.answerIndex,
          explanation: c.explanation ?? q.explanation,
          question: c.stem ?? q.question,
          options: c.options ?? q.options,
        };
      }
      return {
        ...q,
        explanation: c.explanation ?? q.explanation,
        question: c.stem ?? q.question,
        subparts: c.subparts ?? q.subparts,
      };
    });
  }, [allQuestions, corrections]);

  // Every question in this bank already IS the State Tax Officer prep set —
  // no further source filtering needed (the old q.source-based filter here
  // was always a no-op/broken since every row shares one hardcoded source).
  // Split by `type`, not by topic — essay/précis-letter items and lettered
  // comprehension sub-parts are all genuinely `type: 'descriptive'` (no
  // single correct answerIndex), so they're excluded from the scored MCQ
  // pool and shown in the Descriptive tab regardless of which topic tag
  // they carry (a topic-based filter here previously missed comprehension
  // items entirely, since they aren't tagged 'essay' or 'eng_precis_letter').
  const stateTaxQuestions = useMemo(
    () => correctedAllQuestions.filter(isMcqQuestion),
    [correctedAllQuestions],
  );

  const descriptiveQuestions = useMemo(
    () =>
      correctedAllQuestions.filter(
        (q): q is DescriptiveBankQuestion => q.type === 'descriptive',
      ),
    [correctedAllQuestions],
  );

  // Real per-question exam name comes from the linked ExamPaper via paperId,
  // not from BankQuestion.source (which is the same string on every row).
  const examByPaperId = useMemo(() => {
    const m = new Map<string, string>();
    papers.forEach((p) => m.set(p.id, p.examName));
    return m;
  }, [papers]);

  const questionExamName = (q: BankQuestion) => (q.paperId && examByPaperId.get(q.paperId)) || 'Unknown exam';
  const questionSitting = (q: BankQuestion) => (q.paperId && papers.find((p) => p.id === q.paperId)) || null;

  // Sourced from both questions and papers, so a sitting whose only captured
  // paper is a descriptive-only one (e.g. General English Paper I) still
  // shows up on the By Year / By Paper browse tabs.
  const years = useMemo(() => {
    const y = new Set<number>();
    stateTaxQuestions.forEach((q) => {
      if (q.year) y.add(q.year);
    });
    papers.forEach((p) => {
      if (p.year) y.add(p.year);
    });
    return Array.from(y).sort((a, b) => b - a);
  }, [stateTaxQuestions, papers]);

  const exams = useMemo(() => {
    const e = new Set<string>();
    papers.forEach((p) => e.add(p.examName));
    return Array.from(e).sort();
  }, [papers]);

  const unitCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    stateTaxQuestions.forEach((q) => {
      if (q.topic) counts[q.topic] = (counts[q.topic] || 0) + 1;
    });
    return counts;
  }, [stateTaxQuestions]);

  // The topic weight rows and the topic filter are keyed by slug, so unlike a
  // question card they have no `topicLabel` to hand. Before the 2026-09-05
  // history split they rendered the de-slugged slug and it read acceptably
  // ("gs1 history modern"); eight period buckets turned that into lines like
  // "gs1 history modern early nationalism". The label is already in the data.
  //
  // Takes the MOST COMMON label for a slug, not the first one seen: a topic's
  // labels are not consistent in this bank. `eng_vocab` carries "English
  // Vocabulary" on 151 questions and a distinct per-question label on four
  // more ("Idiom meaning (bite the bullet)"), and `eng_grammar` carries
  // "English Grammar" on 268 and "English-I" on 2. First-wins therefore titled
  // the whole 155-question vocabulary bucket after one idiom.
  const topicLabels = useMemo(() => {
    const tally: Record<string, Record<string, number>> = {};
    stateTaxQuestions.forEach((q) => {
      if (!q.topic || !q.topicLabel) return;
      (tally[q.topic] ??= {})[q.topicLabel] = (tally[q.topic][q.topicLabel] || 0) + 1;
    });
    const labels: Record<string, string> = {};
    for (const [topic, counts] of Object.entries(tally)) {
      labels[topic] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    }
    return labels;
  }, [stateTaxQuestions]);

  const filteredPrimers = useMemo(() => {
    if (!selectedUnit) return allPrimers;
    return allPrimers.filter((p) => p.unit === selectedUnit);
  }, [selectedUnit]);

  const [testLabel, setTestLabel] = useState('Mock test');

  const startMockTest = (questions: McqBankQuestion[], label = 'Mock test') => {
    // Figure-based items have no text options, so they are unanswerable in a
    // scored run and would only ever count as "unattempted" against the
    // candidate. They stay browsable in the Question Bank — just not scored.
    // Filtered here rather than in each caller so every entry point (mock
    // setup, By Exam, By Year) is covered by one rule.
    setTestQuestions(questions.filter((q) => !q.figureBased && !q.compensated && !q.sourceDefect));
    setTestLabel(label);
    setMockAnswers({});
    setTestResults(null);
    setMockState('running');
    setPrepTab('mock');
  };

  const submitTest = () => {
    let correct = 0;
    let wrong = 0;
    let unattempted = 0;

    testQuestions.forEach((q, i) => {
      if (!(i in mockAnswers)) {
        unattempted++;
      } else if (mockAnswers[i] === q.answerIndex) {
        correct++;
      } else {
        wrong++;
      }
    });

    const penalty = 1 / 3; // Real MPSC negative marking
    const score = correct - wrong * penalty;

    setTestResults({ correct, wrong, unattempted, score, total: testQuestions.length });
    setMockState('review');

    if (user) {
      api.recordMockAttempt({
        bankId: BANK_ID, testLabel, total: testQuestions.length, correct, wrong, unattempted, score,
      }).catch(() => {
        // Non-critical — the result still shows locally even if the sync fails.
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Tab Navigation */}
      <div className="border-b overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
        <div className="flex gap-6 px-5 py-3">
          {PREP_TABS.map((t) => (
            <button
              key={t}
              onClick={() => {
                setPrepTab(t);
                if (t !== 'mock') setMockState('setup');
              }}
              className="text-sm font-medium whitespace-nowrap pb-2"
              style={{
                color: prepTab === t ? 'var(--accent)' : 'var(--text-secondary)',
                borderBottom: prepTab === t ? '2px solid var(--accent)' : '2px solid transparent',
              }}
            >
              {t === 'overview' && '📋 Overview'}
              {t === 'primers' && '📚 Primers'}
              {t === 'bank' && '❓ Question Bank'}
              {t === 'descriptive' && '📄 Descriptive & Essay'}
              {t === 'exam-browse' && '🏛️ By Exam'}
              {t === 'yearly-browse' && '📅 By Year'}
              {t === 'paper-browse' && '📑 By Paper'}
              {t === 'mock' && '🧪 Mock Tests'}
              {t === 'progress' && '📊 Progress'}
              {t === 'review' && '🔁 Review'}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto px-5 py-5">
        {prepTab === 'overview' && <OverviewTab questions={stateTaxQuestions} unitCounts={unitCounts} topicLabels={topicLabels} exams={exams} />}
        {prepTab === 'primers' && <PrimersTab primers={filteredPrimers} selectedUnit={selectedUnit} onSelectUnit={setSelectedUnit} />}
        {prepTab === 'bank' && (
          <QuestionBankTab
            questions={stateTaxQuestions}
            unitCounts={unitCounts}
            topicLabels={topicLabels}
            questionExamName={questionExamName}
            questionSitting={questionSitting}
            corrections={corrections}
          />
        )}
        {prepTab === 'descriptive' && (
          <DescriptiveTab questions={descriptiveQuestions} questionExamName={questionExamName} questionSitting={questionSitting} />
        )}
        {prepTab === 'exam-browse' && (
          <ExamBrowseTab
            questions={stateTaxQuestions}
            exams={exams}
            questionExamName={questionExamName}
            questionSitting={questionSitting}
            corrections={corrections}
            onStartTest={startMockTest}
          />
        )}
        {prepTab === 'yearly-browse' && (
          <YearlyBrowseTab
            questions={stateTaxQuestions}
            years={years}
            questionExamName={questionExamName}
            questionSitting={questionSitting}
            corrections={corrections}
            onStartTest={startMockTest}
          />
        )}
        {prepTab === 'paper-browse' && (
          <PaperBrowseTab
            questions={stateTaxQuestions}
            descriptiveQuestions={descriptiveQuestions}
            papers={papers}
            years={years}
            questionExamName={questionExamName}
            questionSitting={questionSitting}
            corrections={corrections}
            onStartTest={startMockTest}
          />
        )}
        {prepTab === 'mock' && mockState === 'setup' && (
          <MockSetupTab questions={stateTaxQuestions} onStartTest={startMockTest} />
        )}
        {prepTab === 'mock' && mockState === 'running' && (
          <MockRunnerTab questions={testQuestions} answers={mockAnswers} onAnswer={(i, ans) => setMockAnswers({ ...mockAnswers, [i]: ans })} onSubmit={submitTest} />
        )}
        {prepTab === 'mock' && mockState === 'review' && testResults && (
          <MockReviewTab questions={testQuestions} answers={mockAnswers} results={testResults} onBack={() => setMockState('setup')} />
        )}
        {prepTab === 'progress' && <ProgressTab />}
        {prepTab === 'review' && <StoReviewTab questions={stateTaxQuestions} />}
      </div>
    </div>
  );
}

function OverviewTab({ questions, unitCounts, topicLabels, exams }: { questions: BankQuestion[]; unitCounts: Record<string, number>; topicLabels: Record<string, string>; exams: string[] }) {
  const maxCount = Math.max(1, ...Object.values(unitCounts));
  const totalPrimers = allPrimers.length;

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <div className="text-[0.68rem] font-bold tracking-widest uppercase mb-1" style={{ color: 'var(--accent)' }}>
          MPSC State Tax Officer · Group B Gazetted, Finance Dept
        </div>
        <h2 className="text-xl font-semibold mb-2">Complete General Competitive exam preparation</h2>
        <p style={{ color: 'var(--text-secondary)' }} className="mb-4 text-sm">
          General English, General Essay, and General Studies Papers I/II/III — pulled from every Mizoram PSC exam
          that used this identical pattern: Inspector of Taxes, Inspector of Excise &amp; Narcotics, and the Group B
          Combined sitting where State Tax Officer candidates themselves sat these exact papers.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="sto-stat"><b>{questions.length}</b><span>Questions</span></div>
        <div className="sto-stat"><b>{exams.length}</b><span>Exams</span></div>
        <div className="sto-stat"><b>{totalPrimers}</b><span>Primers</span></div>
        <div className="sto-stat"><b>{Object.keys(unitCounts).length}</b><span>Topics</span></div>
      </div>

      <div>
        <h3 className="font-semibold mb-3 text-sm">Study path</h3>
        <ol className="space-y-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <li><strong style={{ color: 'var(--text-primary)' }}>1. Read Primers</strong> — build the concept foundation for a unit before drilling it</li>
          <li><strong style={{ color: 'var(--text-primary)' }}>2. Search the Question Bank</strong> — every solved question, filterable and searchable</li>
          <li><strong style={{ color: 'var(--text-primary)' }}>3. Browse by Exam or Year</strong> — see one real paper's difficulty at a time</li>
          <li><strong style={{ color: 'var(--text-primary)' }}>4. Take Mock Tests</strong> — timed practice under real negative marking (−1/3 per wrong answer)</li>
        </ol>
      </div>

      <div>
        <h3 className="font-semibold mb-1 text-sm">Where the questions come from</h3>
        <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
          How many solved questions exist for each topic — a short bar means lean harder on the primer for that unit
          instead of expecting to drill your way through it.
        </p>
        <div className="sto-card">
          {Object.entries(unitCounts)
            .sort(([, a], [, b]) => b - a)
            .map(([topic, count]) => (
              <div key={topic} className={`sto-weight-row ${subjectClass(topic)}`}>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="sto-pill sto-subject">{topicLabels[topic] ?? deslug(topic)}</span>
                  <div className="sto-weight-track flex-1" style={{ width: 'min(38vw, 220px)' }}>
                    <div className="sto-weight-bar" style={{ width: `${Math.max(4, (count / maxCount) * 100)}%` }} />
                  </div>
                </div>
                <span className="sto-weight-n">{count} Qs</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function PrimersTab({ primers, selectedUnit, onSelectUnit }: { primers: typeof allPrimers; selectedUnit: string | null; onSelectUnit: (unit: string | null) => void }) {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-wrap gap-2 mb-2">
        <button
          onClick={() => onSelectUnit(null)}
          className="px-3 py-1 rounded-full text-sm font-medium"
          style={{
            background: selectedUnit === null ? 'var(--accent)' : 'var(--bg-panel-elev)',
            color: selectedUnit === null ? '#fff' : 'var(--text-primary)',
          }}
        >
          All ({allPrimers.length})
        </button>
        {PRIMER_CATEGORIES.map((unit) => (
          <button
            key={unit}
            onClick={() => onSelectUnit(unit)}
            className="px-3 py-1 rounded-full text-sm font-medium"
            style={{
              background: selectedUnit === unit ? 'var(--accent)' : 'var(--bg-panel-elev)',
              color: selectedUnit === unit ? '#fff' : 'var(--text-primary)',
            }}
          >
            {UNIT_LABELS[unit] ?? unit}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {primers.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No primers for this unit yet.</p>
        ) : (
          primers.map((p, i) => (
            <div key={i} className="sto-card space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`sto-pill sto-subject ${subjectClass(p.unit)}`}>{p.unit}</span>
                  <h3 className="font-semibold text-sm">{p.subtopic}</h3>
                </div>
                <span className={`sto-pill sto-priority-${p.priority} shrink-0`}>{p.priority}</span>
              </div>
              <p className="text-sm">{p.primer}</p>
              {p.analogy && <div className="sto-analogy">{p.analogy}</div>}
              {p.traps && p.traps.length > 0 && (
                <div className="sto-traps">
                  <ul>{p.traps.map((t, j) => <li key={j}>{t}</li>)}</ul>
                </div>
              )}
              {p.formulae && p.formulae.length > 0 && (
                <div className="sto-formulae">{p.formulae.map((f, j) => <code key={j}>{f}</code>)}</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function QuestionBankTab({
  questions, unitCounts, topicLabels, questionExamName, questionSitting, corrections,
}: {
  questions: McqBankQuestion[];
  unitCounts: Record<string, number>;
  topicLabels: Record<string, string>;
  questionExamName: (q: BankQuestion) => string;
  questionSitting: (q: BankQuestion) => ExamPaper | null;
  corrections: Record<string, Correction>;
}) {
  const [topicFilter, setTopicFilter] = useState('');
  const [paperFilter, setPaperFilter] = useState('');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  // Which paper subjects (English-I/II, GS-I/II/III) actually occur in this
  // bank, in the real exam's sitting order — not every bank has all five.
  const paperSubjects = useMemo(() => {
    const present = new Set<string>();
    questions.forEach((q) => {
      const subject = questionSitting(q)?.paperSubject;
      if (subject) present.add(subject);
    });
    return PAPER_SUBJECT_ORDER.filter((p) => present.has(p));
  }, [questions, questionSitting]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return questions.filter((q) => {
      if (topicFilter && q.topic !== topicFilter) return false;
      if (paperFilter && questionSitting(q)?.paperSubject !== paperFilter) return false;
      if (!term) return true;
      return (
        q.question.toLowerCase().includes(term) ||
        q.options.some((o) => o.toLowerCase().includes(term)) ||
        (q.topicLabel ?? '').toLowerCase().includes(term)
      );
    });
  }, [questions, topicFilter, paperFilter, search, questionSitting]);

  const visible = filtered.slice(0, 100);

  const toggle = (i: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  return (
    <div className="max-w-3xl space-y-4">
      <h2 className="text-lg font-semibold">Question Bank</h2>
      <div className="flex flex-wrap gap-2 items-center">
        <select
          value={topicFilter}
          onChange={(e) => setTopicFilter(e.target.value)}
          className="px-2.5 py-1.5 rounded-md text-sm"
          style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
        >
          <option value="">Any topic</option>
          {Object.keys(unitCounts).sort().map((t) => (
            <option key={t} value={t}>{topicLabels[t] ?? deslug(t)} ({unitCounts[t]})</option>
          ))}
        </select>
        <select
          value={paperFilter}
          onChange={(e) => setPaperFilter(e.target.value)}
          className="px-2.5 py-1.5 rounded-md text-sm"
          style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
        >
          <option value="">Any paper</option>
          {paperSubjects.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search stems, options, topics…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-2.5 py-1.5 rounded-md text-sm flex-1 min-w-[200px]"
          style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
        />
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {filtered.length} question{filtered.length === 1 ? '' : 's'}{filtered.length > 100 ? ' (showing first 100)' : ''}
        </span>
      </div>

      <div className="space-y-3">
        {visible.map((q, i) => (
          <QuestionCard
            key={q.id}
            q={q}
            questionExamName={questionExamName}
            questionSitting={questionSitting}
            corrections={corrections}
            isOpen={expanded.has(i)}
            onToggle={() => toggle(i)}
          />
        ))}
        {visible.length === 0 && (
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No questions match these filters.</p>
        )}
      </div>
    </div>
  );
}

/**
 * Essay / précis-letter prompts — "write an essay on one of these topics",
 * "summarize this passage" — genuinely not objective, so they're shown
 * read-only (no answer, no scoring) instead of forced into the MCQ shape.
 * Flag/note/comment still work — a garbled or truncated prompt is still
 * worth reporting even though there's no "wrong answer" to flag.
 */
function DescriptiveTab({
  questions, questionExamName, questionSitting,
}: {
  questions: DescriptiveBankQuestion[]; questionExamName: (q: BankQuestion) => string; questionSitting: (q: BankQuestion) => ExamPaper | null;
}) {
  return (
    <div className="max-w-3xl space-y-4">
      <h2 className="text-lg font-semibold">Descriptive &amp; essay questions</h2>
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        Essay topics, précis/letter prompts, and comprehension items with lettered sub-parts — not solved here since
        half the marks are in how you structure the answer, not a single "correct" choice. Shown in original order so
        nothing on the written paper is a surprise.
      </p>

      <div className="space-y-3">
        {questions.map((q) => {
          const paper = questionSitting(q);
          return (
            <DescriptiveQuestionCard
              key={q.id}
              bankId={BANK_ID}
              question={q}
              renderEmphasis={renderEmphasis}
              subjectClass={subjectClass}
              meta={`${questionExamName(q)}${paper?.year ? `, ${paper.year}` : ''}`}
            />
          );
        })}
        {questions.length === 0 && (
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>None in this bank.</p>
        )}
      </div>
    </div>
  );
}

/**
 * One expandable group card — a header row (title, count, Start Test) that
 * toggles open to list every question in the group inline via QuestionCard.
 * Shared shape for By Exam and By Year so both browse AND test, not just
 * launch a mock straight away.
 */
function BrowseGroupCard({
  title, groupQuestions, isOpen, onToggle, onStartTest, testLabel,
  questionExamName, questionSitting, corrections, expandedQuestions, onToggleQuestion,
}: {
  title: string;
  groupQuestions: McqBankQuestion[];
  isOpen: boolean;
  onToggle: () => void;
  onStartTest: (q: McqBankQuestion[], label?: string) => void;
  testLabel: string;
  questionExamName: (q: BankQuestion) => string;
  questionSitting: (q: BankQuestion) => ExamPaper | null;
  corrections: Record<string, Correction>;
  expandedQuestions: Set<string>;
  onToggleQuestion: (id: string) => void;
}) {
  return (
    <div className="sto-card space-y-3">
      <div className="flex items-center justify-between gap-3">
        <button onClick={onToggle} className="text-left flex-1 min-w-0">
          <div className="font-semibold text-sm">{isOpen ? '▾' : '▸'} {title}</div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {groupQuestions.length} questions
          </div>
        </button>
        {groupQuestions.length > 0 && (
          <button
            onClick={() => onStartTest(groupQuestions, testLabel)}
            className="px-3 py-1.5 rounded text-sm font-medium shrink-0"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            Start Test
          </button>
        )}
      </div>
      {isOpen && (
        <div className="space-y-3 pt-1" style={{ borderTop: '1px solid var(--border)' }}>
          {groupQuestions.map((q) => (
            <QuestionCard
              key={q.id}
              q={q}
              questionExamName={questionExamName}
              questionSitting={questionSitting}
              corrections={corrections}
              isOpen={expandedQuestions.has(q.id)}
              onToggle={() => onToggleQuestion(q.id)}
            />
          ))}
          {groupQuestions.length === 0 && (
            <p className="text-xs italic" style={{ color: 'var(--text-secondary)' }}>No questions in this group.</p>
          )}
        </div>
      )}
    </div>
  );
}

function ExamBrowseTab({
  questions, exams, questionExamName, questionSitting, corrections, onStartTest,
}: {
  questions: McqBankQuestion[];
  exams: string[];
  questionExamName: (q: BankQuestion) => string;
  questionSitting: (q: BankQuestion) => ExamPaper | null;
  corrections: Record<string, Correction>;
  onStartTest: (q: McqBankQuestion[], label?: string) => void;
}) {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const toggleQuestion = (id: string) => {
    setExpandedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="max-w-3xl space-y-6">
      <h2 className="text-lg font-semibold">Browse by exam</h2>

      <div className="space-y-2">
        {exams.map((exam) => (
          <BrowseGroupCard
            key={exam}
            title={exam}
            groupQuestions={questions.filter((q) => questionExamName(q) === exam)}
            isOpen={openGroup === exam}
            onToggle={() => setOpenGroup(openGroup === exam ? null : exam)}
            onStartTest={onStartTest}
            testLabel={`Exam: ${exam}`}
            questionExamName={questionExamName}
            questionSitting={questionSitting}
            corrections={corrections}
            expandedQuestions={expandedQuestions}
            onToggleQuestion={toggleQuestion}
          />
        ))}
      </div>
    </div>
  );
}

function YearlyBrowseTab({
  questions, years, questionExamName, questionSitting, corrections, onStartTest,
}: {
  questions: McqBankQuestion[];
  years: number[];
  questionExamName: (q: BankQuestion) => string;
  questionSitting: (q: BankQuestion) => ExamPaper | null;
  corrections: Record<string, Correction>;
  onStartTest: (q: McqBankQuestion[], label?: string) => void;
}) {
  const [openGroup, setOpenGroup] = useState<number | null>(null);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const toggleQuestion = (id: string) => {
    setExpandedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="max-w-3xl space-y-6">
      <h2 className="text-lg font-semibold">Browse by year</h2>

      <div className="space-y-2">
        {years.map((year) => (
          <BrowseGroupCard
            key={year}
            title={String(year)}
            groupQuestions={questions.filter((q) => q.year === year)}
            isOpen={openGroup === year}
            onToggle={() => setOpenGroup(openGroup === year ? null : year)}
            onStartTest={onStartTest}
            testLabel={`Year: ${year}`}
            questionExamName={questionExamName}
            questionSitting={questionSitting}
            corrections={corrections}
            expandedQuestions={expandedQuestions}
            onToggleQuestion={toggleQuestion}
          />
        ))}
      </div>
    </div>
  );
}

// Paper subjects sort in the order the real exam sits them: both English
// papers, then GS-I/II/III — not alphabetically ('English-II' < 'GS-I').
const PAPER_SUBJECT_ORDER = ['English-I', 'English-II', 'GS-I', 'GS-II', 'GS-III'];

/**
 * Browse the bank exactly the way a real sitting is structured: Year → exam
 * → Paper I/II/III (English-I/II, GS-I/II/III), each individually testable
 * or expandable to read every question in that one paper — mirrors the
 * printed exam instead of a flat topic/keyword filter.
 */
function PaperBrowseTab({
  questions, descriptiveQuestions, papers, years, questionExamName, questionSitting, corrections, onStartTest,
}: {
  questions: McqBankQuestion[];
  descriptiveQuestions: DescriptiveBankQuestion[];
  papers: ExamPaper[];
  years: number[];
  questionExamName: (q: BankQuestion) => string;
  questionSitting: (q: BankQuestion) => ExamPaper | null;
  corrections: Record<string, Correction>;
  onStartTest: (q: McqBankQuestion[], label?: string) => void;
}) {
  const [openPaper, setOpenPaper] = useState<string | null>(null);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  const toggleQuestion = (id: string) => {
    setExpandedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="max-w-3xl space-y-8">
      <h2 className="text-lg font-semibold">Browse by paper</h2>
      <p className="text-sm -mt-4" style={{ color: 'var(--text-secondary)' }}>
        Every sitting, laid out the way it was printed — pick one paper to read it straight through or start a test
        on just that paper.
      </p>

      {years.map((year) => {
        const yearPapers = papers
          .filter((p) => p.year === year)
          .sort((a, b) => PAPER_SUBJECT_ORDER.indexOf(a.paperSubject) - PAPER_SUBJECT_ORDER.indexOf(b.paperSubject));
        if (yearPapers.length === 0) return null;
        const examNames = Array.from(new Set(yearPapers.map((p) => p.examName)));

        return (
          <div key={year} className="space-y-4">
            <h3 className="text-base font-semibold" style={{ color: 'var(--accent)' }}>{year}</h3>
            {examNames.map((exam) => (
              <div key={exam} className="space-y-2">
                <div className="text-xs font-semibold tracking-wide uppercase" style={{ color: 'var(--text-secondary)' }}>
                  {exam}
                </div>
                {yearPapers.filter((p) => p.examName === exam).map((paper) => {
                  const mcq = questions.filter((q) => q.paperId === paper.id);
                  const desc = descriptiveQuestions.filter((q) => q.paperId === paper.id);
                  const isOpen = openPaper === paper.id;
                  return (
                    <div key={paper.id} className="sto-card space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <button
                          onClick={() => setOpenPaper(isOpen ? null : paper.id)}
                          className="text-left flex-1 min-w-0"
                        >
                          <div className="font-semibold text-sm">
                            {isOpen ? '▾' : '▸'} Paper {paper.paperNumber ?? '—'} — {paper.paperSubject}
                          </div>
                          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            {mcq.length > 0 ? `${mcq.length} MCQs` : ''}
                            {mcq.length > 0 && desc.length > 0 ? ', ' : ''}
                            {desc.length > 0 ? `${desc.length} descriptive` : ''}
                            {mcq.length === 0 && desc.length === 0 ? 'No questions in the bank yet' : ''}
                          </div>
                        </button>
                        {mcq.length > 0 && (
                          <button
                            onClick={() => onStartTest(mcq, `${exam}, ${year} — Paper ${paper.paperNumber} (${paper.paperSubject})`)}
                            className="px-3 py-1.5 rounded text-sm font-medium shrink-0"
                            style={{ background: 'var(--accent)', color: '#fff' }}
                          >
                            Start Test
                          </button>
                        )}
                      </div>
                      {isOpen && (
                        <div className="space-y-3 pt-1" style={{ borderTop: '1px solid var(--border)' }}>
                          {mcq.map((q) => (
                            <QuestionCard
                              key={q.id}
                              q={q}
                              questionExamName={questionExamName}
                              questionSitting={questionSitting}
                              corrections={corrections}
                              isOpen={expandedQuestions.has(q.id)}
                              onToggle={() => toggleQuestion(q.id)}
                            />
                          ))}
                          {desc.map((q) => (
                            <DescriptiveQuestionCard
                              key={q.id}
                              bankId={BANK_ID}
                              question={q}
                              renderEmphasis={renderEmphasis}
                              subjectClass={subjectClass}
                              meta={`${questionExamName(q)}, ${year}`}
                            />
                          ))}
                          {mcq.length === 0 && desc.length === 0 && (
                            <p className="text-xs italic" style={{ color: 'var(--text-secondary)' }}>
                              This paper hasn't been rebuilt from source yet.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function MockSetupTab({ questions, onStartTest }: { questions: McqBankQuestion[]; onStartTest: (q: McqBankQuestion[], label?: string) => void }) {
  const [testSize, setTestSize] = useState(25);

  const pickRandom = () => {
    const arr = [...questions].sort(() => Math.random() - 0.5);
    onStartTest(arr.slice(0, testSize), `Random ${testSize}`);
  };

  return (
    <div className="max-w-lg space-y-6">
      <h2 className="text-lg font-semibold">Mock test setup</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Questions</label>
          <select
            value={testSize}
            onChange={(e) => setTestSize(Number(e.target.value))}
            className="px-3 py-2 rounded-md text-sm w-full"
            style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          >
            <option value={10}>10 (quick)</option>
            <option value={25}>25</option>
            <option value={50}>50 (half paper)</option>
            <option value={100}>100+ (full paper)</option>
          </select>
        </div>

        <button
          onClick={pickRandom}
          className="px-4 py-2 rounded-md font-medium w-full"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          Start test ({testSize} questions)
        </button>

        <div className="sto-card text-sm" style={{ color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--text-primary)' }}>Real negative marking:</strong> correct = +1, wrong = −1/3, blank = 0 —
          matching the actual MPSC exam rules.
        </div>
      </div>
    </div>
  );
}

function MockRunnerTab({ questions, answers, onAnswer, onSubmit }: { questions: McqBankQuestion[]; answers: Record<number, number>; onAnswer: (i: number, ans: number) => void; onSubmit: () => void }) {
  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-center justify-between sticky top-0 py-2 -mx-1 px-1" style={{ background: 'var(--bg-app)', zIndex: 1 }}>
        <h2 className="text-lg font-semibold">Test in progress</h2>
        <div className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
          {Object.keys(answers).length} / {questions.length} answered
        </div>
      </div>

      <div className="space-y-3">
        {questions.map((q, i) => (
          <div key={q.id} className="sto-card space-y-2.5">
            {q.passage && <StemContext text={q.passage} />}
            <div className="font-semibold text-sm">Q{i + 1}. {renderEmphasis(q.question)}</div>
            <div className="space-y-1.5">
              {q.options.map((opt, j) => {
                const selected = answers[i] === j;
                return (
                  <label
                    key={j}
                    className={`sto-opt cursor-pointer ${selected ? 'sto-opt-correct' : ''}`}
                    style={selected ? undefined : { cursor: 'pointer' }}
                  >
                    <input
                      type="radio"
                      name={`q-${i}`}
                      checked={selected}
                      onChange={() => onAnswer(i, j)}
                      style={{ marginTop: 2 }}
                    />
                    <span>{String.fromCharCode(97 + j)}) {opt}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button onClick={onSubmit} className="px-4 py-2 rounded-md font-medium w-full" style={{ background: 'var(--accent)', color: '#fff' }}>
        Submit test
      </button>
    </div>
  );
}

function MockReviewTab({ questions, answers, results, onBack }: { questions: McqBankQuestion[]; answers: Record<number, number>; results: MockResults; onBack: () => void }) {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Test results</h2>
        <div className="grid grid-cols-4 gap-3">
          <div className="sto-stat text-center"><b>{results.score.toFixed(2)}</b><span>Score</span></div>
          <div className="sto-stat text-center"><b style={{ color: '#2e7d4f' }}>{results.correct}</b><span>Correct</span></div>
          <div className="sto-stat text-center"><b style={{ color: '#a33232' }}>{results.wrong}</b><span>Wrong</span></div>
          <div className="sto-stat text-center"><b style={{ color: '#9a6b12' }}>{results.unattempted}</b><span>Blank</span></div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-sm">Review answers</h3>
        {questions.map((q, i) => {
          const answered = i in answers;
          const isCorrect = answers[i] === q.answerIndex;
          return (
            <div
              key={q.id}
              className="sto-card space-y-2"
              style={{ borderColor: !answered ? '#9a6b12' : isCorrect ? '#2e7d4f' : '#a33232', borderWidth: 2 }}
            >
              <div className="font-semibold text-sm">Q{i + 1}. {renderEmphasis(q.question)}</div>
              <div className="space-y-1.5">
                {q.options.map((opt, j) => {
                  const isRight = j === q.answerIndex;
                  const isWrongPick = j === answers[i] && !isCorrect;
                  return (
                    <div key={j} className={`sto-opt ${isRight ? 'sto-opt-correct' : isWrongPick ? 'sto-opt-wrong-pick' : ''}`}>
                      <span className="sto-opt-letter">{String.fromCharCode(97 + j)}</span>
                      <span>{opt}</span>
                    </div>
                  );
                })}
              </div>
              <div className="text-xs p-2 rounded" style={{ background: 'var(--bg-app)', color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Explanation:</strong> {q.explanation}
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={onBack} className="px-4 py-2 rounded-md font-medium" style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
        Take another test
      </button>
    </div>
  );
}

/** SM-2 flashcard review over this bank's own questions — front is the
 *  stem, back is the correct answer + explanation. Reuses the same
 *  FlashcardFlip mechanic as the Flashcards module and Recall hub, just
 *  fed from bank questions instead of a decks/ content file. */
function StoReviewTab({ questions }: { questions: McqBankQuestion[] }) {
  const { deckProgress, gradeCard, undoGradeCard } = useApp();
  const progress = deckProgress[STO_REVIEW_DECK_ID];
  const schedule = progress?.schedule;
  const known = progress?.known ?? [];

  const reviewable = useMemo(
    () => questions.filter((q) => !q.figureBased && !q.compensated && !q.sourceDefect),
    [questions],
  );

  const cardIsDue = (cardId: string) => {
    const s = schedule?.[cardId];
    return s ? isDue(s) : !known.includes(cardId);
  };

  const pool: FlashCard[] = useMemo(
    () =>
      reviewable
        .filter((q) => cardIsDue(q.id))
        .map((q) => ({
          id: q.id,
          topic: q.topic ?? '',
          topicLabel: q.topic ?? '',
          front: q.question,
          back: `${q.options[q.answerIndex]}\n\n${q.explanation}`,
        })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reviewable, schedule, known.length],
  );

  const dueCount = pool.length;

  return (
    <div className="max-w-xl">
      <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
        {dueCount} of {reviewable.length} questions due for review — flip, then grade Again/Hard/Good/Easy.
      </p>
      <FlashcardFlip
        pool={pool}
        resetKey={reviewable.length}
        onGrade={(cardId, grade) => gradeCard(STO_REVIEW_DECK_ID, cardId, grade)}
        scheduleFor={(cardId) => schedule?.[cardId]}
        onUndo={(cardId, prevSchedule) => undoGradeCard(STO_REVIEW_DECK_ID, cardId, prevSchedule)}
        emptyTitle={reviewable.length === 0 ? 'Nothing reviewable in this bank.' : 'Nothing due right now.'}
        emptyBody="Check back once a card's schedule brings it due again."
      />
    </div>
  );
}

function ProgressTab() {
  const { user } = useAuthStore();
  const [history, setHistory] = useState<import('@/lib/mpscApi').MockAttemptRecord[] | null>(null);
  const [myReports, setMyReports] = useState<import('@/lib/mpscApi').QuestionReport[] | null>(null);

  useEffect(() => {
    if (!user) return;
    api.getHistory(BANK_ID).then((r) => setHistory(r.attempts));
    api.myReports(BANK_ID).then((r) => setMyReports(r.reports));
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-3xl space-y-6">
        <h2 className="text-lg font-semibold">Study progress</h2>
        <div className="sto-card">
          <p style={{ color: 'var(--text-secondary)' }}>Log in (top right) to track your mock test history and see the status of questions you've flagged.</p>
        </div>
      </div>
    );
  }

  const avgScore = history && history.length > 0 ? history.reduce((s, h) => s + h.score, 0) / history.length : null;
  const bestScore = history && history.length > 0 ? Math.max(...history.map((h) => h.score)) : null;

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h2 className="text-lg font-semibold mb-3">Study progress</h2>
        {history === null ? (
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading…</p>
        ) : history.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No mock tests taken yet — results will appear here once you submit one.</p>
        ) : (
          <>
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="sto-stat"><b>{history.length}</b><span>Tests taken</span></div>
              <div className="sto-stat"><b>{avgScore?.toFixed(1)}</b><span>Avg score</span></div>
              <div className="sto-stat"><b>{bestScore?.toFixed(1)}</b><span>Best score</span></div>
            </div>
            <div className="space-y-2">
              {history.map((h) => (
                <div key={h.id} className="sto-card flex items-center justify-between gap-3 text-sm">
                  <div>
                    <div className="font-medium">{h.testLabel || 'Mock test'}</div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {new Date(h.takenAt).toLocaleString()} · {h.correct} correct, {h.wrong} wrong, {h.unattempted} blank
                    </div>
                  </div>
                  <div className="font-mono font-semibold shrink-0" style={{ color: 'var(--accent)' }}>{h.score.toFixed(2)} / {h.total}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div>
        <h3 className="font-semibold mb-3 text-sm">My flagged questions</h3>
        {myReports === null ? (
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading…</p>
        ) : myReports.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>You haven't flagged any questions yet.</p>
        ) : (
          <div className="space-y-2">
            {myReports.map((r) => {
              const color = r.status === 'accepted' ? '#2e7d4f' : r.status === 'rejected' ? '#a33232' : '#9a6b12';
              return (
                <div key={r.id} className="sto-card text-sm space-y-1">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="sto-pill" style={{ color, borderColor: color }}>{r.status}</span>
                    <span className="sto-pill">{r.issueType.replace(/_/g, ' ')}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  {r.message && <p style={{ color: 'var(--text-secondary)' }}>"{r.message}"</p>}
                  {r.adminNote && (
                    <p className="text-xs p-1.5 rounded" style={{ background: 'var(--bg-app)' }}>
                      <strong>Admin response:</strong> {r.adminNote}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
