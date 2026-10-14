import { useMemo, useState, type ReactNode } from 'react';
import type { BankQuestion } from '@/data/banks/types';
import type { Confidence } from '@/lib/learning/types';
import { isMcqQuestion } from '@/data/banks/types';
import type { ProgressMap } from './useProgress';
import { isAnswerable, sectionOf } from './filters';
import { MATH_TOPICS, COMPUTER_TOPICS, ENGLISH_TOPICS, studyTopicOf, type StudyTopicId } from './studyTopics';
import { PracticeView, type PracticeAnswerMeta } from './PracticeView';

interface Props {
  subject: 'arithmetic' | 'english' | 'computer';
  questions: BankQuestion[];
  progress: ProgressMap;
  onAnswer: (id: string, correct: boolean, meta?: PracticeAnswerMeta) => void;
  onMistakeReason?: (eventId: string, reason: string) => void;
  onAttemptConfidence?: (eventId: string, confidence: Confidence) => void;
  renderBrowse: (questions: BankQuestion[]) => ReactNode;
}
const EMPTY_ATTEMPT_PROGRESS: ProgressMap = Object.create(null) as ProgressMap;

export function SubjectStudyView({ subject, questions, progress, onAnswer, onMistakeReason, onAttemptConfidence, renderBrowse }: Props) {
  const [topic, setTopic] = useState<StudyTopicId | 'all'>('all');
  const [mode, setMode] = useState<'practice' | 'read'>('practice');
  const [kind, setKind] = useState<'mcq' | 'written'>('mcq');
  const [attempt, setAttempt] = useState<'all' | 'never' | 'wrong'>('all');
  const [search, setSearch] = useState('');
  const maths = subject === 'arithmetic';
  const computer = subject === 'computer';
  const hasTopicGroups = maths || computer || subject === 'english';
  const topics = maths ? MATH_TOPICS : computer ? COMPUTER_TOPICS : ENGLISH_TOPICS;
  const title = maths ? 'Maths / Arithmetic' : computer ? 'Computer Knowledge' : 'English';
  // Scope first, independently of the general Browse/Practice filter rail.
  const scoped = useMemo(() => questions.filter(q => sectionOf(q) === subject), [questions, subject]);
  const topicCounts = useMemo(() => topics.map(([id, label]) => {
    const rows = scoped.filter(q => studyTopicOf(q, subject) === id);
    return { id, label, total: rows.length, ready: rows.filter(isAnswerable).length };
  }), [scoped, topics, subject]);
  const scopedReady = useMemo(() => scoped.filter(isAnswerable).length, [scoped]);
  const attemptProgress = attempt === 'all' ? EMPTY_ATTEMPT_PROGRESS : progress;
  const filtered = useMemo(() => scoped.filter(q => {
    if (hasTopicGroups && topic !== 'all' && studyTopicOf(q, subject) !== topic) return false;
    if (kind === 'mcq' ? !isMcqQuestion(q) : isMcqQuestion(q)) return false;
    if (attempt === 'never' && attemptProgress[q.id]) return false;
    if (attempt === 'wrong' && (!attemptProgress[q.id] || attemptProgress[q.id].lastCorrect)) return false;
    const needle = search.trim().toLowerCase();
    return !needle || (q.question + ' ' + (isMcqQuestion(q) ? q.options.join(' ') : '')).toLowerCase().includes(needle);
  }), [scoped, hasTopicGroups, subject, topic, kind, attempt, attemptProgress, search]);
  const ready = useMemo(() => filtered.filter(isAnswerable).length, [filtered]);

  return <section className={`udc-subject-study ${maths ? 'is-maths' : computer ? 'is-computer' : 'is-english'}`} aria-label={title}>
    <div className="udc-subject-heading">
      <div><p className="udc-subject-eyebrow">Focused study</p>
        <h2>{title}</h2>
        <p>{'Choose a topic, practise its questions, or read the original material.'}</p>
      </div>
      <div className="udc-subject-total"><strong>{scopedReady.toLocaleString()}</strong><span>ready to practise</span><small>{scoped.length.toLocaleString()} available to read</small></div>
    </div>
    {hasTopicGroups && <div className="udc-topic-grid" aria-label={`${title} topics`}>
      <button type="button" className={`udc-topic-card ${topic === 'all' ? 'is-selected' : ''}`} aria-pressed={topic === 'all'} onClick={() => setTopic('all')}>
        <strong>All {title}</strong><span>{scopedReady} ready · {scoped.length} to read</span>
      </button>
      {topicCounts.map(({ id, label, total, ready: count }) => <button key={id} type="button" className={`udc-topic-card ${topic === id ? 'is-selected' : ''}`} aria-pressed={topic === id} disabled={!total} onClick={() => setTopic(id)}>
        <strong>{label}</strong><span>{count} ready · {total} to read</span>
      </button>)}
    </div>}
    <div className="udc-subject-toolbar">
      {subject === 'english' && <div className="udc-subject-toggle" aria-label="English question type">
        <button type="button" aria-pressed={kind === 'mcq'} onClick={() => setKind('mcq')}>MCQs</button>
        <button type="button" aria-pressed={kind === 'written'} onClick={() => { setKind('written'); setMode('read'); setAttempt('all'); }}>Written English</button>
      </div>}
      <div className="udc-subject-toggle" aria-label="Study mode">
        <button type="button" aria-pressed={mode === 'practice'} disabled={kind === 'written'} onClick={() => setMode('practice')}>Practise</button>
        <button type="button" aria-pressed={mode === 'read'} onClick={() => setMode('read')}>Read questions</button>
      </div>
      {kind === 'mcq' && <label>Attempts <select value={attempt} onChange={e => setAttempt(e.target.value as typeof attempt)}><option value="all">All</option><option value="never">Not attempted</option><option value="wrong">Previously wrong</option></select></label>}
      <label className="udc-subject-search">Search <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder={topic !== 'all' ? 'Search within this topic' : `Search ${title} questions`} /></label>
    </div>
    <p className="udc-subject-status" aria-live="polite">{ready} ready to practise · {filtered.length} available to read{kind === 'mcq' && filtered.length > ready ? ` · ${filtered.length - ready} awaiting answer or source review` : ''}</p>
    {mode === 'practice' ? <PracticeView key={`${subject}-${topic}-${attempt}-${search}`} questions={filtered} progress={progress} onAnswer={onAnswer} onMistakeReason={onMistakeReason} onAttemptConfidence={onAttemptConfidence} /> : <div key={`${subject}-${topic}-${attempt}-${kind}-${search}`}>{renderBrowse(filtered)}</div>}
  </section>;
}
