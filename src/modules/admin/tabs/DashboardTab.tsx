import { useEffect, useState } from 'react';
import * as api from '@/lib/mpscApi';

// Same data/rendering AdminPanel.tsx's DashboardTab already had — moved
// into the new console's shell rather than AdminPanel's internal tab bar.
export function DashboardTab() {
  const [stats, setStats] = useState<Awaited<ReturnType<typeof api.adminStats>> | null>(null);

  useEffect(() => {
    api.adminStats().then(setStats);
  }, []);

  if (!stats) return <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading…</p>;

  const pendingTotal = stats.byBankStatus.filter((b) => b.status === 'pending').reduce((n, b) => n + b.count, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-3">
        {[
          { value: pendingTotal, label: 'Pending reports' },
          { value: stats.totalCorrections, label: 'Corrections made' },
          { value: stats.totalComments, label: 'Comments posted' },
        ].map((s) => (
          <div key={s.label} className="rounded-lg px-4 py-3" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
            <div className="font-mono text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>{s.value}</div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Reports by bank &amp; status</h3>
        <div className="flex flex-wrap gap-2">
          {stats.byBankStatus.map((b) => (
            <span key={`${b.bankId}-${b.status}`} className="text-xs px-2 py-1 rounded-full" style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
              {b.bankId} · {b.status}: {b.count}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Reports by issue type</h3>
        <div className="flex flex-wrap gap-2">
          {stats.byIssueType.map((i) => (
            <span key={i.issueType} className="text-xs px-2 py-1 rounded-full" style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
              {i.issueType.replace(/_/g, ' ')}: {i.count}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Recent activity</h3>
        <div className="flex flex-col gap-1.5">
          {stats.recentActivity.map((a) => (
            <div key={a.id} className="text-xs p-2 rounded" style={{ background: 'var(--bg-panel-elev)' }}>
              <span className="font-medium">{a.actorUsername}</span> {a.action.replace(/_/g, ' ')} on{' '}
              <span style={{ color: 'var(--text-secondary)' }}>{a.bankId}/{a.questionId}{a.subpartLabel ? `#${a.subpartLabel}` : ''}</span>
              <span className="ml-2" style={{ color: 'var(--text-secondary)' }}>{new Date(a.createdAt).toLocaleString()}</span>
            </div>
          ))}
          {stats.recentActivity.length === 0 && <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>No activity yet.</p>}
        </div>
      </div>
    </div>
  );
}
