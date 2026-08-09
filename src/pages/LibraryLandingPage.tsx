import { Link } from 'react-router-dom';
import { modules, type PracticeSubgroup } from '@/modules/registry';

const GROUPS: PracticeSubgroup[] = ['Exam guides', 'Labs', 'Quick practice (one-offs)'];

/** Thin real page — pure links to existing static/`/embed/:id` destinations
 *  (jso, codex, labs, quick-practice). No filter/browse UI — that's the
 *  later-phase Library rebuild. Reads straight from the registry so this
 *  can't drift out of sync with it. */
export function LibraryLandingPage() {
  const staticModules = modules.filter((m) => m.kind === 'static');

  return (
    <div className="h-full overflow-y-auto scroll-panel">
      <div className="max-w-[820px] mx-auto px-8 py-9 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-medium tracking-tight mb-1.5" style={{ color: 'var(--text-primary)' }}>Library</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Premade sets — self-contained pages that never touch the question API.
          </p>
        </div>
        {GROUPS.map((group) => {
          const groupItems = group === 'Exam guides'
            ? staticModules.filter((m) => m.subgroup === 'Exam guides' || m.id === 'codex')
            : staticModules.filter((m) => m.subgroup === group);
          if (groupItems.length === 0) return null;
          return (
            <div key={group}>
              <div className="text-[11px] tracking-wider uppercase font-medium mb-2.5" style={{ color: 'var(--text-secondary)' }}>{group}</div>
              <div className="grid sm:grid-cols-2 gap-3">
                {groupItems.map((m) => (
                  <Link
                    key={m.id}
                    to={`/embed/${m.id}`}
                    className="rounded-lg p-4 flex items-start gap-2.5"
                    style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}
                  >
                    <span className="text-lg leading-none mt-0.5">{m.glyph}</span>
                    <div className="min-w-0">
                      <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{m.title}</div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{m.tagline}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
