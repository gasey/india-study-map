import { useMemo, useState } from 'react';
import essayTopics from '@/data/banks/mpsc-essay-topics.json';
import type { BankQuestion } from '@/data/banks/types';
import { QuestionText } from './QuestionText';

type EssayTopic = {
  id: string;
  paperId: string;
  exam: string;
  year: number;
  subject: string;
  question: string;
  options?: string[];
  sourceHref?: string;
  sourceReviewed: boolean;
};

function isEssay(text: string): boolean {
  const plain = text.replace(/[\*_]/g, '').trim();
  return /\b(?:write|compose)\s+(?:an?\s+)?(?:short\s+)?essays?\b/i.test(plain.slice(0, 180));
}

function normalise(text: string): string {
  return text.toLowerCase().replace(/[\*_]/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

export function EssayTopicArchive({ questions, excludedPaperIds }: {
  questions: BankQuestion[];
  excludedPaperIds: Set<string>;
}) {
  const [search, setSearch] = useState('');
  const [year, setYear] = useState('all');
  const topics = useMemo(() => {
    const all: EssayTopic[] = [...essayTopics.filter((item) => !excludedPaperIds.has(item.paperId))];
    for (const q of questions) {
      if (!q.paperId || excludedPaperIds.has(q.paperId) || !isEssay(q.question)) continue;
      const paper = q.source ?? q.paperId;
      const match = paper.match(/(?:19|20)\d{2}/);
      all.push({
        id: q.id, paperId: q.paperId, exam: paper,
        year: q.year ?? (match ? Number(match[0]) : 0), subject: q.subject,
        question: q.question, ...(q.sourceHref ? { sourceHref: q.sourceHref } : {}),
        sourceReviewed: Boolean(q.sourceReviewed),
      });
    }
    const seen = new Set<string>();
    return all.filter((item) => {
      const identity = `${item.paperId}:${normalise(item.question)}`;
      if (seen.has(identity)) return false;
      seen.add(identity);
      return true;
    }).sort((a, b) => b.year - a.year || a.exam.localeCompare(b.exam));
  }, [questions, excludedPaperIds]);
  const years = useMemo(() => [...new Set(topics.map((item) => item.year).filter(Boolean))].sort((a, b) => b - a), [topics]);
  const visible = topics.filter((item) => (year === 'all' || String(item.year) === year)
    && `${item.exam} ${item.subject} ${item.question}`.toLowerCase().includes(search.toLowerCase()));

  return <section aria-labelledby="essay-archive-title">
    <div style={{ marginBottom: 18 }}>
      <h2 id="essay-archive-title" style={{ margin: '0 0 6px' }}>Previous essay topics</h2>
      <p style={{ margin: 0, color: 'var(--muted, #666)' }}>
        A searchable archive of essay prompts from previous papers. This section lists topics only; it does not include essays or writing instructions.
      </p>
    </div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
      <label style={{ flex: '1 1 250px' }}>Search topics
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search topic or exam" style={{ display: 'block', width: '100%', marginTop: 4 }} />
      </label>
      <label>Year
        <select value={year} onChange={(event) => setYear(event.target.value)} style={{ display: 'block', marginTop: 4 }}>
          <option value="all">All years</option>
          {years.map((value) => <option key={value} value={String(value)}>{value}</option>)}
        </select>
      </label>
    </div>
    <p role="status" aria-live="polite">{visible.length} essay {visible.length === 1 ? 'topic' : 'topics'}</p>
    <div style={{ display: 'grid', gap: 10 }}>
      {visible.map((item) => <article key={item.id} style={{ border: '1px solid var(--border, #ddd)', borderRadius: 10, padding: 14 }}>
        <p style={{ margin: '0 0 6px', fontSize: 12, color: 'var(--muted, #666)' }}>{item.exam} · {item.year || 'Year unconfirmed'} · {item.subject}</p>
        <p style={{ margin: '0 0 8px', whiteSpace: 'pre-wrap' }}><QuestionText text={item.question} /></p>
        {item.options?.length ? <ul style={{ margin: '0 0 8px', paddingLeft: 22 }}>{item.options.map((option, index) => <li key={index}>{option}</li>)}</ul> : null}
        {item.sourceHref ? <a href={item.sourceHref} target="_blank" rel="noreferrer">Open printed source ↗</a> : null}
        {!item.sourceReviewed && <span style={{ display: 'block', marginTop: 5, fontSize: 12, color: 'var(--muted, #666)' }}>Source wording awaits review.</span>}
      </article>)}
      {!visible.length && <p>No essay topics match this search.</p>}
    </div>
  </section>;
}
