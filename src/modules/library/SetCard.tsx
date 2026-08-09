import type { StaticSet } from '@/lib/mpscApi';

// ============================================
// SetCard — per components.md + the real markup in the prototype
// (`Jabreeze - Redesign.dc.html`, Library section): 260px tall,
// overflow hidden, --r-lg. Cover (168px): subject-hue gradient, a
// 45° hairline repeating-gradient texture, two offset hue circles
// top-right, a 54px circular count badge, "added" date top-left mono.
// Panel sits at bottom: -66px and slides up 66px on hover to reveal
// the blurb below a dashed rule — the count/title/subtitle/category
// tag stay visible at rest; only the blurb is the reveal.
// ============================================

const GROUP_LABEL: Record<StaticSet['group'], string> = {
  lab: 'Lab', exam_guide: 'Exam guide', quick_practice: 'Quick practice',
};

const GROUP_HUE: Record<StaticSet['group'], string> = {
  lab: 'var(--forest)', exam_guide: 'var(--blue)', quick_practice: 'var(--plum)',
};

function fmtAdded(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }).toUpperCase();
}

interface SetCardProps {
  set: StaticSet;
  onOpen: (set: StaticSet) => void;
}

export function SetCard({ set, onOpen }: SetCardProps) {
  const hue = GROUP_HUE[set.group];
  const countText = set.nItems !== null ? `${set.nItems} ${set.unit}` : '—';

  return (
    <div
      onClick={() => onOpen(set)}
      className="group relative rounded-xl overflow-hidden cursor-pointer"
      style={{ height: 260, background: 'var(--bg-panel)', border: '1px solid var(--border)', boxShadow: 'var(--sh-1)' }}
    >
      {/* Cover */}
      <div className="absolute inset-x-0 top-0 overflow-hidden" style={{ height: 168, background: `linear-gradient(135deg, color-mix(in srgb, ${hue} 55%, var(--bg-panel)), color-mix(in srgb, ${hue} 20%, var(--bg-panel)))` }}>
        <div
          className="absolute inset-0"
          style={{ background: 'repeating-linear-gradient(135deg, transparent 0 13px, color-mix(in srgb, var(--bg-panel) 22%, transparent) 13px 14px)' }}
        />
        <div
          className="absolute rounded-full"
          style={{ top: -46, right: -46, width: 158, height: 158, background: `color-mix(in srgb, ${hue} 30%, transparent)` }}
        />
        {/* Count badge */}
        <div
          className="absolute rounded-full flex flex-col items-center justify-center"
          style={{ top: 14, right: 14, width: 54, height: 54, background: hue, color: 'var(--on-accent)', lineHeight: 1.05 }}
        >
          {set.nItems !== null ? (
            <>
              <span className="font-mono text-[15px] font-bold">{set.nItems}</span>
              <span className="text-[9px] font-bold uppercase" style={{ letterSpacing: '0.08em', opacity: 0.85 }}>{set.unit}</span>
            </>
          ) : (
            <span className="text-lg">•</span>
          )}
        </div>
        <div className="absolute font-mono text-[9px] uppercase" style={{ left: 16, top: 16, letterSpacing: '0.12em', color: 'var(--on-accent)', opacity: 0.85 }}>
          {fmtAdded(set.createdAt)}
        </div>
      </div>

      {/* Panel — slides up on hover to reveal the blurb */}
      <div
        className="absolute inset-x-0 px-4 pt-6 pb-3.5 transition-transform duration-[420ms] group-hover:-translate-y-[66px]"
        style={{ bottom: -66, background: 'var(--bg-panel)', transitionTimingFunction: 'cubic-bezier(0.37, 0.75, 0.61, 1.05)' }}
      >
        <span
          className="absolute px-2.5 py-1.5 text-[10px] font-bold uppercase"
          style={{ top: -25, left: 0, background: hue, color: 'var(--on-accent)', letterSpacing: '0.06em' }}
        >
          {GROUP_LABEL[set.group]}
        </span>
        <div className="text-[15px] font-bold leading-tight mb-1" style={{ letterSpacing: '-0.015em', color: 'var(--text-primary)' }}>
          {set.title}
        </div>
        <div className="text-xs font-medium mb-2.5" style={{ color: hue }}>{set.blurb.length > 60 ? set.blurb.slice(0, 60) + '…' : set.blurb}</div>
        <div className="flex items-center gap-2.5 text-[11px]" style={{ color: 'var(--text-muted)' }}>
          <span>{countText}</span>
          <span className="ml-auto font-semibold" style={{ color: hue }}>Open →</span>
        </div>
        <div
          className="text-xs leading-relaxed mt-2.5 pt-2.5 overflow-hidden"
          style={{ height: 56, color: 'var(--text-secondary)', borderTop: '1px dashed var(--border)' }}
        >
          {set.blurb}
        </div>
      </div>
    </div>
  );
}
