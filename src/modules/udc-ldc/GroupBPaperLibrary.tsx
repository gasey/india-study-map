import { useMemo, useState } from 'react';
import archive from '@/data/banks/mpsc-group-b-library.json';
import type { BankQuestion } from '@/data/banks/types';
import { isMcqQuestion } from '@/data/banks/types';
import { isAnswerable } from './filters';
interface LibraryPaper {
  id: string; exam: string; sitting: string; subject: string; sourceHref: string;
  keyHref: string | null; correctionHref?: string; expectedMcq?: number; imported: boolean;
  sharedPosts?: string[];
}
const library: LibraryPaper[] = archive;

export function GroupBPaperLibrary({ questions, onBrowse }: { questions: BankQuestion[]; onBrowse: (id: string) => void }) {
  const [search, setSearch] = useState('');
  const progress = useMemo(() => {
    const ids = new Set(library.map((p) => p.id));
    const items = questions.filter((q) => q.paperId && ids.has(q.paperId));
    const mcq = items.filter(isMcqQuestion);
    const ready = mcq.filter(isAnswerable);
    return {
      mcq: mcq.length, written: items.length - mcq.length, ready: ready.length,
      official: ready.filter((q) => q.answerSource === 'official').length,
      review: items.filter((q) => q.sourceReview && !q.sourceReviewed).length,
      // MPSC-compensated items carry their own pill and are not "held" text.
      held: items.filter((q) => q.sourceReview && q.sourceReviewed && !q.compensated).length,
      missing: library.reduce((total, paper) => total + Math.max(0, (paper.expectedMcq ?? 0) - mcq.filter((q) => q.paperId === paper.id).length), 0),
    };
  }, [questions]);
  const groups = useMemo(() => {
    const filtered = library.filter((p) => `${p.exam} ${p.sitting} ${p.subject} ${(p.sharedPosts ?? []).join(' ')}`.toLowerCase().includes(search.toLowerCase()));
    const result = new Map<string, typeof library>();
    for (const p of filtered) {
      const key = `${p.exam} · ${p.sitting}`;
      result.set(key, [...(result.get(key) ?? []), p]);
    }
    return [...result.entries()].sort((a, b) => Number(b[1][0].sitting.slice(-4)) - Number(a[1][0].sitting.slice(-4)));
  }, [search]);
  return <section className="udc-paper-library">
    <h2>Group B general &amp; computer papers</h2>
    <p>{library.length} papers from the local archive, including computer knowledge papers. Shared papers are listed once for all participating posts.</p>
    <p className="udc-library-progress" role="status">
      {progress.mcq.toLocaleString()} MCQs · {progress.written.toLocaleString()} written prompts ·{' '}
      {progress.ready.toLocaleString()} ready to practise ({progress.official.toLocaleString()} with official answers) ·{' '}
      {progress.review.toLocaleString()} items need source review ·{' '}
      {progress.held.toLocaleString()} checked items held unscored
      {progress.missing > 0 && <> · {progress.missing.toLocaleString()} questions not recovered from source</>}
    </p>
    <label>Find an exam, subject or year<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="e.g. JAO, English, 2026" /></label>
    {groups.map(([title, papers]) => <article className="udc-library-sitting" key={title}>
      <h3>{title}</h3>
      {papers[0].sharedPosts && <p>Shared by: {papers[0].sharedPosts.join(' · ')}</p>}
      {papers.map((p) => {
        const qs = questions.filter((q) => q.paperId === p.id);
        const ready = qs.filter(isAnswerable).length;
        const official = qs.filter((q) => q.answerSource === 'official' && isAnswerable(q)).length;
        const candidates = qs.filter((q) => isMcqQuestion(q) && q.officialAnswerCandidates?.length && !isAnswerable(q)).length;
        const mcq = qs.filter(isMcqQuestion).length;
        const review = qs.filter((q) => q.sourceReview && !q.sourceReviewed).length;
        const held = qs.filter((q) => q.sourceReview && q.sourceReviewed && !q.compensated).length;
        const missing = Math.max(0, (p.expectedMcq ?? 0) - mcq);
        const correctionHref = p.correctionHref;
        return <div className="udc-library-paper" key={p.id}>
          <div><strong>{p.subject}</strong><p>{qs.length ? `${mcq}${p.expectedMcq ? `/${p.expectedMcq}` : ''} MCQs extracted · ${qs.length - mcq} written prompts · ${ready} ready to practise · ${official} official answers${candidates ? ` · ${candidates} unscored key candidates` : ''}${review ? ` · ${review} need source review` : ''}${held ? ` · ${held} checked, held unscored` : ''}${missing ? ` · ${missing} not recovered from source` : ''}` : 'Source PDF available · question transcription and solutions awaiting review'}</p></div>
          <div className="udc-library-links">
            {qs.length > 0 && <button type="button" onClick={() => onBrowse(p.id)}>Browse questions</button>}
            <a href={p.sourceHref} target="_blank" rel="noreferrer">Printed paper ↗</a>
            {p.keyHref && <a href={p.keyHref} target="_blank" rel="noreferrer">{official || candidates ? 'Final key' : 'Official key · not yet matched'} ↗</a>}
            {correctionHref && <a href={correctionHref} target="_blank" rel="noreferrer">Key correction ↗</a>}
          </div>
        </div>;
      })}
    </article>)}
  </section>;
}
