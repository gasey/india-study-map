import type { BankQuestion } from '@/data/banks/types';
import { isMcqQuestion } from '@/data/banks/types';
import type { Primer } from '@/data/banks/all-primers';
import mizoramPyq from '@/data/banks/primers-mizoram-pyq.json';
import economyPyq from '@/data/banks/primers-economy-old-pyq.json';
import { AnswerSources } from './AnswerSources';
import { QuestionContext } from './QuestionContext';
import { QuestionImage } from './QuestionImage';
import { QuestionText } from './QuestionText';
import { textMode } from './filters';

const mizoGuides = mizoramPyq as Primer[];
const economyGuides = economyPyq as Primer[];

function questionSubject(q: BankQuestion): 'Mizoram' | 'Economics' | null {
  if (('gkTopic' in q && q.gkTopic === 'mizoram') || q.topic.startsWith('mizoram_') || q.topicLabel.startsWith('Mizoram —')) return 'Mizoram';
  if (('gkTopic' in q && q.gkTopic === 'economy') || q.topic === 'economy' || q.topicLabel === 'Economy') return 'Economics';
  return null;
}

function QuestionCompilation({ questions }: { questions: BankQuestion[] }) {
  return <div className="space-y-2">
    {questions.map((q, index) => {
      const mode = textMode(q);
      const title = q.questionNumber ? `Q${q.questionNumber}` : `Question ${index + 1}`;
      return <details key={q.id} className="udc-question-card" style={{ border: '1px solid var(--border, #dcdce3)', borderRadius: 9, padding: '11px 14px', background: 'var(--bg-panel, transparent)' }}>
        <summary style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
          <span><strong>{title}</strong>{q.topicLabel && <span style={{ marginLeft: 9, fontSize: 12, color: 'var(--text-secondary)' }}>{q.topicLabel}</span>}</span>
          <span style={{ flex: 'none', fontSize: 12, color: 'var(--text-secondary)' }}>{q.year ?? ''}{q.answerIndex === undefined || q.answerIndex < 0 ? ' · unanswered' : ''}</span>
        </summary>
        <div style={{ marginTop: 12, lineHeight: 1.65 }}>
          <QuestionContext direction={q.direction} passage={q.passage} plain={mode.plain} />
          <QuestionText text={q.question} plain={mode.plain} />
          <QuestionImage path={q.imagePath} />
          {isMcqQuestion(q) && <ol type="A" style={{ paddingLeft: 28, display: 'grid', gap: 5, marginTop: 10 }}>
            {q.options.map((option, optionIndex) => <li key={`${q.id}-${optionIndex}`} value={optionIndex + 1}><QuestionText text={option} plain={mode.plain} /></li>)}
          </ol>}
          {isMcqQuestion(q) && q.paperId?.startsWith('mpsc-group-b-') && <AnswerSources q={q} />}
          {q.answerIndex !== undefined && q.answerIndex >= 0 && <details style={{ marginTop: 10 }}>
            <summary style={{ cursor: 'pointer', fontWeight: 650 }}>Answer and explanation</summary>
            <div style={{ marginTop: 8 }}>
              {isMcqQuestion(q) && <p><strong>Answer:</strong> {String.fromCharCode(65 + q.answerIndex)}. {q.options[q.answerIndex]}</p>}
              {q.explanation && <p style={{ whiteSpace: 'pre-wrap' }}>{q.explanation}</p>}
              {!q.explanation && <p>No explanation is available for this item yet.</p>}
              {!q.paperId?.startsWith('mpsc-group-b-') && <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Answer source: {q.answerSource ?? 'derived'}{q.answerConfidence ? ` · ${q.answerConfidence} confidence` : ''}</p>}
            </div>
          </details>}
          {(q.answerIndex === undefined || q.answerIndex < 0) && <p style={{ marginTop: 9, fontSize: 13, color: 'var(--text-secondary)' }}>No answer or worked solution is available for this item.</p>}
          {q.source && <p style={{ marginTop: 8, fontSize: 12, color: 'var(--text-secondary)' }}>Source: {q.source}</p>}
        </div>
      </details>;
    })}
  </div>;
}

function GuideList({ rows }: { rows: Primer[] }) {
  return <div className="space-y-2">
    {rows.map((guide) => <details key={guide.subtopic} className="udc-question-card" style={{ border: '1px solid var(--border, #dcdce3)', borderRadius: 10, padding: '13px 15px', background: 'var(--bg-panel, transparent)' }}>
      <summary style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <strong>{guide.subtopic}</strong>
        <span style={{ flex: 'none', borderRadius: 999, padding: '2px 9px', fontSize: 11, fontWeight: 700, color: guide.priority === 'critical' ? '#fff' : 'var(--text-secondary)', background: guide.priority === 'critical' ? '#a33232' : 'var(--bg-panel-elev, #eee)' }}>{guide.priority}</span>
      </summary>
      <div style={{ marginTop: 12, lineHeight: 1.6, fontSize: 14 }} dangerouslySetInnerHTML={{ __html: guide.primer }} />
      {guide.analogy && <div style={{ marginTop: 10, padding: '10px 12px', borderLeft: '3px solid var(--info, #3b7dd8)', background: 'var(--bg-panel-elev, #f5f5f7)', borderRadius: 6 }}><strong>Memory aid · </strong>{guide.analogy}</div>}
      {guide.traps.length > 0 && <div style={{ marginTop: 10, padding: '10px 12px', borderLeft: '3px solid var(--warn, #b06f1a)', borderRadius: 6 }}><strong>Common traps</strong><ul>{guide.traps.map((trap) => <li key={trap}>{trap}</li>)}</ul></div>}
      {guide.formulae.length > 0 && <div style={{ display: 'grid', gap: 5, marginTop: 10 }}>{guide.formulae.map((item) => <code key={item} style={{ fontSize: 12, whiteSpace: 'normal' }}>{item}</code>)}</div>}
    </details>)}
  </div>;
}

export function QuestionStudyGuides({ questions }: { questions: BankQuestion[] }) {
  const mizoram = questions.filter((q) => questionSubject(q) === 'Mizoram');
  const economy = questions.filter((q) => questionSubject(q) === 'Economics');
  return <section aria-label="Mizo and Economics question compilations" style={{ maxWidth: 980 }}>
    <div className="udc-hero" style={{ marginBottom: 16 }}>
      <h2 style={{ margin: '0 0 5px', fontSize: 20 }}>Mizo &amp; Economics question compilations</h2>
      <p style={{ margin: 0, fontSize: 13.5 }}>Every matching question in the UDC/LDC/Group B module is collected under its subject. Open a question to see its source, choices and any available answer; Economics also includes the concept guide.</p>
    </div>
    <div className="space-y-3">
      <details className="udc-question-card" open style={{ border: '1px solid var(--border, #dcdce3)', borderRadius: 10, padding: '14px 16px', background: 'var(--bg-panel, transparent)' }}>
        <summary style={{ cursor: 'pointer', fontSize: 17, fontWeight: 700 }}>Mizo questions ({mizoram.length})</summary>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>All questions tagged to Mizoram or Mizo-related topics in this module.</p>
        <QuestionCompilation questions={mizoram} />
        <h3 style={{ marginTop: 20 }}>Mizoram concept notes</h3>
        <GuideList rows={mizoGuides} />
      </details>
      <details className="udc-question-card" style={{ border: '1px solid var(--border, #dcdce3)', borderRadius: 10, padding: '14px 16px', background: 'var(--bg-panel, transparent)' }}>
        <summary style={{ cursor: 'pointer', fontSize: 17, fontWeight: 700 }}>Economics questions ({economy.length})</summary>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>All questions tagged to Economics in this module.</p>
        <QuestionCompilation questions={economy} />
        <h3 style={{ marginTop: 20 }}>Economics concept guide ({economyGuides.length} topics)</h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Use these as concept notes; date-sensitive figures in old questions remain tied to their paper year.</p>
        <GuideList rows={economyGuides} />
      </details>
    </div>
  </section>;
}
