import { tint, mixSurface } from '@/lib/colorMix';

// ============================================
// BADGE — ported from cards.tsx's holographic `Badge`. Earned badges get a
// rainbow foil that sweeps on hover + a glare pass (.badge-holo/.badge-foil
// in motion.css); locked ones stay flat — the material difference IS the
// reward, never give a locked badge a foil.
//
// Every badge here renders `earned={false}` on purpose: badge names and
// unlock criteria are a real product decision the user deferred ("later"),
// not something to guess at. Swap in real criteria once given, then this
// component doesn't need to change — only the data passed to it does.
// ============================================

export function Badge({ glyph, label, earned }: { glyph: string; label: string; earned: boolean }) {
  if (!earned) {
    return (
      <div className="rounded-xl text-center" style={{ border: '1px solid var(--border)', padding: '13px 8px', opacity: 0.38 }}>
        <div className="text-2xl mb-1">{glyph}</div>
        <div className="text-xs font-semibold leading-tight">{label}</div>
      </div>
    );
  }

  return (
    <div style={{ perspective: 700 }}>
      <div
        className="badge-holo relative rounded-xl text-center overflow-hidden"
        style={{
          padding: '13px 8px', isolation: 'isolate', transformStyle: 'preserve-3d',
          border: `1px solid ${tint('var(--ok)', 55)}`,
          background: `linear-gradient(150deg, ${mixSurface('var(--ok)', 20)}, ${mixSurface('var(--indigo)', 14)})`,
          boxShadow: `0 8px 20px -14px ${tint('var(--ok)', 80)}`,
        }}
      >
        <div
          className="badge-foil absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.42, mixBlendMode: 'color-dodge', backgroundSize: '220% 220%', backgroundPosition: '12% 50%',
            background: 'repeating-linear-gradient(112deg, rgba(255,119,115,0.45) 0%, rgba(255,237,95,0.4) 8%, rgba(168,255,95,0.4) 15%, rgba(131,255,247,0.4) 22%, rgba(120,148,255,0.45) 30%, rgba(216,117,255,0.45) 38%, rgba(255,119,115,0.45) 46%)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: 0.42, mixBlendMode: 'overlay', background: 'radial-gradient(farthest-corner circle at 32% 24%, rgba(255,255,255,0.8) 6%, rgba(255,255,255,0.15) 34%, rgba(0,0,0,0.35) 90%)' }}
        />
        <div className="relative text-2xl mb-1">{glyph}</div>
        <div className="relative text-xs font-semibold leading-tight">{label}</div>
      </div>
    </div>
  );
}
