import { useMemo, useState } from 'react';
import { isCorrectOption, isMcqQuestion } from '@/data/banks/types';
import type { BankQuestion } from '@/data/banks/types';
import { zzrMock2026, zzrMock2026Papers } from '@/data/banks/zzr-mock-2026';
import { ExamView } from '@/modules/udc-ldc/ExamView';
import { PracticeView } from '@/modules/udc-ldc/PracticeView';
import { QuestionContext } from '@/modules/udc-ldc/QuestionContext';
import { QuestionImage } from '@/modules/udc-ldc/QuestionImage';
import { QuestionText } from '@/modules/udc-ldc/QuestionText';
import { isAnswerable, optionLetter, sectionOf, textMode } from '@/modules/udc-ldc/filters';
import { useProgress } from '@/modules/udc-ldc/useProgress';
import type { AttemptMetadata } from '@/lib/learning/types';

type Mode = 'overview' | 'browse' | 'practice' | 'exam' | 'progress';
type Section = 'all' | 'gk' | 'english' | 'computer' | 'arithmetic' | 'reasoning';
type AttemptFilter = 'all' | 'never' | 'wrong';

const SECTION_LABELS: Record<Exclude<Section, 'all'>, string> = {
  gk: 'General Knowledge',
  english: 'General English',
  computer: 'Computer Knowledge',
  arithmetic: 'Simple Arithmetic',
  reasoning: 'General Intelligence & Reasoning',
};

const PAPER_PDF: Record<string, string> = {
  'zzr-mock-2026-paper-1': '/papers/zzr-mock-2026/paper-1-series-b.pdf',
  'zzr-mock-2026-paper-2': '/papers/zzr-mock-2026/paper-2-series-b.pdf',
};

function attemptId(prefix: string) {
  return `${prefix}:${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}:${Math.random()}`}`;
}

function sourceLabel(q: BankQuestion) {
  if (q.answerSource === 'transcribed') return 'Supplied key';
  if (q.answerSource === 'derived') return `Worked answer · ${q.answerConfidence ?? 'unrated'} confidence`;
  return q.answerSource ?? 'Answer available';
}

export default function ZzrMockPage() {
  const tracker = useProgress('zzr-mock-2026');
  const { progress } = tracker;
  const [mode, setMode] = useState<Mode>('overview');
  const [paperId, setPaperId] = useState('all');
  const [section, setSection] = useState<Section>('all');
  const [topic, setTopic] = useState('all');
  const [attemptFilter, setAttemptFilter] = useState<AttemptFilter>('all');

  const scoped = useMemo(() => zzrMock2026.questions.filter((q) => {
    if (paperId !== 'all' && q.paperId !== paperId) return false;
    if (section !== 'all' && sectionOf(q) !== section) return false;
    if (topic !== 'all' && q.topic !== topic) return false;
    if (attemptFilter === 'never' && progress[q.id]) return false;
    if (attemptFilter === 'wrong' && (!progress[q.id] || progress[q.id].lastCorrect)) return false;
    return true;
  }), [paperId, section, topic, attemptFilter, progress]);

  const topicOptions = useMemo(() => {
    const source = zzrMock2026.questions.filter((q) =>
      (paperId === 'all' || q.paperId === paperId) && (section === 'all' || sectionOf(q) === section));
    const seen = new Map<string, string>();
    source.forEach((q) => seen.set(q.topic, q.topicLabel));
    return [...seen.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, [paperId, section]);

  const counts = useMemo(() => {
    const all = zzrMock2026.questions;
    const attempted = all.filter((q) => progress[q.id]);
    const wrong = attempted.filter((q) => !progress[q.id].lastCorrect);
    return { attempted: attempted.length, wrong: wrong.length, total: all.length };
  }, [progress]);

  const recordBrowse = (q: BankQuestion, selectedIndex: number) => {
    void tracker.record(q.id, isCorrectOption(q, selectedIndex), {
      selectedIndex,
      source: 'browse',
      eventId: attemptId(`browse:${q.id}`),
    } satisfies AttemptMetadata);
  };

  const explain = (q: BankQuestion) => <>
    {q.explanation && <p style={{ margin: '9px 0 0', lineHeight: 1.55 }}>{q.explanation}</p>}
    {q.disputeNote && <p style={{ margin: '7px 0 0', color: 'var(--bad, #c4462f)', fontSize: 13 }}><strong>Disputed:</strong> {q.disputeNote}</p>}
    {q.answerKeyRef && <p style={{ margin: '7px 0 0', opacity: 0.68, fontSize: 12 }}>Source: {q.answerKeyRef}</p>}
    {q.answerAsOf && <p style={{ margin: '7px 0 0', color: 'var(--warn, #b06f1a)', fontSize: 12 }}>Answer as of {q.answerAsOf}.</p>}
  </>;

  const browse = <div style={{ display: 'grid', gap: 12 }}>
    <FilterBar
      paperId={paperId} setPaperId={(value) => { setPaperId(value); setTopic('all'); }}
      section={section} setSection={(value) => { setSection(value); setTopic('all'); }}
      topic={topic} setTopic={setTopic} topicOptions={topicOptions}
      attemptFilter={attemptFilter} setAttemptFilter={setAttemptFilter}
      matched={scoped.length} progress={progress}
    />
    {scoped.length === 0 ? <p>No questions match those filters.</p> : scoped.map((q) => (
      <BrowseQuestion key={q.id} question={q} progress={progress[q.id]} sourceHref={PAPER_PDF[q.paperId ?? '']}
        onAttempt={(index) => recordBrowse(q, index)} renderExplanation={() => explain(q)} />
    ))}
  </div>;

  return <main className="scroll-panel h-full overflow-y-auto" style={{ padding: '22px 24px 48px' }}>
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <header style={{ padding: '20px 22px', borderRadius: 16, border: '1px solid var(--border)', background: 'linear-gradient(135deg, color-mix(in srgb, var(--info, #3b7dd8) 13%, var(--bg-panel)), var(--bg-panel))', marginBottom: 18 }}>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: '.09em', textTransform: 'uppercase', opacity: .7 }}>Standalone mock-test module · 24 October 2026</p>
        <h1 style={{ margin: '5px 0', fontSize: 25 }}>Zawlbuk Zirna Run</h1>
        <p style={{ margin: 0, maxWidth: 760, lineHeight: 1.55, fontSize: 14 }}>
          Two Series B papers with explanations, topic filters, practice and timed exam mode. Attempts and wrong answers are saved separately from UDC/LDC progress.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 10, fontSize: 12 }}>
          <a href={PAPER_PDF['zzr-mock-2026-paper-1']} target="_blank" rel="noreferrer">Paper I PDF ↗</a>
          <a href={PAPER_PDF['zzr-mock-2026-paper-2']} target="_blank" rel="noreferrer">Paper II PDF ↗</a>
          <a href="/papers/zzr-mock-2026/paper-2-answer-key.jpeg" target="_blank" rel="noreferrer">Paper II supplied answer key ↗</a>
        </div>
      </header>

      <nav aria-label="Mock module views" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
        {([
          ['overview', 'Overview'], ['browse', 'Browse questions'], ['practice', 'Practice'],
          ['exam', 'Mock tests'], ['progress', `Progress · ${counts.wrong} wrong`],
        ] as [Mode, string][]).map(([value, label]) => <button key={value} type="button" aria-pressed={mode === value}
          onClick={() => setMode(value)} style={tabStyle(mode === value)}>{label}</button>)}
      </nav>

      {mode === 'overview' && <Overview counts={counts} onOpen={setMode} />}
      {mode === 'browse' && browse}
      {mode === 'practice' && <>
        <FilterBar
          paperId={paperId} setPaperId={(value) => { setPaperId(value); setTopic('all'); }}
          section={section} setSection={(value) => { setSection(value); setTopic('all'); }}
          topic={topic} setTopic={setTopic} topicOptions={topicOptions}
          attemptFilter={attemptFilter} setAttemptFilter={setAttemptFilter}
          matched={scoped.length} progress={progress}
        />
        <div style={{ marginTop: 14 }}>
          <PracticeView
            key={`${paperId}:${section}:${topic}:${attemptFilter}`}
            questions={scoped}
            progress={progress}
            bankId="zzr-mock-2026"
            onAnswer={tracker.record}
            onMistakeReason={(eventId, reason) => { void tracker.annotateAttempt(eventId, { mistakeReason: reason }); }}
            onAttemptConfidence={(eventId, confidence) => { void tracker.annotateAttempt(eventId, { confidence }); }}
          />
        </div>
      </>}
      {mode === 'exam' && <ExamView
        papers={zzrMock2026Papers}
        questions={zzrMock2026.questions}
        onRecordAttempts={tracker.recordMany}
        storageNamespace="zzr-mock-2026"
      />}
      {mode === 'progress' && <ProgressSummary questions={zzrMock2026.questions} progress={progress} />}
    </div>
  </main>;
}

function tabStyle(active: boolean): React.CSSProperties {
  return {
    padding: '7px 13px', borderRadius: 999, border: '1px solid var(--border)',
    background: active ? 'var(--info, #3b7dd8)' : 'transparent',
    color: active ? '#fff' : 'inherit', font: 'inherit', fontSize: 13,
    fontWeight: 600, cursor: 'pointer',
  };
}

function Overview({ counts, onOpen }: { counts: { attempted: number; wrong: number; total: number }; onOpen: (mode: Mode) => void }) {
  return <>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 18 }}>
      {zzrMock2026Papers.map((paper) => {
        const n = zzrMock2026.questions.filter((q) => q.paperId === paper.id).length;
        return <article key={paper.id} style={cardStyle}>
          <p style={eyebrow}>{paper.paperSubject}</p>
          <h2 style={{ fontSize: 17, margin: '5px 0' }}>{paper.paperNumber} · {n} questions</h2>
          <p style={{ margin: 0, fontSize: 13, opacity: .75 }}>2 marks each · −⅓ penalty · 180-minute mock</p>
          <button type="button" onClick={() => onOpen('exam')} style={{ ...tabStyle(true), marginTop: 12 }}>Start mock</button>
        </article>;
      })}
    </div>
    <div style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
      <div>
        <strong>{counts.attempted}/{counts.total}</strong> attempted <span style={{ opacity: .65 }}>·</span> <strong>{counts.wrong}</strong> previously wrong
        <p style={{ margin: '5px 0 0', fontSize: 13, opacity: .75 }}>Paper I answers are worked solutions; Paper II follows the supplied coaching key. Disputed items are flagged with notes.</p>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <button type="button" onClick={() => onOpen('browse')} style={tabStyle(false)}>Browse</button>
        <button type="button" onClick={() => onOpen('practice')} style={tabStyle(false)}>Practise</button>
      </div>
    </div>
  </>;
}

function FilterBar({
  paperId, setPaperId, section, setSection, topic, setTopic, topicOptions,
  attemptFilter, setAttemptFilter, matched, progress,
}: {
  paperId: string; setPaperId: (value: string) => void;
  section: Section; setSection: (value: Section) => void;
  topic: string; setTopic: (value: string) => void;
  topicOptions: [string, string][];
  attemptFilter: AttemptFilter; setAttemptFilter: (value: AttemptFilter) => void;
  matched: number; progress: ReturnType<typeof useProgress>['progress'];
}) {
  const controls: React.CSSProperties = { padding: '7px 9px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--bg-panel)', color: 'inherit', font: 'inherit', fontSize: 13 };
  return <section style={{ ...cardStyle, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }} aria-label="Question filters">
    <label style={labelStyle}>Paper <select value={paperId} onChange={(e) => setPaperId(e.target.value)} style={controls}>
      <option value="all">Both papers</option>{zzrMock2026Papers.map((p) => <option key={p.id} value={p.id}>{p.paperNumber}</option>)}
    </select></label>
    <label style={labelStyle}>Section <select value={section} onChange={(e) => setSection(e.target.value as Section)} style={controls}>
      <option value="all">All sections</option>{Object.entries(SECTION_LABELS).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
    </select></label>
    <label style={labelStyle}>Topic <select value={topic} onChange={(e) => setTopic(e.target.value)} style={controls}>
      <option value="all">All topics</option>{topicOptions.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
    </select></label>
    <label style={labelStyle}>Attempts <select value={attemptFilter} onChange={(e) => setAttemptFilter(e.target.value as AttemptFilter)} style={controls}>
      <option value="all">All</option><option value="never">Never attempted</option><option value="wrong">Previously wrong</option>
    </select></label>
    <span style={{ marginLeft: 'auto', fontSize: 12, opacity: .7 }}>{matched} matching · {Object.keys(progress).length} total attempted</span>
  </section>;
}

function BrowseQuestion({ question: q, progress, sourceHref, onAttempt, renderExplanation }: {
  question: BankQuestion; progress?: { n: number; lastCorrect: boolean; at: number };
  sourceHref?: string; onAttempt: (index: number) => void; renderExplanation: () => React.ReactNode;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  if (!isMcqQuestion(q)) return null;
  const mode = textMode(q);
  const show = revealed || picked !== null;
  return <article style={cardStyle}>
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 8, fontSize: 12, opacity: .72 }}>
      <span>{q.source} · Q{q.questionNumber} · {q.topicLabel}</span>
      {progress && <span>{progress.n} attempt{progress.n === 1 ? '' : 's'} · {progress.lastCorrect ? 'last right' : 'last wrong'}</span>}
    </div>
    <QuestionContext direction={q.direction} passage={q.passage} plain={mode.plain} />
    <div style={{ lineHeight: 1.55, marginBottom: 8 }}><QuestionText text={q.question} plain={mode.plain} /></div>
    <QuestionImage path={q.imagePath} />
    <div style={{ display: 'grid', gap: 6 }}>
      {q.options.map((option, index) => {
        const correct = show && isCorrectOption(q, index);
        const wrong = picked === index && show && !correct;
        return <button key={index} type="button" disabled={picked !== null} onClick={() => { setPicked(index); onAttempt(index); }}
          style={{ display: 'flex', alignItems: 'flex-start', gap: 9, textAlign: 'left', border: `1px solid ${correct ? 'var(--ok, #2e9e5b)' : wrong ? 'var(--bad, #c4462f)' : 'var(--border)'}`, borderRadius: 8, padding: '8px 10px', background: correct ? 'color-mix(in srgb, var(--ok, #2e9e5b) 10%, transparent)' : wrong ? 'color-mix(in srgb, var(--bad, #c4462f) 10%, transparent)' : 'transparent', color: 'inherit', font: 'inherit', cursor: picked === null ? 'pointer' : 'default' }}>
          <strong>{optionLetter(index).toUpperCase()}.</strong><span><QuestionText text={option} plain={mode.plain} /></span>
        </button>;
      })}
    </div>
    {!show && <button type="button" onClick={() => setRevealed(true)} style={{ ...tabStyle(false), marginTop: 9 }}>Reveal answer without recording an attempt</button>}
    {show && <div style={{ marginTop: 9 }}>
      <p style={{ margin: 0, fontWeight: 700, color: picked === null || isCorrectOption(q, picked) ? 'var(--ok, #2e9e5b)' : 'var(--bad, #c4462f)' }}>
        {picked === null ? `Answer: (${optionLetter(q.answerIndex).toUpperCase()}) ${sourceLabel(q)}` : isCorrectOption(q, picked) ? 'Correct' : `Not quite — answer (${optionLetter(q.answerIndex).toUpperCase()})`}
      </p>
      {renderExplanation()}
      <p style={{ margin: '8px 0 0', fontSize: 12, opacity: .65 }}>
        {sourceHref && <a href={sourceHref} target="_blank" rel="noreferrer">Open printed paper ↗</a>}
        {sourceHref && q.answerKeyRef && ' · '}
        {q.answerKeyRef && <a href="/papers/zzr-mock-2026/paper-2-answer-key.jpeg" target="_blank" rel="noreferrer">Open supplied key ↗</a>}
      </p>
    </div>}
  </article>;
}

function ProgressSummary({ questions, progress }: { questions: BankQuestion[]; progress: ReturnType<typeof useProgress>['progress'] }) {
  const grouped = new Map<string, { total: number; attempted: number; wrong: number }>();
  for (const paper of zzrMock2026Papers) {
    const rows = questions.filter((q) => q.paperId === paper.id);
    grouped.set(paper.id, {
      total: rows.length,
      attempted: rows.filter((q) => progress[q.id]).length,
      wrong: rows.filter((q) => progress[q.id] && !progress[q.id].lastCorrect).length,
    });
  }
  const wrong = questions.filter((q) => progress[q.id] && !progress[q.id].lastCorrect);
  return <div style={{ display: 'grid', gap: 12 }}>
    {zzrMock2026Papers.map((paper) => {
      const row = grouped.get(paper.id)!;
      return <article key={paper.id} style={cardStyle}>
        <h2 style={{ margin: '0 0 6px', fontSize: 17 }}>{paper.paperNumber}</h2>
        <p style={{ margin: 0 }}>{row.attempted}/{row.total} attempted · {row.wrong} currently marked wrong</p>
      </article>;
    })}
    <article style={cardStyle}>
      <h2 style={{ margin: '0 0 8px', fontSize: 17 }}>Wrong-question review</h2>
      {wrong.length ? wrong.map((q) => <div key={q.id} style={{ padding: '8px 0', borderTop: '1px solid var(--border)' }}>
        <strong>{q.source} · Q{q.questionNumber}</strong><div style={{ fontSize: 13, marginTop: 3 }}>{q.question}</div>
      </div>) : <p style={{ margin: 0, opacity: .7 }}>No wrong answers recorded yet.</p>}
    </article>
  </div>;
}

const cardStyle: React.CSSProperties = { border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px', background: 'var(--bg-panel, transparent)' };
const eyebrow: React.CSSProperties = { margin: 0, fontSize: 10, textTransform: 'uppercase', letterSpacing: '.08em', opacity: .65 };
const labelStyle: React.CSSProperties = { display: 'flex', gap: 6, alignItems: 'center', fontSize: 12, fontWeight: 600 };
