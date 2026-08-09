import { Link } from 'react-router-dom';
import { IC, IconSvg } from '@/components/shell/icons';

/** Thin real page — both destinations already exist and are unchanged
 *  ("Recall → Mind maps/Flashcards, unchanged internals" per the migration
 *  map). The node-graph mind-map rebuild (mastery-state edges, per-node
 *  question counts) is investigated and dropped, not deferred: it needs a
 *  real per-question attempt log (subject/topic + correct/incorrect per
 *  question), which doesn't exist anywhere in mpsc_api — `mock_attempts`
 *  only stores whole-test aggregates. Building the mastery UI against that
 *  would mean inventing per-topic accuracy numbers, the same class of
 *  mistake Phase 5b's Results screen deliberately avoided (no fabricated
 *  cutoffs/ranks). Same reasoning as dropping <VerificationQueue/> in
 *  Phase 6a. Needs its own attempt-log design before this is revisited. */
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
