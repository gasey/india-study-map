import { useEffect, useRef, useState } from 'react';
import { useApp } from '@/lib/store';
import { SHELL_STYLES, SHELL_STYLE_ORDER } from '@/lib/shellStyles';
import { IC, IconSvg } from './icons';

/** Small popover, anchored to its parent. 'rail' = opens to the side (vertical rail); 'bar' = opens below (horizontal bar). */
export function ShellSwitcher({ placement = 'rail' }: { placement?: 'rail' | 'bar' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { shellStyle, setShellStyle } = useApp();

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const popoverClass =
    placement === 'rail'
      ? 'absolute bottom-0 left-full ml-2 w-64'
      : 'absolute right-0 top-full mt-1.5 w-64';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-10 h-10 flex items-center justify-center rounded-lg transition-colors"
        style={{ color: 'var(--text-secondary)' }}
        title="Switch layout"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <IconSvg d={IC.layout} />
      </button>
      {open && (
        <div
          role="menu"
          className={`${popoverClass} rounded-lg shadow-lg z-[1200] overflow-hidden`}
          style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}
        >
          <div className="px-3 pt-2.5 pb-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
            Layout
          </div>
          {SHELL_STYLE_ORDER.map((id) => {
            const cfg = SHELL_STYLES[id];
            const active = id === shellStyle;
            return (
              <button
                key={id}
                role="menuitem"
                onClick={() => { setShellStyle(id); setOpen(false); }}
                className="w-full text-left px-3 py-2.5 flex items-start gap-2.5 transition-colors"
                style={{ background: active ? 'var(--accent-soft)' : 'transparent' }}
              >
                <span
                  className="mt-0.5 w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: active ? 'var(--accent)' : 'var(--border)' }}
                />
                <span className="min-w-0">
                  <span className="text-sm font-medium flex items-center gap-1.5" style={{ color: active ? 'var(--accent)' : 'var(--text-primary)' }}>
                    {cfg.label}
                    <span className="text-[10px] font-normal" style={{ color: 'var(--text-muted)' }}>{cfg.id}</span>
                  </span>
                  <span className="block text-xs mt-0.5 leading-snug" style={{ color: 'var(--text-secondary)' }}>
                    {cfg.blurb}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
