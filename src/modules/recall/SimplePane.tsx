import type { ReactNode } from 'react';

// ============================================
// SimplePane — the Jabreeze design's "isSimple" template (header card +
// [canvas | list] grid), used verbatim in the mockup for Study Map,
// Chronicle, and Recall's Flashcards/Due-today tabs. Ported here for real
// use in Recall since those two tabs need it; Study Map/Chronicle stay on
// their own existing pages per the migration map ("unchanged internals").
// ============================================

export interface SimpleItem {
  label: string;
  meta: string;
  color: string;
  active?: boolean;
  onClick?: () => void;
}

export interface SimpleTool {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

interface SimplePaneProps {
  heading: string;
  blurb: string;
  cta?: { label: string; onClick: () => void };
  canvasLabel: string;
  canvasTools?: SimpleTool[];
  canvasBody: ReactNode;
  footNote: string;
  listLabel: string;
  items: SimpleItem[];
}

export function SimplePane({ heading, blurb, cta, canvasLabel, canvasTools, canvasBody, footNote, listLabel, items }: SimplePaneProps) {
  return (
    <div className="flex flex-col gap-[18px]">
      <div className="rounded-xl p-[18px_20px] flex flex-col sm:flex-row items-start gap-4" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
        <div className="flex-1 min-w-0">
          <div className="text-[16px] font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{heading}</div>
          <div className="text-[13px] leading-relaxed max-w-[76ch]" style={{ color: 'var(--text-secondary)' }}>{blurb}</div>
        </div>
        {cta && (
          <button
            onClick={cta.onClick}
            className="px-4 py-2 rounded-lg text-[13px] font-semibold whitespace-nowrap"
            style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}
          >
            {cta.label}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-4 items-start">
        <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2.5 px-4 py-[11px]" style={{ borderBottom: '1px solid var(--border)' }}>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: 'var(--text-muted)' }}>{canvasLabel}</span>
            <div className="flex-1" />
            {canvasTools?.map((t) => (
              <span
                key={t.label}
                onClick={t.onClick}
                className="text-[11px] px-2.5 py-1 rounded-md"
                style={{
                  border: `1px solid ${t.active ? 'var(--accent)' : 'var(--border)'}`,
                  color: t.active ? 'var(--accent)' : 'var(--text-secondary)',
                  cursor: t.onClick ? 'pointer' : 'default',
                }}
              >
                {t.label}
              </span>
            ))}
          </div>
          <div className="p-6 flex items-center justify-center" style={{ minHeight: 380, background: 'var(--bg-app)' }}>
            <div className="w-full max-w-md">{canvasBody}</div>
          </div>
          <div className="px-4 py-[13px] text-[12px]" style={{ color: 'var(--text-secondary)' }}>{footNote}</div>
        </div>

        <div className="rounded-xl p-[17px_19px]" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
          <div className="font-mono text-[10px] uppercase tracking-[0.12em] mb-3" style={{ color: 'var(--text-muted)' }}>{listLabel}</div>
          <div className="flex flex-col gap-[3px]">
            {items.map((i) => (
              <div
                key={i.label}
                onClick={i.onClick}
                className="flex items-center gap-[9px] px-[9px] py-2 rounded-lg"
                style={{ background: i.active ? 'var(--accent-soft)' : 'transparent', cursor: i.onClick ? 'pointer' : 'default' }}
              >
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: i.color }} />
                <span className="text-[12px] flex-1 min-w-0 truncate" style={{ fontWeight: i.active ? 600 : 400, color: 'var(--text-primary)' }}>{i.label}</span>
                <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>{i.meta}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
