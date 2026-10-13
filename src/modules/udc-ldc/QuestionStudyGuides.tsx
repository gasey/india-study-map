import { useState } from 'react';
import type { Primer } from '@/data/banks/all-primers';
import mizoramPyq from '@/data/banks/primers-mizoram-pyq.json';
import economyPyq from '@/data/banks/primers-economy-old-pyq.json';

const groups: Record<string, Primer[]> = {
  Mizoram: mizoramPyq as Primer[],
  Economics: economyPyq as Primer[],
};

export function QuestionStudyGuides() {
  const [subject, setSubject] = useState<keyof typeof groups>('Mizoram');
  const rows = groups[subject];
  return (
    <section aria-label="Mizo and Economics question guides" style={{ maxWidth: 980 }}>
      <div className="udc-hero" style={{ marginBottom: 16 }}>
        <h2 style={{ margin: '0 0 5px', fontSize: 20 }}>Mizo &amp; Economics study guides</h2>
        <p style={{ margin: 0, fontSize: 13.5 }}>
          Topic reviews built around older questions in this bank. Open a topic for the concept, common traps and question references.
        </p>
      </div>
      <div role="tablist" aria-label="Guide subject" style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {(Object.keys(groups) as Array<keyof typeof groups>).map((item) => (
          <button key={item} role="tab" aria-selected={subject === item} type="button"
            onClick={() => setSubject(item)} className={`udc-tab ${subject === item ? 'is-active' : ''}`}>
            {item} ({groups[item].length} topics)
          </button>
        ))}
      </div>
      <div role="tabpanel" className="space-y-3">
        {rows.map((guide) => (
          <details key={guide.subtopic} className="udc-question-card" style={{ border: '1px solid var(--border, #dcdce3)', borderRadius: 10, padding: '14px 16px', background: 'var(--bg-panel, transparent)' }}>
            <summary style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <strong>{guide.subtopic}</strong>
              <span style={{ flex: 'none', borderRadius: 999, padding: '2px 9px', fontSize: 11, fontWeight: 700, color: guide.priority === 'critical' ? '#fff' : 'var(--text-secondary)', background: guide.priority === 'critical' ? '#a33232' : 'var(--bg-panel-elev, #eee)' }}>{guide.priority}</span>
            </summary>
            <div style={{ marginTop: 12, lineHeight: 1.6, fontSize: 14 }} dangerouslySetInnerHTML={{ __html: guide.primer }} />
            {guide.analogy && <div style={{ marginTop: 10, padding: '10px 12px', borderLeft: '3px solid var(--info, #3b7dd8)', background: 'var(--bg-panel-elev, #f5f5f7)', borderRadius: 6 }}><strong>Memory aid · </strong>{guide.analogy}</div>}
            {guide.traps.length > 0 && <div style={{ marginTop: 10, padding: '10px 12px', borderLeft: '3px solid var(--warn, #b06f1a)', borderRadius: 6 }}>
              <strong>Common traps</strong><ul>{guide.traps.map((trap) => <li key={trap}>{trap}</li>)}</ul>
            </div>}
            {guide.formulae.length > 0 && <div style={{ display: 'grid', gap: 5, marginTop: 10 }}>
              {guide.formulae.map((item) => <code key={item} style={{ fontSize: 12, whiteSpace: 'normal' }}>{item}</code>)}
            </div>}
          </details>
        ))}
      </div>
    </section>
  );
}
