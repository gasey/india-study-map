import { useEffect, useMemo, useState } from 'react';
import archive from '@/data/banks/mpsc-combined-prelims.json';
import { useAttemptState } from '@/modules/mpsc/useAttemptState';
import './combined-prelims.css';

type Paper = (typeof archive.papers)[number];
type Question = (typeof archive.questions)[number];
type Tab = 'overview' | 'browse' | 'practice' | 'mock';
type Progress = Record<string, { attempts: number; correct: boolean; at: number }>;
const PROGRESS_KEY = 'jabreeze.mcs-combined-prelims.progress.v1';
const LETTERS = 'ABCD';

function readProgress(): Progress {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}') as Progress; }
  catch { return {}; }
}

function useProgress() {
  const [progress, setProgress] = useState<Progress>(readProgress);
  const record = (id: string, correct: boolean) => setProgress((old) => {
    const next = { ...old, [id]: { attempts: (old[id]?.attempts || 0) + 1, correct, at: Date.now() } };
    try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(next)); } catch { /* storage disabled */ }
    return next;
  });
  return { progress, record };
}

function paperTitle(paper: Paper) {
  return `${paper.year} · Paper ${paper.paper} · Series ${paper.series}`;
}

function SourceLinks({ paper, page }: { paper: Paper; page?: number | null }) {
  return <span className="cp-source-links">
    <a href={`${paper.sourceHref}${page ? `#page=${page}` : ''}`} target="_blank" rel="noreferrer">Source PDF ↗</a>
    {paper.answerKeyHref && <a href={paper.answerKeyHref} target="_blank" rel="noreferrer">Final key ↗</a>}
  </span>;
}

function QuestionCard({ q, paper, mode, onRecord, progress }: {
  q: Question; paper: Paper; mode: 'browse' | 'practice'; onRecord?: (id: string, correct: boolean) => void;
  progress?: Progress;
}) {
  const [chosen, setChosen] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const answered = chosen !== null;
  const canCheck = q.scoreable && q.answerIndex >= 0;
  const check = () => {
    if (!answered || !canCheck || revealed) return;
    setRevealed(true);
    onRecord?.(q.id, chosen === q.answerIndex);
  };
  return <article className="cp-question" id={q.id}>
    <div className="cp-question-meta">
      <strong>Q{q.number}</strong><span>{paperTitle(paper)}</span>
      <SourceLinks paper={paper} page={q.page} />
    </div>
    {q.passage && <div className="cp-passage">{q.passage}</div>}
    <div className="cp-question-text">{q.text}</div>
    {q.hasDiagram && <div className="cp-callout">This item includes a diagram. Open the source PDF to see it.</div>}
    <div className="cp-options">
      {q.options.map((option, index) => <button
        key={index} type="button"
        className={`cp-option ${chosen === index ? 'is-chosen' : ''} ${revealed && q.answerIndex === index ? 'is-right' : ''} ${revealed && chosen === index && chosen !== q.answerIndex ? 'is-wrong' : ''}`}
        onClick={() => { if (!revealed) setChosen(index); }}
        disabled={revealed || !q.scoreable}
      ><span className="cp-option-letter">{LETTERS[index] || index + 1}</span><span>{option}</span></button>)}
    </div>
    <div className="cp-question-footer">
      {canCheck && mode === 'practice' && !revealed && <button type="button" className="cp-primary" disabled={!answered} onClick={check}>Check answer</button>}
      {q.answerSource && <span className="cp-badge is-key">Final MPSC key</span>}
      {!q.scoreable && <span className="cp-badge is-review">Read with source PDF</span>}
      {progress?.[q.id] && <span className="cp-muted">Practised {progress[q.id].attempts}× · last {progress[q.id].correct ? 'correct' : 'incorrect'}</span>}
      {mode === 'browse' && q.answerIndex >= 0 && <button type="button" className="cp-link-button" onClick={() => setRevealed((v) => !v)}>{revealed ? 'Hide key' : 'Show key'}</button>}
    </div>
    {revealed && q.answerIndex >= 0 && <div className="cp-answer">Final key: <strong>{LETTERS[q.answerIndex]}</strong>{mode === 'practice' && answered && ` · ${chosen === q.answerIndex ? 'Correct' : 'Incorrect'}`}</div>}
    {q.reviewReason && <p className="cp-review-reason">{q.reviewReason}</p>}
  </article>;
}

function Overview({ papers, questions, progress, openPaper }: {
  papers: Paper[]; questions: Question[]; progress: Progress; openPaper: (id: string) => void;
}) {
  const answered = questions.filter((q) => progress[q.id]).length;
  const scoreable = questions.filter((q) => q.scoreable).length;
  return <>
    <div className="cp-stats">
      <div><strong>{papers.length}</strong><span>available papers</span></div>
      <div><strong>{questions.length}</strong><span>questions extracted</span></div>
      <div><strong>{scoreable}</strong><span>ready for scored practice</span></div>
      <div><strong>{answered}</strong><span>you have practised</span></div>
    </div>
    <div className="cp-callout">The 2023 final keys are linked below. Paper II needs passage and layout verification, so it is available to read with its PDF but excluded from scored practice. The 2025 final key has not been parsed into this bank. No inferred answers are used.</div>
    <div className="cp-paper-grid">
      {papers.map((paper) => <article className="cp-paper" key={paper.id}>
        <div className="cp-paper-top"><span className="cp-year">{paper.year}</span><span className="cp-badge">Paper {paper.paper} · Series {paper.series}</span></div>
        <h2>{paperTitle(paper)}</h2>
        <div className="cp-coverage"><div style={{ width: `${paper.parsedCount}%` }} /></div>
        <p><strong>{paper.parsedCount}/100</strong> extracted · <strong>{paper.scoreableCount}</strong> ready to score</p>
        {paper.missingNumbers.length > 0 && <p className="cp-review-reason">Missing question numbers: {paper.missingNumbers.join(', ')}</p>}
        <div className="cp-paper-actions"><button type="button" onClick={() => openPaper(paper.id)}>Browse questions</button><SourceLinks paper={paper} /></div>
      </article>)}
    </div>
  </>;
}

function Mock({ papers, questions }: { papers: Paper[]; questions: Question[] }) {
  const ready = papers.filter((p) => p.parsedCount === p.expectedCount && p.scoreableCount > 0);
  const [selected, setSelected] = useState(ready[0]?.id || '');
  const [restart, setRestart] = useState(0);
  return <div>
    <div className="cp-callout">Choose a complete extracted paper. The practice timer is 120 minutes; no penalty is calculated because the marking rule is not verified here. Questions missing from the final key are shown but excluded from the score.</div>
    <div className="cp-mock-picker">
      <label htmlFor="cp-mock-paper">Paper</label>
      <select id="cp-mock-paper" value={selected} onChange={(e) => setSelected(e.target.value)}>
        {ready.map((p) => <option key={p.id} value={p.id}>{paperTitle(p)} · {p.scoreableCount} scored</option>)}
      </select>
    </div>
    {selected && <MockSitting key={`${selected}:${restart}`} paper={papers.find((p) => p.id === selected)!} questions={questions.filter((q) => q.paperId === selected)} onRestart={() => setRestart((n) => n + 1)} />}
  </div>;
}

function MockSitting({ paper, questions, onRestart }: { paper: Paper; questions: Question[]; onRestart: () => void }) {
  const [now, setNow] = useState(Date.now());
  const [submitted, setSubmitted] = useState(false);
  const signature = `${paper.id}:${questions.length}:${questions.map((q) => q.id).join(',')}`;
  const { state, patch, resumed, clear } = useAttemptState(`mcs-combined.${paper.id}`, signature);
  useEffect(() => {
    if (submitted) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [submitted]);
  const left = Math.max(0, 120 * 60 - Math.floor((now - state.startedAt) / 1000));
  useEffect(() => { if (!submitted && left === 0) { setSubmitted(true); clear(); } }, [submitted, left, clear]);
  const scored = questions.filter((q) => q.scoreable);
  const right = scored.filter((q) => state.answers[q.id] === q.answerIndex).length;
  const wrong = scored.filter((q) => state.answers[q.id] !== undefined && state.answers[q.id] !== q.answerIndex).length;
  const skipped = scored.length - right - wrong;
  const finish = () => { setSubmitted(true); clear(); };
  const reset = () => { clear(); onRestart(); };
  return <div className="cp-mock">
    <div className="cp-mock-bar"><div><strong>{paperTitle(paper)}</strong>{resumed && !submitted && <span className="cp-muted"> · resumed; timer kept running</span>}</div><div className="cp-mock-controls"><span>{Math.floor(left / 3600)}:{String(Math.floor((left % 3600) / 60)).padStart(2, '0')}:{String(left % 60).padStart(2, '0')}</span>{!submitted ? <button type="button" className="cp-primary" onClick={finish}>Submit</button> : <button type="button" onClick={reset}>Start again</button>}</div></div>
    {submitted && <div className="cp-result"><strong>{right}/{scored.length} correct</strong><span>{wrong} wrong · {skipped} skipped · {questions.length - scored.length} unscored</span><p>Raw score only. Review the final key and source PDF for disputed or unscored items.</p></div>}
    <div className="cp-question-nav">{questions.map((q, i) => <a key={q.id} className={`${state.answers[q.id] !== undefined ? 'is-answered' : ''} ${state.idx === i ? 'is-current' : ''}`} href="#cp-mock-question" onClick={() => patch({ idx: i })}>{q.number}</a>)}</div>
    {questions[state.idx] && <div id="cp-mock-question" className="cp-question">
      <div className="cp-question-meta"><strong>Q{questions[state.idx].number} of {questions.length}</strong><SourceLinks paper={paper} page={questions[state.idx].page} /></div>
      <div className="cp-question-text">{questions[state.idx].text}</div>
      <div className="cp-options">{questions[state.idx].options.map((option, i) => <button key={i} type="button" disabled={submitted || !questions[state.idx].scoreable} className={`cp-option ${state.answers[questions[state.idx].id] === i ? 'is-chosen' : ''} ${submitted && questions[state.idx].answerIndex === i ? 'is-right' : ''}`} onClick={() => patch((s) => ({ answers: { ...s.answers, [questions[state.idx].id]: i } }))}><span className="cp-option-letter">{LETTERS[i]}</span>{option}</button>)}</div>
      {!questions[state.idx].scoreable && <p className="cp-review-reason">{questions[state.idx].reviewReason}</p>}
      <div className="cp-mock-next"><button type="button" disabled={state.idx === 0} onClick={() => patch({ idx: state.idx - 1 })}>← Previous</button><button type="button" disabled={state.idx >= questions.length - 1} onClick={() => patch({ idx: state.idx + 1 })}>Next →</button></div>
    </div>}
  </div>;
}

export default function CombinedPrelimsPage() {
  const papers = archive.papers;
  const questions = archive.questions;
  const byId = useMemo(() => new Map(papers.map((p) => [p.id, p])), [papers]);
  const [tab, setTab] = useState<Tab>('overview');
  const [paperId, setPaperId] = useState('');
  const [year, setYear] = useState('all');
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const { progress, record } = useProgress();
  const filtered = useMemo(() => questions.filter((q) => {
    const paper = byId.get(q.paperId)!;
    if (paperId && q.paperId !== paperId) return false;
    if (year !== 'all' && paper.year !== Number(year)) return false;
    if (status === 'ready' && !q.scoreable) return false;
    if (status === 'review' && q.scoreable) return false;
    if (status === 'unseen' && progress[q.id]) return false;
    if (status === 'wrong' && (!progress[q.id] || progress[q.id].correct)) return false;
    return !search || `${q.text} ${q.options.join(' ')}`.toLowerCase().includes(search.toLowerCase());
  }), [questions, byId, paperId, year, status, search, progress]);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const openPaper = (id: string) => { setPaperId(id); setPage(0); setTab('browse'); };
  const changeFilter = (setter: (value: string) => void, value: string) => { setter(value); setPage(0); setPracticeIndex(0); };
  const active = filtered[Math.min(practiceIndex, filtered.length - 1)];
  return <div className="scroll-panel h-full overflow-y-auto cp-page"><div className="cp-content">
    <header className="cp-hero"><div className="cp-eyebrow">MIZORAM CIVIL SERVICES · PRELIMINARY EXAMINATION</div><h1>MPSC Combined Prelims</h1><p>Past papers, final-key answers where verified, and a clear view of what still needs review.</p></header>
    <nav className="cp-tabs" aria-label="Combined Prelims sections">{(['overview', 'browse', 'practice', 'mock'] as Tab[]).map((item) => <button key={item} type="button" className={tab === item ? 'is-active' : ''} onClick={() => setTab(item)}>{item === 'mock' ? 'Timed paper' : item}</button>)}</nav>
    {tab === 'overview' && <Overview papers={papers} questions={questions} progress={progress} openPaper={openPaper} />}
    {(tab === 'browse' || tab === 'practice') && <>
      <div className="cp-filters"><label>Year<select value={year} onChange={(e) => { setPaperId(''); changeFilter(setYear, e.target.value); }}><option value="all">All years</option><option value="2025">2025</option><option value="2023">2023</option></select></label><label>Paper<select value={paperId} onChange={(e) => changeFilter(setPaperId, e.target.value)}><option value="">All papers</option>{papers.filter((p) => year === 'all' || p.year === Number(year)).map((p) => <option key={p.id} value={p.id}>{paperTitle(p)}</option>)}</select></label><label>Status<select value={status} onChange={(e) => changeFilter(setStatus, e.target.value)}><option value="all">All questions</option><option value="ready">Ready to score</option><option value="review">Needs source review</option><option value="unseen">Not practised</option><option value="wrong">Last answered wrong</option></select></label><label className="cp-search">Search<input value={search} onChange={(e) => changeFilter(setSearch, e.target.value)} placeholder="Question or option text" /></label></div>
      <div className="cp-results-line"><strong>{filtered.length}</strong> questions match{tab === 'practice' && <span> · choose “Ready to score” for answerable practice</span>}</div>
      {tab === 'browse' && <><div className="cp-list">{filtered.slice(page * 20, page * 20 + 20).map((q) => <QuestionCard key={q.id} q={q} paper={byId.get(q.paperId)!} mode="browse" progress={progress} />)}</div><div className="cp-pagination"><button type="button" disabled={page === 0} onClick={() => setPage(page - 1)}>← Previous</button><span>Page {page + 1} of {Math.max(1, Math.ceil(filtered.length / 20))}</span><button type="button" disabled={(page + 1) * 20 >= filtered.length} onClick={() => setPage(page + 1)}>Next →</button></div></>}
      {tab === 'practice' && <div className="cp-practice">{active ? <><div className="cp-practice-bar"><span>Question {Math.min(practiceIndex + 1, filtered.length)} of {filtered.length}</span><div><button type="button" disabled={practiceIndex === 0} onClick={() => setPracticeIndex(practiceIndex - 1)}>←</button><button type="button" disabled={practiceIndex >= filtered.length - 1} onClick={() => setPracticeIndex(practiceIndex + 1)}>Next →</button></div></div><QuestionCard key={active.id} q={active} paper={byId.get(active.paperId)!} mode="practice" progress={progress} onRecord={record} /></> : <div className="cp-empty">No questions match these filters.</div>}</div>}
    </>}
    {tab === 'mock' && <Mock papers={papers} questions={questions} />}
  </div></div>;
}
