import { Link } from 'react-router-dom';
import { IC, IconSvg } from '@/components/shell/icons';

/** Thin real page linking to the two Recall destinations. Flashcards is
 *  unchanged internals per the migration map. Mind Maps *was* rebuilt as a
 *  node graph with mastery-state pills (see MindMapsPage.tsx +
 *  lib/mindMapMastery.ts) — the earlier call to drop that rebuild (no real
 *  per-topic attempt log existed) no longer holds: commit adc43e0 added
 *  progress[chapterId] as a genuine local attempt log. State/accuracy only
 *  render on nodes that carry a chapterId, though — most outline nodes
 *  don't, by design, rather than fabricating a number for them. */
export function RecallLandingPage() {
  return (
    <div className="h-full overflow-y-auto scroll-panel">
      <div className="max-w-[720px] mx-auto px-8 py-9 flex flex-col gap-4">
        <h1 className="text-2xl font-medium tracking-tight" style={{ color: 'var(--text-primary)' }}>Recall</h1>
        <div className="grid sm:grid-cols-2 gap-3">
          <Link
            to="/mindmaps"
            className="rounded-lg p-5 flex flex-col gap-2"
            style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}
          >
            <span style={{ color: 'var(--accent)' }}><IconSvg d={IC.mind} size={22} /></span>
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Mind maps</span>
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Topics as collapsible trees — click through to the map</span>
          </Link>
          <Link
            to="/flashcards"
            className="rounded-lg p-5 flex flex-col gap-2"
            style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}
          >
            <span style={{ color: 'var(--accent)' }}><IconSvg d={IC.cards} size={22} /></span>
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Flashcards</span>
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Rapid recall — flip, mark Known or Review</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
