import { tint, mixSurface } from '@/lib/colorMix';

// ============================================
// GAME CARD — ported from the Jabreeze handoff's cards.tsx `GameCard`,
// adapted to this repo's Tailwind + var(--token) convention (see
// DayShelf.tsx for the same adaptation). Gradient body + glass plane +
// orbit rings + 3D tilt on hover (.card-tilt, already in motion.css
// since Phase 1).
// ============================================

export interface GameCardData {
  glyph: string;
  title: string;
  tag: string;
  color: string;
  pair: string;
  blurb: string;
  best: string;
  stat: string;
}

export function GameCard({ g, onPlay }: { g: GameCardData; onPlay: () => void }) {
  return (
    <div style={{ perspective: 1100 }}>
      <div
        className="card-tilt relative rounded-[22px] flex gap-4 items-start overflow-hidden"
        style={{
          padding: '20px 22px',
          background: `linear-gradient(148deg, ${mixSurface(g.color, 38)} 0%, ${mixSurface(g.pair, 24)} 55%, var(--bg-panel) 100%)`,
          border: `1px solid ${tint(g.color, 45)}`,
          boxShadow: `0 22px 46px -26px ${tint(g.color, 80)}, inset 0 1px 0 ${tint('#ffffff', 45)}`,
        }}
      >
        <div
          className="absolute pointer-events-none"
          style={{
            inset: '1px 1px auto 1px', height: '62%', borderRadius: '21px 21px 70% 21px',
            background: `linear-gradient(180deg, ${mixSurface('var(--bg-panel)', 84)} 0%, ${tint('var(--bg-panel)', 18)} 100%)`,
          }}
        />
        <div className="absolute pointer-events-none rounded-full" style={{ top: -34, right: -34, width: 132, height: 132, background: tint(g.color, 20) }} />
        <div className="absolute pointer-events-none rounded-full" style={{ top: -12, right: -12, width: 88, height: 88, background: tint(g.color, 26) }} />

        <div
          className="relative shrink-0 rounded-2xl flex items-center justify-center text-2xl"
          style={{ width: 48, height: 48, background: mixSurface(g.color, 24), border: `1px solid ${tint(g.color, 40)}` }}
        >
          {g.glyph}
        </div>

        <div className="relative flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base font-bold tracking-tight">{g.title}</span>
            <span
              className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded"
              style={{ letterSpacing: '0.04em', border: `1px solid ${g.color}`, color: g.color }}
            >
              {g.tag}
            </span>
          </div>
          <div className="text-xs leading-relaxed mb-3.5" style={{ color: 'var(--text-secondary)' }}>{g.blurb}</div>
          <div className="flex items-center gap-3.5">
            <span className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>{g.best}</span>
            <span className="font-mono text-xs" style={{ color: g.color }}>{g.stat}</span>
            <button
              onClick={onPlay}
              className="ml-auto px-4 py-1.5 rounded-full text-xs font-bold uppercase"
              style={{ letterSpacing: '0.04em', background: g.color, color: 'var(--on-accent)' }}
            >
              Play
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
