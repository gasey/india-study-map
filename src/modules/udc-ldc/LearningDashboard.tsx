import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import type { LearningArea, LearningDashboardModel, LearningMistake, StorageStatus } from '@/lib/learning/types';
import './learning-dashboard.css';

export interface LearningDashboardProps {
  model: LearningDashboardModel;
  onStart: (questionIds: string[], label: string) => void;
  onRead: (questionIds: string[], label: string) => void;
  storageStatus: StorageStatus;
  onExport: () => void;
  onImport: (file: File) => Promise<{ added: number }>;
}

type AreaFilter = 'all' | LearningArea['status'];
type AreaSort = 'weakest' | 'most-studied' | 'largest' | 'name';

const formatPct = (value: number | null) => value == null ? '—' : `${Math.round(value)}%`;
const formatDate = (value?: number) => value ? new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Date unavailable';
const formatInterval = (ms: number) => {
  const minutes = Math.max(1, Math.round(ms / 60_000));
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.round(hours / 24)}d`;
};
const areaStatusLabel: Record<LearningArea['status'], string> = {
  unseen: 'Not answered yet', building: 'Building evidence', weak: 'Needs review', developing: 'Developing', strong: 'Secure',
};
const trendLabel: Record<LearningArea['trend'], string> = {
  improving: 'Improving', declining: 'Needs attention', steady: 'Steady', unknown: 'Not enough history',
};

function StatusPill({ area }: { area: LearningArea }) {
  return <span className={`learning-status is-${area.status}`}>{areaStatusLabel[area.status]}</span>;
}

function AreaRow({ area, onStart, onRead, sessionSize }: { area: LearningArea; onStart: LearningDashboardProps['onStart']; onRead: LearningDashboardProps['onRead']; sessionSize: number }) {
  const coverage = area.total ? Math.min(100, Math.round((area.studied / area.total) * 100)) : 0;
  return (
    <div className="learning-area-row">
      <div className="learning-area-main">
        <div className="learning-area-title"><strong>{area.label}</strong><StatusPill area={area} /></div>
        <div className="learning-area-meta">
          <span>{area.studied} of {area.total} marked studied · {area.attempted} of {area.scorable} answered</span>
          <span>{area.status === 'building' ? 'Early signal' : `${area.evidence} questions with evidence`}</span>
          <span className={`learning-trend is-${area.trend}`}>{trendLabel[area.trend]}</span>
        </div>
        <div className="learning-meter" role="img" aria-label={`${coverage}% of questions marked studied`}><span style={{ width: `${coverage}%` }} /></div>
      </div>
      <div className="learning-area-numbers">
        <span><b>{formatPct(area.accuracy)}</b><small>accuracy</small></span>
        <span><b>{area.due}</b><small>due</small></span>
        <span><b>{area.repeatMistakes}</b><small>repeat errors</small></span>
      </div>
      <div className="learning-area-actions">
        <button className="learning-link-button" type="button" disabled={!area.readQuestionIds.length} onClick={() => onRead(area.readQuestionIds.slice(0, 20), `Read ${area.label}`)}>Read</button>
        <button className="learning-link-button" type="button" disabled={!area.questionIds.length} onClick={() => onStart(area.questionIds.slice(0, sessionSize), `Review ${area.label}`)}>Review <span aria-hidden="true">→</span></button>
      </div>
    </div>
  );
}

function MistakeRow({ mistake, onRead, onStart }: {
  mistake: LearningMistake;
  onRead: LearningDashboardProps['onRead'];
  onStart: LearningDashboardProps['onStart'];
}) {
  const label = mistake.question.trim() || `Question ${mistake.questionId}`;
  return (
    <article className="learning-mistake-row">
      <div className="learning-mistake-copy">
        <div className="learning-mistake-tags"><span>{mistake.subjectLabel}</span><span>{mistake.topicLabel}</span></div>
        <p title={label}>{label}</p>
        <small>{mistake.wrongCount > 0 ? `${mistake.wrongCount} ${mistake.wrongCount === 1 ? 'wrong answer' : 'wrong answers'}` : 'Previously wrong · older count unavailable'} · last seen {formatDate(mistake.lastAttemptAt)}{mistake.mistakeReason ? ` · ${mistake.mistakeReason}` : ''}</small>
      </div>
      <div className="learning-mistake-actions">
        <button type="button" className="learning-secondary-button" onClick={() => onRead([mistake.questionId], 'Read a missed question')}>Read</button>
        <button type="button" className="learning-primary-button" onClick={() => onStart([mistake.questionId], 'Retry a missed question')}>Retry</button>
      </div>
    </article>
  );
}

export function LearningDashboard({ model, onStart, onRead, storageStatus, onExport, onImport }: LearningDashboardProps) {
  const [search, setSearch] = useState('');
  const [areaFilter, setAreaFilter] = useState<AreaFilter>('all');
  const [sort, setSort] = useState<AreaSort>('weakest');
  const [showTopics, setShowTopics] = useState(false);
  const [areaLimit, setAreaLimit] = useState(40);
  const [mistakeLimit, setMistakeLimit] = useState(5);
  const [importMessage, setImportMessage] = useState('');
  const [importError, setImportError] = useState('');
  const [importing, setImporting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const visibleAreas = useMemo(() => {
    const source = showTopics ? model.topics : model.subjects;
    const query = search.trim().toLocaleLowerCase();
    const filtered = source.filter((area) => {
      const matchesText = !query || `${area.label} ${area.subjectLabel}`.toLocaleLowerCase().includes(query);
      return matchesText && (areaFilter === 'all' || area.status === areaFilter);
    });
    return filtered.sort((a, b) => {
      if (sort === 'name') return a.label.localeCompare(b.label);
      if (sort === 'most-studied') return b.studied - a.studied || a.label.localeCompare(b.label);
      if (sort === 'largest') return b.total - a.total || a.label.localeCompare(b.label);
      const score = (area: LearningArea) => area.status === 'weak' ? 0 : area.status === 'building' ? 1 : area.status === 'developing' ? 2 : area.status === 'unseen' ? 3 : 4;
      return score(a) - score(b) || (a.accuracy ?? 101) - (b.accuracy ?? 101) || b.repeatMistakes - a.repeatMistakes || a.label.localeCompare(b.label);
    });
  }, [areaFilter, model.subjects, model.topics, search, showTopics, sort]);
  useEffect(() => setAreaLimit(40), [areaFilter, search, showTopics, sort]);
  const displayedAreas = visibleAreas.slice(0, areaLimit);

  const recommendation = model.recommendations[0];
  const sessionSize = Math.max(1, Math.min(20, Math.round(model.policy.sessionSize)));
  const todayIds = recommendation?.questionIds.slice(0, sessionSize) ?? model.queues.due.slice(0, sessionSize);
  const todayLabel = recommendation?.title ?? 'Short review';
  const reviewCadence = model.policy.successIntervalsMs.map(formatInterval).join(', ');
  const mostRecentMistakeAt = model.mistakes.reduce((latest, mistake) => Math.max(latest, mistake.lastAttemptAt), 0);
  const storageLabels: Record<StorageStatus['kind'], string> = {
    ready: 'Saved in this browser', memory: 'Temporary session storage', recovered: 'Recovered local progress', error: 'Storage needs attention',
  };
  const statusLabel = storageLabels[storageStatus.kind];

  const importFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (!file) return;
    setImporting(true);
    setImportMessage('');
    setImportError('');
    try {
      const result = await onImport(file);
      setImportMessage(`Backup imported. ${result.added} new ${result.added === 1 ? 'record' : 'records'} added.`);
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'This backup could not be imported.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <section className="learning-dashboard" aria-labelledby="learning-title">
      <header className="learning-header">
        <div>
          <p className="learning-eyebrow">UDC · LDC · Group B</p>
          <h2 id="learning-title">My Learning</h2>
          <p className="learning-intro">A clear view of what you have explored, what needs another look, and where your confidence is growing.</p>
        </div>
        <div className={`learning-storage is-${storageStatus.kind}`} role="status">
          <span className="learning-storage-dot" aria-hidden="true" />
          <span><strong>{statusLabel}</strong><small>{storageStatus.message || 'Your study history stays on this device.'}</small></span>
        </div>
      </header>

      <section className="learning-summary-grid" aria-label="Learning overview">
        <div className="learning-summary-card learning-summary-primary"><span>Marked studied</span><strong>{model.summary.studied.toLocaleString()}<small> / {model.summary.readableTotal.toLocaleString()}</small></strong><div className="learning-summary-foot">Read and marked studied · {model.summary.scorableStudied} answerable MCQs · {model.summary.attempted} attempted</div></div>
        <div className="learning-summary-card"><span>Answered correctly</span><strong>{formatPct(model.summary.accuracy)}</strong><div className="learning-summary-foot">{model.summary.knownAttempts} recorded answers</div></div>
        <div className="learning-summary-card"><span>Ready to review</span><strong>{model.summary.due.toLocaleString()}</strong><div className="learning-summary-foot">Short sessions keep review manageable</div></div>
        <div className="learning-summary-card"><span>Repeat mistakes</span><strong>{model.summary.repeatMistakes.toLocaleString()}</strong><div className="learning-summary-foot">Questions answered incorrectly more than once</div></div>
      </section>

      <section className="learning-today" aria-labelledby="learning-today-title">
        <div className="learning-today-mark" aria-hidden="true">↻</div>
        <div className="learning-today-copy">
          <p className="learning-eyebrow">A useful next step</p>
          <h3 id="learning-today-title">{recommendation?.title ?? 'Keep the learning loop short'}</h3>
          <p>{recommendation?.description ?? (todayIds.length ? 'Start with a small set, then build from what you learn.' : 'Your review queue is clear. Explore a subject or topic to build a useful history.')}</p>
          <small>Current short cadence: missed answers return after about {formatInterval(model.policy.wrongDelayMs)}{reviewCadence ? `; successful reviews spread out to ${reviewCadence}` : ''}.</small>
        </div>
        <button className="learning-primary-button learning-today-button" type="button" disabled={!todayIds.length} onClick={() => onStart(todayIds, todayLabel)}>
          {todayIds.length ? `Start ${todayIds.length} questions` : 'Nothing due right now'} <span aria-hidden="true">→</span>
        </button>
      </section>

      <div className="learning-dashboard-columns">
        <section className="learning-panel learning-areas-panel" aria-labelledby="learning-areas-title">
          <div className="learning-panel-heading">
            <div><p className="learning-eyebrow">Find your next focus</p><h3 id="learning-areas-title">Subjects &amp; topics</h3><p>Reading does not count as an attempt. Areas with too little answer evidence stay unclassified.</p></div>
            <div className="learning-view-switch" role="group" aria-label="Breakdown level">
              <button type="button" aria-pressed={!showTopics} onClick={() => setShowTopics(false)}>Subjects</button>
              <button type="button" aria-pressed={showTopics} onClick={() => setShowTopics(true)}>Topics</button>
            </div>
          </div>
          <div className="learning-area-controls">
            <label className="learning-search"><span className="sr-only">Search {showTopics ? 'topics' : 'subjects'}</span><span aria-hidden="true">⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search ${showTopics ? 'topics' : 'subjects'}`} /></label>
            <label><span className="sr-only">Filter by status</span><select value={areaFilter} onChange={(e) => setAreaFilter(e.target.value as AreaFilter)}><option value="all">All areas</option><option value="weak">Needs review</option><option value="building">Building evidence</option><option value="developing">Developing</option><option value="strong">Secure</option><option value="unseen">Not answered yet</option></select></label>
            <label><span className="sr-only">Sort areas</span><select value={sort} onChange={(e) => setSort(e.target.value as AreaSort)}><option value="weakest">Suggested order</option><option value="most-studied">Most studied</option><option value="largest">Largest bank</option><option value="name">Name</option></select></label>
          </div>
          <div className="learning-area-list" aria-live="polite">
            {displayedAreas.length ? displayedAreas.map((area) => <AreaRow key={area.id} area={area} onStart={onStart} onRead={onRead} sessionSize={sessionSize} />) : <div className="learning-empty">No matching areas. Try another search or status.</div>}
          </div>
          {visibleAreas.length > areaLimit && <button type="button" className="learning-link-button learning-show-more" onClick={() => setAreaLimit((n) => n + 40)}>Show {Math.min(40, visibleAreas.length - areaLimit)} more of {visibleAreas.length} areas</button>}
          <p className="learning-panel-note">Accuracy appears only when there is recorded answer evidence. “Building evidence” means there is not enough activity to call an area weak.</p>
        </section>

        <div className="learning-side-column">
          <section className="learning-panel learning-queue-panel" aria-labelledby="learning-queue-title">
            <div className="learning-panel-heading compact"><div><p className="learning-eyebrow">Practice queues</p><h3 id="learning-queue-title">Choose a session</h3></div></div>
            <div className="learning-queue-list">
              {([
                ['Due reviews', model.queues.due, 'Questions ready for another pass'],
                ['Mistakes', model.queues.mistakes, 'Previously missed questions'],
                ['Weak areas', model.queues.weak, 'Areas with enough evidence to flag'],
                ['Not answered yet', model.queues.new, 'Questions without a recorded answer'],
                ['Mixed practice', model.queues.mixed, 'A little of everything'],
              ] as const).map(([label, ids, detail]) => <button className="learning-queue-row" key={label} type="button" disabled={!ids.length} onClick={() => onStart(ids.slice(0, sessionSize), label)}><span><strong>{label}</strong><small>{detail}</small></span><b>{ids.length.toLocaleString()}</b><span className="learning-queue-arrow" aria-hidden="true">→</span></button>)}
            </div>
            <p className="learning-panel-note">Short sessions start with up to {sessionSize} questions. You can continue with more afterward.</p>
          </section>

          <section className="learning-panel learning-activity-panel" aria-labelledby="learning-activity-title">
            <div className="learning-panel-heading compact"><div><p className="learning-eyebrow">Recent signals</p><h3 id="learning-activity-title">Your learning pattern</h3></div></div>
            <div className="learning-pattern-stats"><div><strong>{model.summary.attempts.toLocaleString()}</strong><span>recorded attempts</span></div><div><strong>{model.summary.secure.toLocaleString()}</strong><span>secure questions</span></div><div><strong>{model.summary.unseen.toLocaleString()}</strong><span>not answered yet</span></div></div>
            {model.mistakes.length ? <div className="learning-recent-line"><span className="learning-recent-dot" /><span>Most recent mistake activity</span><b>{formatDate(mostRecentMistakeAt)}</b></div> : <p className="learning-quiet-note">As you answer questions, changes in accuracy and confidence will appear here.</p>}
            <div className="learning-trend-key"><span className="is-improving">↗ improving</span><span className="is-declining">↘ attention</span><span>— too little history</span></div>
          </section>
        </div>
      </div>

      <section className="learning-panel learning-mistakes-panel" aria-labelledby="learning-mistakes-title">
        <div className="learning-panel-heading">
          <div><p className="learning-eyebrow">Turn errors into practice</p><h3 id="learning-mistakes-title">Questions to revisit <span className="learning-count-badge">{model.mistakes.length}</span></h3><p>Read the explanation or try the question again when you are ready.</p></div>
          {model.mistakes.length > mistakeLimit && <button className="learning-link-button" type="button" onClick={() => setMistakeLimit((limit) => Math.min(limit === 5 ? 40 : limit + 40, model.mistakes.length))}>Show {Math.min(mistakeLimit === 5 ? 35 : 40, model.mistakes.length - mistakeLimit)} more</button>}
          {mistakeLimit > 5 && <button className="learning-link-button" type="button" onClick={() => setMistakeLimit(5)}>Show fewer</button>}
        </div>
        {model.mistakes.length ? <div className="learning-mistake-list">{model.mistakes.slice(0, mistakeLimit).map((mistake) => <MistakeRow key={mistake.questionId} mistake={mistake} onRead={onRead} onStart={onStart} />)}</div> : <div className="learning-empty">No recorded mistakes yet. Your history will build as you practise.</div>}
      </section>

      <section className="learning-backup-panel" aria-label="Backup learning history">
        <div><strong>Keep a backup of your learning history</strong><p>This history stays in this browser. Browser data can be cleared with site data, so export a copy if you want to keep it.</p>{storageStatus.message && <small>{storageStatus.message}</small>}{importMessage && <small className="learning-feedback-success" role="status">{importMessage}</small>}{importError && <small className="learning-feedback-error" role="alert">{importError}</small>}</div>
        <div className="learning-backup-actions"><button type="button" className="learning-secondary-button" onClick={onExport}>Export backup</button><button type="button" className="learning-secondary-button" disabled={importing} onClick={() => inputRef.current?.click()}>{importing ? 'Importing…' : 'Import backup'}</button><input ref={inputRef} type="file" accept="application/json,.json" hidden onChange={importFile} /></div>
      </section>
    </section>
  );
}

export default LearningDashboard;
