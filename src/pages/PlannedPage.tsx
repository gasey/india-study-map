import { Link } from 'react-router-dom';

/** Generic "not designed yet" screen — extends the handoff's own tab-level
 *  convention ("55% opacity, disabled, tooltip 'Planned — not designed
 *  yet'") up to route level, rather than inventing fake content. */
export function PlannedPage({ title }: { title: string }) {
  return (
    <div className="h-full flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>{title}</div>
        <div className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          Planned — not designed yet.
        </div>
        <Link to="/" className="text-sm" style={{ color: 'var(--accent)' }}>← Back to Home</Link>
      </div>
    </div>
  );
}
