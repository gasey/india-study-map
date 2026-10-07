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
  const [submitted, setSubmitted] = useState(false);
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

  const recordAnswer = () => {
    if (!current || choice === null || submitted) return;
    const q = current.question;
    const updated = { ...progress, [q.id]: [...(progress[q.id] ?? []), { correct: choice === q.answerIndex, at: Date.now() }] };
    setProgress(updated);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch { /* private browsing can disable storage */ }
    setResults((r) => ({ ...r, [position]: choice }));
    setSubmitted(true);
  };
  const next = (skip: boolean) => {
    if (skip && !submitted) setResults((r) => ({ ...r, [position]: null }));
    setPosition((n) => n + 1); setChoice(null); setSubmitted(false);
  };
  const start = () => {
    if (!pool.length) return;
    setSession(shuffled(pool).slice(0, sessionSize || pool.length));
    setPosition(0); setChoice(null); setSubmitted(false); setResults({}); setMode('practice');
  };

  if (loading) return <div className="ncert-history"><p>Loading NCERT History questions…</p></div>;
  if (error) return <div className="ncert-history"><h1>NCERT History</h1><p role="alert">{error}. Reload the page to try again.</p></div>;

  return <main className="ncert-history">
    <header className="nh-header">
      <div><p className="nh-eyebrow">NCERT · CLASSES 8–12</p><h1>History MCQ Practice</h1><p>New questions based on NCERT textbooks, with explanations and links to the source PDFs.</p></div>
      <ModuleSwitcher />
    </header>
    <div className="nh-stats"><div><strong>{questions.length}</strong><span>practice MCQs</span></div><div><strong>{chapters.length}</strong><span>chapter files</span></div><div><strong>{attemptedIds}</strong><span>attempted here</span></div></div>
    <p className="nh-note">These are newly written practice MCQs, not NCERT’s official exercise questions or answer keys. Classes 8–9 include the current integrated Social Science books; Class 8 also includes the older standalone History book.</p>
    <nav className="nh-tabs" aria-label="NCERT History views"><button className={mode === 'browse' ? 'active' : ''} onClick={() => setMode('browse')}>Browse questions</button><button className={mode === 'practice' ? 'active' : ''} onClick={() => setMode('practice')}>Practice quiz</button></nav>
    {session && mode === 'practice' ? done ? <section className="nh-card nh-result">
      <p className="nh-eyebrow">SESSION COMPLETE</p><h2>{correct} correct of {answered} answered</h2><p>{(session.length - answered)} skipped · {session.length} in this session</p>
      <div className="nh-actions"><button onClick={() => setSession(null)}>Choose another quiz</button><button onClick={() => setMode('browse')}>Browse source questions</button></div>
      <div className="nh-review">{session.map(({ question: q }, i) => <details key={q.id}><summary>{results[i] === q.answerIndex ? '✓' : results[i] === null ? 'Skipped' : 'Review'} · {q.prompt}</summary><p>Your answer: {results[i] == null ? 'Skipped' : q.options[results[i]]}</p><p>Correct: <strong>{q.options[q.answerIndex]}</strong></p><p>{q.explanation}</p><a href={q.sourceUrl} target="_blank" rel="noopener noreferrer">Open NCERT PDF · page {q.sourcePdfPage} ↗</a></details>)}</div>
    </section> : current && <section className="nh-card nh-quiz"><div className="nh-quiz-top"><span className="nh-eyebrow">QUESTION {position + 1} OF {session.length}</span><button onClick={() => setPosition(session.length)}>Finish quiz</button></div><progress value={position + 1} max={session.length} /><p className="nh-context">Class {current.question.grade} · {chapterById.get(current.question.chapterId)?.chapter}</p><h2>{current.question.prompt}</h2><div className="nh-options" role="group" aria-label="Answer choices">{current.order.map((option, displayIndex) => <button key={option} disabled={submitted} aria-pressed={choice === option} className={`${choice === option ? 'selected ' : ''}${submitted && option === current.question.answerIndex ? 'correct ' : ''}${submitted && choice === option && option !== current.question.answerIndex ? 'wrong' : ''}`} onClick={() => setChoice(option)}><b>{optionLetter(displayIndex)}</b><span>{current.question.options[option]}</span></button>)}</div>
      {submitted ? <div className="nh-feedback" role="status"><strong>{choice === current.question.answerIndex ? 'Correct' : 'Review this'}</strong><p>{current.question.explanation}</p><a href={current.question.sourceUrl} target="_blank" rel="noopener noreferrer">Open NCERT PDF · page {current.question.sourcePdfPage} ↗</a><div className="nh-actions"><button onClick={() => next(false)}>{position + 1 === session.length ? 'See results' : 'Next question'}</button></div></div> : <div className="nh-actions"><button disabled={choice === null} onClick={recordAnswer}>Check answer</button><button onClick={() => next(true)}>Skip</button></div>}
    </section> : null}
    {!session || mode === 'browse' ? <>
      <section className="nh-card nh-filters"><label>Class<select value={grade} onChange={(e) => { setGrade(e.target.value); setBook('all'); setChapter('all'); }}><option value="all">All classes</option>{[8,9,10,11,12].map((n) => <option key={n} value={n}>Class {n}</option>)}</select></label><label>Book<select value={book} onChange={(e) => { setBook(e.target.value); setChapter('all'); }}><option value="all">All books</option>{availableBooks.map((b) => <option key={b} value={b}>{b}</option>)}</select></label><label>Chapter<select value={chapter} onChange={(e) => setChapter(e.target.value)}><option value="all">All chapters</option>{availableChapters.map((c) => <option key={c.id} value={c.id}>{c.chapter}{c.editionGroup === 'older standalone' ? ' (older)' : ''}</option>)}</select></label><label>Search<input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Question or topic" /></label></section>
      <div className="nh-list-heading"><h2>{pool.length} matching questions</h2>{mode === 'practice' && <div className="nh-actions"><label>Session<select value={sessionSize} onChange={(e) => setSessionSize(Number(e.target.value))}><option value={10}>10 questions</option><option value={20}>20 questions</option><option value={0}>All matching</option></select></label><button disabled={!pool.length} onClick={start}>Start quiz</button></div>}</div>
      {mode === 'browse' && <div className="nh-list">{pool.map((q) => <details className="nh-card" key={q.id}><summary><span>Class {q.grade} · {chapterById.get(q.chapterId)?.chapter}</span><strong>{q.prompt}</strong></summary><ol type="A">{q.options.map((o) => <li key={o}>{o}</li>)}</ol><details className="nh-answer"><summary>Show answer and explanation</summary><p><strong>{q.options[q.answerIndex]}</strong> — {q.explanation}</p><a href={q.sourceUrl} target="_blank" rel="noopener noreferrer">Open NCERT PDF · page {q.sourcePdfPage} ↗</a></details></details>)}</div>}
      {mode === 'practice' && <p className="nh-note">Quiz order and option order change each session. Submitted answers are saved in this browser; reloading ends the current quiz.</p>}
    </> : null}
    <footer className="nh-footer">The older standalone Class 9 History PDFs were unavailable on NCERT’s site when this bank was prepared. The current Class 9 History chapters are included.</footer>
  </main>;
}
