import { CSSProperties } from 'react';

// ============================================
// Skeleton loading placeholders — the redesign's "Loading" state.
//
// Ported verbatim from the mockup's states block (designs/Jabreeze -
// Redesign.dc.html, `isStates`, lines 964-980): skeleton rows at the *real*
// question-card row height so nothing jumps when data lands, never a spinner.
// Each bar uses the `om-pulse` keyframe (src/styles/motion.css) with staggered
// delays so the row shimmers rather than blinks in unison.
//
// Tokens are the mockup's literal ones (--sunk fill, --line row divider) — the
// same canonical vocabulary the design markup uses and that the legacy aliases
// (--bg-panel-elev, --border) already map onto.
// ============================================

const PULSE = 'om-pulse 1.4s ease-in-out infinite';

/** One bar. `delay` staggers the pulse; `w`/`h` are the mockup's px/%. */
function Bar({ w, h, r = 4, delay = 0, style }: { w: string; h: number; r?: number; delay?: number; style?: CSSProperties }) {
  return (
    <span
      style={{
        display: 'block',
        width: w,
        height: h,
        borderRadius: r,
        background: 'var(--sunk)',
        animation: PULSE,
        animationDelay: `${delay}s`,
        ...style,
      }}
    />
  );
}

/** A single skeleton question row: meta line · stem · two option bars.
 *  Matches the QuestionCard's rough footprint so the list holds its height. */
function SkeletonRow({ last }: { last: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 7,
        paddingBottom: 12,
        borderBottom: last ? 'none' : '1px solid var(--line)',
      }}
    >
      <div style={{ display: 'flex', gap: 7 }}>
        <Bar w="52px" h={11} delay={0} />
        <Bar w="68px" h={11} delay={0.1} />
        <Bar w="44px" h={11} delay={0.2} />
      </div>
      <Bar w="74%" h={14} delay={0.15} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 7 }}>
        <Bar w="100%" h={30} r={8} delay={0.2} />
        <Bar w="100%" h={30} r={8} delay={0.3} />
      </div>
    </div>
  );
}

/** N skeleton question rows. Drop this wherever a filtered question list is
 *  about to render — same height per row, so the panel never collapses then
 *  jumps. Default 4 rows fills a typical browse pane. */
export function SkeletonRows({ rows = 4 }: { rows?: number }) {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} last={i === rows - 1} />
      ))}
    </div>
  );
}

/** A single pulsing bar, exposed for lighter placeholders (sidebar tree rows,
 *  stat lines) that don't need the full question-row shape. */
export function SkeletonBar({ w = '100%', h = 12, r = 6, delay = 0 }: { w?: string; h?: number; r?: number; delay?: number }) {
  return <Bar w={w} h={h} r={r} delay={delay} />;
}

/** A grid of card-shaped skeletons for the Library / Tests card grids. */
export function SkeletonCards({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--r-lg)',
            padding: '16px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            minHeight: 132,
          }}
        >
          <div style={{ display: 'flex', gap: 7 }}>
            <Bar w="60px" h={11} delay={i * 0.05} />
            <Bar w="40px" h={11} delay={i * 0.05 + 0.1} />
          </div>
          <Bar w="80%" h={15} delay={i * 0.05 + 0.15} />
          <Bar w="55%" h={11} delay={i * 0.05 + 0.2} />
          <div style={{ marginTop: 'auto', display: 'flex', gap: 7 }}>
            <Bar w="100%" h={30} r={8} delay={i * 0.05 + 0.25} />
          </div>
        </div>
      ))}
    </div>
  );
}
