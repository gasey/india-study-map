import { CSSProperties, ReactNode } from 'react';

// ============================================
// StateMessage — the redesign's shared "message" state card. The mockup's
// states block (designs/Jabreeze - Redesign.dc.html, `isStates`, the
// `s.isMessage` branch, lines 983-995) renders Empty, Error, Error-in-test and
// Offline all through the *same* centred card: a rounded glyph tile, a heading,
// a body line, and one or two buttons. Only the tone (icon/button colour) and
// copy differ, so this is one component with a `tone`, and EmptyState /
// ErrorState below are thin, honest wrappers over it.
//
// Layout values are the mockup's literal ones (40px glyph tile, radius 11,
// max-width 460, 8/15 button padding, etc.). Tokens follow the design markup:
// canonical --surface/--line/--muted/--accent/--on-accent/--bad/--warn, the
// same vocabulary the legacy aliases already alias onto.
// ============================================

type Tone = 'neutral' | 'error' | 'warn';

interface ToneColors {
  iconBg: string;
  iconFg: string;
  ctaBg: string;
  ctaFg: string;
}

const TONES: Record<Tone, ToneColors> = {
  neutral: { iconBg: 'var(--sunk)', iconFg: 'var(--muted)', ctaBg: 'var(--accent)', ctaFg: 'var(--on-accent)' },
  error: { iconBg: 'color-mix(in srgb, var(--bad) 14%, transparent)', iconFg: 'var(--bad)', ctaBg: 'var(--bad)', ctaFg: '#fff' },
  warn: { iconBg: 'color-mix(in srgb, var(--warn) 14%, transparent)', iconFg: 'var(--warn)', ctaBg: 'var(--warn)', ctaFg: '#fff' },
};

export interface StateAction {
  label: string;
  onClick: () => void;
}

interface StateMessageProps {
  /** Single glyph shown in the tile. Mockup uses ⌕ (empty), ⚠ (error), ⇣/⏻. */
  glyph: string;
  tone?: Tone;
  heading: string;
  body: ReactNode;
  /** Solid primary button. */
  primary?: StateAction;
  /** Outlined secondary button (mockup's `cta2`). */
  secondary?: StateAction;
  /** Extra styles on the centring wrapper (e.g. min-height for a panel fill). */
  style?: CSSProperties;
}

export function StateMessage({ glyph, tone = 'neutral', heading, body, primary, secondary, style }: StateMessageProps) {
  const c = TONES[tone];
  return (
    <div
      className="section-enter"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 20px',
        minHeight: 132,
        ...style,
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 460 }}>
        <div
          aria-hidden
          style={{
            width: 40,
            height: 40,
            borderRadius: 11,
            margin: '0 auto 12px auto',
            background: c.iconBg,
            color: c.iconFg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 19,
          }}
        >
          {glyph}
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 5, color: 'var(--ink)' }}>{heading}</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 14, textWrap: 'pretty' as CSSProperties['textWrap'] }}>
          {body}
        </div>
        {(primary || secondary) && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {primary && (
              <button
                type="button"
                onClick={primary.onClick}
                style={{
                  padding: '8px 15px',
                  borderRadius: 7,
                  background: c.ctaBg,
                  color: c.ctaFg,
                  border: '1px solid transparent',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {primary.label}
              </button>
            )}
            {secondary && (
              <button
                type="button"
                onClick={secondary.onClick}
                style={{
                  padding: '8px 15px',
                  borderRadius: 7,
                  background: 'var(--surface)',
                  color: 'var(--muted)',
                  border: '1px solid var(--line)',
                  fontSize: 12,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {secondary.label}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/** Empty result set. Mockup's Empty state names the tightest filter and its
 *  cost; where that count-if-dropped is not cheaply computable we fall back to
 *  naming how many filters are active and offering one-click reset — an honest
 *  simplification, flagged in the call sites. */
export function EmptyState(props: Omit<StateMessageProps, 'glyph' | 'tone'> & { glyph?: string }) {
  return <StateMessage glyph={props.glyph ?? '⌕'} tone="neutral" {...props} />;
}

/** Something failed to load. Mockup's Error state: say what failed, reassure
 *  the filter is safe, offer one retry. */
export function ErrorState(props: Omit<StateMessageProps, 'glyph' | 'tone'> & { glyph?: string }) {
  return <StateMessage glyph={props.glyph ?? '⚠'} tone="error" {...props} />;
}
