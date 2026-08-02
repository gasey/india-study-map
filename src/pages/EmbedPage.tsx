import { Link, useParams } from 'react-router-dom';
import { modules } from '@/modules/registry';

/**
 * Generic in-app frame for every `kind: 'static'` module (Polity Codex,
 * Labs, JSO, Quick Practice) — one route serves all of them, so a static
 * HTML page opens inside this shell instead of a real `target="_blank"`
 * redirect. Nothing about the static files themselves changes.
 */
export function EmbedPage() {
  const { id } = useParams<{ id: string }>();
  const module = modules.find((m) => m.id === id && m.kind === 'static');

  if (!module) {
    return (
      <div className="h-full flex items-center justify-center" style={{ background: 'var(--bg-app)' }}>
        <div className="text-center">
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>Nothing here.</p>
          <Link to="/" className="text-sm" style={{ color: 'var(--accent)' }}>← Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--bg-app)' }}>
      <div
        className="shrink-0 flex items-center gap-3 px-4 h-11 safe-top"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-panel)' }}
      >
        <Link to="/" className="text-sm" style={{ color: 'var(--text-secondary)' }}>← Home</Link>
        <span className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{module.title}</span>
      </div>
      <iframe src={module.path} title={module.title} className="flex-1 w-full border-0" />
    </div>
  );
}

export default EmbedPage;
