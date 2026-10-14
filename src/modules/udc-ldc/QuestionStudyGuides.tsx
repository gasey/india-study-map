import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { BankQuestion } from '@/data/banks/types';
import type { Primer } from '@/data/banks/all-primers';
import mizoramPyq from '@/data/banks/primers-mizoram-pyq.json';
import economyPyq from '@/data/banks/primers-economy-old-pyq.json';
import { hasTopic } from './topicOverrides';

const mizoGuides = mizoramPyq as Primer[];
const economyGuides = economyPyq as Primer[];

const conceptPatterns: Array<[string, RegExp]> = [
  ['National income', /\bGDP\b|\bGNP\b|national income|growth rate|per.capita/i],
  ['Fiscal policy', /fiscal|deficit|budget|public expenditure/i],
  ['RBI monetary', /repo|monetary|\bRBI\b|bank rate|liquidity|open.market/i],
  ['Banking, credit', /bank|credit|\bSEBI\b|\bNABARD\b|financial/i],
  ['Balance of payments', /balance of payment|trade|foreign.exchange|reserves|\bFDI\b|exports|imports/i],
  ['Five-Year Plans', /plan|Mahalanobis|NITI|Garibi/i],
  ['Agriculture, MSP', /agricultur|crop|\bMSP\b|\bCACP\b|rural|kharif|rabi|employment.guarantee/i],
  ['Poverty, inequality', /poverty|inequality|development|per.capita|\bHDI\b/i],
  ['Taxes, public', /tax|GST|Finance Commission|devolution/i],
  ['How to handle dated', /current|budget|rate|rank|report/i],
  ['GDP, GNP', /\bGDP\b|\bGNP\b|\bNDP\b|\bNNP\b|national income|depreciation/i],
  ['Economic growth', /\bHDI\b|development|dependency|per.capita|human development/i],
  ['Inflation, price', /inflation|deflation|price.index|\bCPI\b|\bWPI\b/i],
  ['Revenue and capital', /capital.expenditure|revenue|receipt|budget|deficit/i],
  ['Direct and indirect', /tax|GST|customs|duty|duties/i],
  ['RBI repo corridor', /repo|\bCRR\b|\bSLR\b|\bRBI\b|monetary|bank rate/i],
  ['Self-help groups', /self.help|\bSHG\b|\bNABARD\b|financial inclusion|rural.credit/i],
  ['WTO agriculture', /\bWTO\b|Amber|Green.Box|Blue.Box|subsid/i],
  ['Rostow stages', /Rostow|take.off|maturity/i],
  ['India’s planning', /plan|Mahalanobis|NITI|mixed.economy/i],
  ['Economic revolutions', /revolution/i],
];

function relatedQuestions(guide: Primer, questions: BankQuestion[]) {
  const pattern = conceptPatterns.find(([prefix]) => guide.subtopic.startsWith(prefix))?.[1];
  // Distractor options must not turn an unrelated stem into a concept match.
  return pattern ? questions.filter(q => pattern.test(q.question)) : [];
}

function GuideList({ rows, questions = [], onPractice }: {
  rows: Primer[]; questions?: BankQuestion[]; onPractice?: (guide: Primer, related: BankQuestion[]) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [openTopics, setOpenTopics] = useState<Record<string, boolean>>({});
  const relatedByTopic = useMemo(() => new Map(rows.map(guide => [guide.subtopic, relatedQuestions(guide, questions)])), [rows, questions]);
  return <div className="udc-concept-guide">
    <div className="udc-guide-toolbar">
      <span>{rows.length} lessons · concepts, memory aids and exam traps</span>
      <button type="button" onClick={() => { setExpanded(v => !v); setOpenTopics({}); }}>
        {expanded ? 'Collapse lessons' : 'Expand all lessons'}
      </button>
    </div>
    <div className="udc-guide-lessons">
      {rows.map((guide, index) => {
        const related = relatedByTopic.get(guide.subtopic) ?? [];
        // Plain-text lessons are broken into short reading paragraphs.
        const sentences = guide.primer.split(/(?<=[.!?])\s+(?=[A-Z“])/u);
        const paragraphs = Array.from({ length: Math.ceil(sentences.length / 2) }, (_, i) => sentences.slice(i * 2, i * 2 + 2).join(' '));
        return <details key={guide.subtopic} className="udc-guide-lesson" open={openTopics[guide.subtopic] ?? expanded}>
          <summary onClick={event => {
            event.preventDefault();
            setOpenTopics(prev => ({ ...prev, [guide.subtopic]: !(prev[guide.subtopic] ?? expanded) }));
          }}>
            <span className="udc-guide-number">{String(index + 1).padStart(2, '0')}</span>
            <span className="udc-guide-title"><strong>{guide.subtopic}</strong><small>{related.length > 0 ? `${related.length} related questions in this module` : 'Concept review'}</small></span>
            <span className={`udc-guide-priority is-${guide.priority}`}>{guide.priority}</span>
          </summary>
          <div className="udc-guide-body">
            <div className="udc-guide-explanation">
              {guide.primer.includes('<') ? <div dangerouslySetInnerHTML={{ __html: guide.primer }} /> : paragraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
            </div>
            {guide.analogy && <aside className="udc-guide-memory"><strong>Memory aid</strong><p>{guide.analogy}</p></aside>}
            <div className="udc-guide-reference-grid">
              {guide.traps.length > 0 && <aside className="udc-guide-traps"><h4>Watch for these traps</h4><ul>{guide.traps.map(trap => <li key={trap}>{trap}</li>)}</ul></aside>}
              {guide.formulae.length > 0 && <aside className="udc-guide-facts"><h4>Key facts &amp; references</h4>{guide.formulae.map(item => <p key={item}>{item}</p>)}</aside>}
            </div>
            {related.length > 0 && onPractice && <button type="button" className="udc-guide-practice" onClick={() => onPractice(guide, related)}>Try {related.length} related question{related.length === 1 ? '' : 's'} ↓</button>}
          </div>
        </details>;
      })}
    </div>
  </div>;
}

export type CompilationSubject = 'mizo' | 'economics' | 'science';

export function QuestionStudyGuides({ subject, questions, renderQuestions }: {
  subject: CompilationSubject; questions: BankQuestion[]; renderQuestions: (questions: BankQuestion[]) => ReactNode;
}) {
  const subjectQuestions = useMemo(() => questions.filter(q =>
    subject === 'mizo' ? hasTopic(q, 'mizoram')
      : subject === 'economics' ? hasTopic(q, 'economy')
        : hasTopic(q, 'science') && q.type !== 'descriptive'), [questions, subject]);
  const [selectedConcept, setSelectedConcept] = useState<{ title: string; questions: BankQuestion[] } | null>(null);
  const [economicsView, setEconomicsView] = useState<'questions' | 'concepts'>('questions');
  return <section className="udc-subject-compilations" aria-label={`${subject} question compilation`}>
    {subject === 'mizo' && <section className="udc-compilation-section">
      <header className="udc-compilation-heading"><span>MIZORAM</span><h3>Mizo questions <small>{subjectQuestions.length}</small></h3><p>All Mizoram and Mizo-related questions in this module.</p></header>
      {renderQuestions(subjectQuestions)}
      <details className="udc-mizo-notes"><summary>Mizoram concept notes · {mizoGuides.length} topics</summary><GuideList rows={mizoGuides} /></details>
    </section>}
    {subject === 'economics' && <section className="udc-compilation-section is-economics">
      <header className="udc-compilation-heading"><span>ECONOMICS</span><h3>Economics questions and concepts</h3><p>{subjectQuestions.length} questions and {economyGuides.length} lessons drawn from older papers. Historical rates and rankings stay tied to their paper year.</p></header>
      <nav className="udc-compilation-nav" aria-label="Economics views">
        <button type="button" aria-pressed={economicsView === 'questions'} className={economicsView === 'questions' ? 'is-active' : ''} onClick={() => setEconomicsView('questions')}>Questions · {subjectQuestions.length}</button>
        <button type="button" aria-pressed={economicsView === 'concepts'} className={economicsView === 'concepts' ? 'is-active' : ''} onClick={() => setEconomicsView('concepts')}>Concept guide · {economyGuides.length}</button>
      </nav>
      {economicsView === 'concepts' && <GuideList rows={economyGuides} questions={subjectQuestions} onPractice={(guide, related) => {
        setSelectedConcept({ title: guide.subtopic, questions: related });
        setEconomicsView('questions');
      }} />}
      {economicsView === 'questions' && <>
        <div className="udc-economics-question-heading">
          <h3>Economics questions <small>{selectedConcept?.questions.length ?? subjectQuestions.length}</small></h3>
          {selectedConcept && <p>{selectedConcept.title} <button type="button" onClick={() => setSelectedConcept(null)}>Show all {subjectQuestions.length} questions</button></p>}
        </div>
        <div key={selectedConcept?.title ?? 'all-economics'}>{renderQuestions(selectedConcept?.questions ?? subjectQuestions)}</div>
      </>}
    </section>}
    {subject === 'science' && <section className="udc-compilation-section is-science">
      <header className="udc-compilation-heading"><span>GENERAL SCIENCE</span><h3>Science questions <small>{subjectQuestions.length}</small></h3><p>Biology, chemistry, physics, space, and environmental science from the general-study papers. Each card retains its printed-source and scoring status.</p></header>
      {renderQuestions(subjectQuestions)}
    </section>}
  </section>;
}
