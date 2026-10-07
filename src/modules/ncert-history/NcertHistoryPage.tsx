import { useEffect, useMemo, useState } from 'react';
import { ModuleSwitcher } from '@/modules/ModuleSwitcher';
import './ncert-history.css';

type Chapter = { id: string; grade: number; book: string; chapter: string; editionGroup: string; sourceUrl: string };
type Question = { id: string; grade: number; chapterId: string; prompt: string; options: string[]; answerIndex: number; explanation: string; sourceUrl: string; sourcePdfPage: number; provenance: string };
type Attempt = { correct: boolean; at: number };
type Progress = Record<string, Attempt[]>;
type SessionItem = { question: Question; order: number[] };
const STORAGE_KEY = 'ncert-history-mcq-progress-v1';

function readProgress(): Progress {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    return value as Progress;
  } catch { return {}; }
}
function shuffled(items: Question[]): SessionItem[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
  return out.map((question) => {
    const order = [0, 1, 2, 3];
    for (let i = 3; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
    return { question, order };
  });
}
function optionLetter(i: number) { return String.fromCharCode(65 + i); }

function QuestionCard({ question, chapter, label, order, picked, onPick, children }: {
  question: Question;
  chapter?: Chapter;
  label: string;
  order: number[];
  picked: number | null;
  onPick: (option: number) => void;
  children?: React.ReactNode;
}) {
  const answered = picked !== null;
  const correctLetter = optionLetter(order.indexOf(question.answerIndex));
  return <article className="nh-card nh-question-card">
    <div className="nh-question-top"><span className="nh-question-number">{label}</span><span className="nh-question-topic">Class {question.grade} · {chapter?.chapter}</span></div>
    <p className="nh-question-source">{chapter?.book} · NCERT textbook practice</p>
    <h3 className="nh-question-stem">{question.prompt}</h3>
    <div className="nh-options" role="group" aria-label={`Answer choices for ${label}`}>
      {order.map((option, displayIndex) => {
        const isCorrect = answered && option === question.answerIndex;
        const isWrong = answered && option === picked && option !== question.answerIndex;
        return <button key={option} type="button" disabled={answered} aria-pressed={option === picked}
          className={`nh-option${isCorrect ? ' correct' : ''}${isWrong ? ' wrong' : ''}`}
          onClick={() => onPick(option)}>
          <span className="nh-option-letter">{optionLetter(displayIndex)}</span><span>{question.options[option]}</span>
        </button>;
      })}
    </div>
    {answered && <div className="nh-feedback" role="status">
      <strong className={picked === question.answerIndex ? 'nh-verdict-correct' : 'nh-verdict-wrong'}>
        {picked === question.answerIndex ? 'Correct' : `Not quite — the answer is (${correctLetter})`}
      </strong>
      <p>{question.explanation}</p>
      <a href={question.sourceUrl} target="_blank" rel="noopener noreferrer">Open NCERT PDF · page {question.sourcePdfPage} ↗</a>
      <p className="nh-provenance">Original practice MCQ based on NCERT; not an official question or answer key.</p>
      {children}
    </div>}
  </article>;
}

function BrowseQuestionCard({ question, chapter, index, onAnswer }: {
  question: Question; chapter?: Chapter; index: number; onAnswer: (id: string, correct: boolean) => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  return <QuestionCard question={question} chapter={chapter} label={`Question ${index + 1}`}
    order={[0, 1, 2, 3]} picked={picked} onPick={(option) => {
      if (picked !== null) return;
      setPicked(option);
      onAnswer(question.id, option === question.answerIndex);
    }} />;
}

export default function NcertHistoryPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [grade, setGrade] = useState('all');
  const [book, setBook] = useState('all');
  const [chapter, setChapter] = useState('all');
  const [search, setSearch] = useState('');
  const [mode, setMode] = useState<'browse' | 'practice'>('browse');
  const [progress, setProgress] = useState<Progress>(readProgress);
  const [session, setSession] = useState<SessionItem[] | null>(null);
  const [position, setPosition] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [results, setResults] = useState<Record<number, number | null>>({});
  const [sessionSize, setSessionSize] = useState(10);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      fetch('/ncert-history/chapters.json').then((r) => { if (!r.ok) throw Error('Chapter list could not load'); return r.json() as Promise<Chapter[]>; }),
      fetch('/ncert-history/questions.json').then((r) => { if (!r.ok) throw Error('Question bank could not load'); return r.json() as Promise<Question[]>; }),
    ]).then(([c, q]) => { if (active) { setChapters(c); setQuestions(q); setLoading(false); } })
      .catch((e: unknown) => { if (active) { setError(e instanceof Error ? e.message : 'Content could not load'); setLoading(false); } });
    return () => { active = false; };
  }, []);

  const availableBooks = useMemo(() => [...new Set(chapters.filter((c) => grade === 'all' || c.grade === Number(grade)).map((c) => c.book))], [chapters, grade]);
  const availableChapters = useMemo(() => chapters.filter((c) => (grade === 'all' || c.grade === Number(grade)) && (book === 'all' || c.book === book)), [chapters, grade, book]);
  const chapterById = useMemo(() => new Map(chapters.map((c) => [c.id, c])), [chapters]);
  const pool = useMemo(() => questions.filter((q) => {
    const c = chapterById.get(q.chapterId);
    if (!c || (grade !== 'all' && q.grade !== Number(grade)) || (book !== 'all' && c.book !== book) || (chapter !== 'all' && q.chapterId !== chapter)) return false;
    const term = search.trim().toLowerCase();
    return !term || [q.prompt, q.explanation, c.chapter, c.book].some((s) => s.toLowerCase().includes(term));
  }), [questions, chapterById, grade, book, chapter, search]);
  const current = session?.[position] ?? null;
  const done = session !== null && position >= session.length;
  const answered = Object.values(results).filter((r) => r !== null).length;
  const correct = session?.reduce((n, item, i) => n + (results[i] === item.question.answerIndex ? 1 : 0), 0) ?? 0;
  const attemptedIds = questions.filter((q) => progress[q.id]?.length).length;

  const recordProgress = (id: string, correct: boolean) => {
    const updated = { ...progress, [id]: [...(progress[id] ?? []), { correct, at: Date.now() }] };
    setProgress(updated);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch { /* private browsing can disable storage */ }
  };
  const recordAnswer = (selected: number) => {
    if (!current || choice !== null) return;
    const q = current.question;
    setChoice(selected);
    recordProgress(q.id, selected === q.answerIndex);
    setResults((r) => ({ ...r, [position]: selected }));
  };
  const next = (skip: boolean) => {
    if (skip && choice === null) setResults((r) => ({ ...r, [position]: null }));
    setPosition((n) => n + 1); setChoice(null);
    requestAnimationFrame(() => document.querySelector('.nh-quiz')?.scrollIntoView({ block: 'start', behavior: 'smooth' }));
  };
  const start = () => {
    if (!pool.length) return;
    setSession(shuffled(pool).slice(0, sessionSize || pool.length));
    setPosition(0); setChoice(null); setResults({}); setMode('practice');
  };

  if (loading) return <div className="ncert-history"><p>Loading NCERT History questions…</p></div>;
  if (error) return <div className="ncert-history"><h1>NCERT History</h1><p role="alert">{error}. Reload the page to try again.</p></div>;

  return <main className="ncert-history">
    <header className="nh-header">
      <div><p className="nh-eyebrow">NCERT · CLASSES 8–12</p><h1>History MCQ Practice</h1><p>New questions based on NCERT textbooks, with explanations and links to the source PDFs.</p></div>
      <ModuleSwitcher />
    </header>
    <div className="nh-stats"><div><strong>{questions.length}</strong><span>practice MCQs</span></div><div><strong>{chapters.length}</strong><span>chapter files</span></div><div><strong>{attemptedIds}</strong><span>attempted here</span></div></div>
    <p className="nh-note">This is a starter set of newly written practice MCQs, not the full set of NCERT exercises or an official answer key. Most textbook exercises are written-answer prompts and need careful conversion before becoming MCQs. Classes 8–9 include the current integrated Social Science books; Class 8 also includes the older standalone History book.</p>
    <nav className="nh-tabs" aria-label="NCERT History views"><button className={mode === 'browse' ? 'active' : ''} onClick={() => setMode('browse')}>Browse questions</button><button className={mode === 'practice' ? 'active' : ''} onClick={() => setMode('practice')}>Practice quiz</button></nav>
    {session && mode === 'practice' ? done ? <section className="nh-card nh-result">
      <p className="nh-eyebrow">SESSION COMPLETE</p><h2>{correct} correct of {answered} answered</h2><p>{(session.length - answered)} skipped · {session.length} in this session</p>
      <div className="nh-actions"><button onClick={() => setSession(null)}>Choose another quiz</button><button onClick={() => setMode('browse')}>Browse source questions</button></div>
      <div className="nh-review">{session.map(({ question: q }, i) => <details key={q.id}><summary>{results[i] === q.answerIndex ? '✓' : results[i] === null ? 'Skipped' : 'Review'} · {q.prompt}</summary><p>Your answer: {results[i] == null ? 'Skipped' : q.options[results[i]]}</p><p>Correct: <strong>{q.options[q.answerIndex]}</strong></p><p>{q.explanation}</p><a href={q.sourceUrl} target="_blank" rel="noopener noreferrer">Open NCERT PDF · page {q.sourcePdfPage} ↗</a></details>)}</div>
    </section> : current && <section className="nh-quiz">
      <div className="nh-quiz-top"><span className="nh-eyebrow">QUESTION {position + 1} OF {session.length}</span><button onClick={() => setPosition(session.length)}>Finish quiz</button></div>
      <progress value={position + 1} max={session.length} />
      <QuestionCard question={current.question} chapter={chapterById.get(current.question.chapterId)}
        label={`Question ${position + 1}`} order={current.order} picked={choice} onPick={recordAnswer}>
        <div className="nh-actions"><button onClick={() => next(false)}>{position + 1 === session.length ? 'See results' : 'Next question'}</button></div>
      </QuestionCard>
      {choice === null && <div className="nh-actions nh-skip"><button onClick={() => next(true)}>Skip question</button></div>}
    </section> : null}
    {!session || mode === 'browse' ? <>
      <section className="nh-card nh-filters"><label>Class<select value={grade} onChange={(e) => { setGrade(e.target.value); setBook('all'); setChapter('all'); }}><option value="all">All classes</option>{[8,9,10,11,12].map((n) => <option key={n} value={n}>Class {n}</option>)}</select></label><label>Book<select value={book} onChange={(e) => { setBook(e.target.value); setChapter('all'); }}><option value="all">All books</option>{availableBooks.map((b) => <option key={b} value={b}>{b}</option>)}</select></label><label>Chapter<select value={chapter} onChange={(e) => setChapter(e.target.value)}><option value="all">All chapters</option>{availableChapters.map((c) => <option key={c.id} value={c.id}>{c.chapter}{c.editionGroup === 'older standalone' ? ' (older)' : ''}</option>)}</select></label><label>Search<input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Question or topic" /></label></section>
      <div className="nh-list-heading"><h2>{pool.length} matching questions</h2>{mode === 'practice' && <div className="nh-actions"><label>Session<select value={sessionSize} onChange={(e) => setSessionSize(Number(e.target.value))}><option value={10}>10 questions</option><option value={20}>20 questions</option><option value={0}>All matching</option></select></label><button disabled={!pool.length} onClick={start}>Start quiz</button></div>}</div>
      {mode === 'browse' && <div className="nh-list">{pool.map((q, index) => <BrowseQuestionCard key={q.id} question={q} chapter={chapterById.get(q.chapterId)} index={index} onAnswer={recordProgress} />)}</div>}
      {mode === 'practice' && <p className="nh-note">Quiz and option order change each session. Tap an answer for immediate feedback. Attempts are saved in this browser; reloading ends the current quiz.</p>}
    </> : null}
    <footer className="nh-footer">The older standalone Class 9 History PDFs were unavailable on NCERT’s site when this set was prepared. The current Class 9 History chapters are included.</footer>
  </main>;
}
