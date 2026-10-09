import type { BankQuestion } from '@/data/banks/types';
import { isMcqQuestion } from '@/data/banks/types';
import { optionLetter } from './filters';

export function AnswerSources({ q }: { q: BankQuestion }) {
  if (!isMcqQuestion(q)) return null;
  const independent = q.independentAnswerIndex ?? (q.answerSource !== 'official' ? q.answerIndex : -1);
  const official = q.answerSource === 'official' ? q.answerIndex >= 0 ? q.answerIndex : q.officialAnswerCandidates?.length === 1 ? q.officialAnswerCandidates[0] : -1 : -1;
  const compared = independent >= 0 && official >= 0;
  return <div className="udc-answer-sources" aria-label="Answer comparison">
    <div><span>{q.independentAnswerSource === 'legacy-inferred' ? 'Legacy inferred candidate · unverified' : q.independentAnswerSource === 'transcribed' ? 'Study transcription' : 'Independent solution'}{q.answerConfidence && q.independentAnswerSource !== 'legacy-inferred' ? ` · ${q.answerConfidence} confidence` : ''}</span>
      <strong>{independent >= 0 ? optionLetter(independent).toUpperCase() : q.sourceReviewed ? 'Held unscored' : 'Awaiting review'}</strong></div>
    <div><span>MPSC final key{q.sourceReview ? q.sourceReviewed ? ' · held item' : ' · verify source text' : ''}</span><strong>{q.compensated ? 'Compensated · not scored' : q.officialAnswerCandidates?.length ? q.officialAnswerCandidates.map((i) => optionLetter(i).toUpperCase()).join(' / ') : official >= 0 ? optionLetter(official).toUpperCase() : 'No matched key'}</strong></div>
    {compared && <p className={independent === official ? 'udc-agrees' : 'udc-disagrees'}>
      {q.sourceReview ? `${independent === official ? 'Candidates agree' : 'Candidates differ'} · ${q.sourceReviewed ? 'held unscored' : 'source review required'}` : independent === official ? 'Answers agree' : 'Answers differ · scored using the MPSC key'}
    </p>}
    {q.answerKeyRef?.startsWith('/') && <a href={q.answerKeyRef} target="_blank" rel="noreferrer">Open final answer key ↗</a>}
  </div>;
}
