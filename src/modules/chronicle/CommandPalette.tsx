import { AnimatePresence, motion } from 'framer-motion';
import type { useCommandPalette } from './useCommandPalette';

/** ⌘K / Ctrl+K / `/` — search entries, jump to a year, or run a command.
 *  Purely presentational: `ChroniclePage` owns the single `useCommandPalette`
 *  instance (its `open()` is also wired to the top bar's search launcher),
 *  and passes the whole hook return down here. */
export function CommandPalette({
  isOpen,
  query,
  setQuery,
  rows,
  activeIndex,
  setActiveIndex,
  inputRef,
  close,
  onInputKeyDown,
}: ReturnType<typeof useCommandPalette>) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[800] flex items-start justify-center pt-[12vh] px-4"
          style={{ background: 'rgba(0,0,0,0.45)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={close}
        >
          <motion.div
            className="w-full max-w-lg rounded-xl overflow-hidden shadow-2xl"
            style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5 px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <span style={{ color: 'var(--text-muted)' }}>🔍</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Search entries, jump to a year, or run a command…"
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: 'var(--text-primary)' }}
              />
              <span
                className="text-[10px] px-1.5 py-0.5 rounded shrink-0"
                style={{ background: 'var(--bg-panel-elev)', color: 'var(--text-muted)', letterSpacing: '0.05em' }}
              >
                ESC
              </span>
            </div>

            <div className="max-h-[50vh] overflow-y-auto scroll-panel py-1.5">
              {rows.length === 0 ? (
                <p className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  No matches — try a year (e.g. 1857) or an entry title.
                </p>
              ) : (
                rows.map((row, i) => (
                  <button
                    key={row.key}
                    onClick={row.run}
                    onMouseEnter={() => setActiveIndex(i)}
                    className="w-full flex items-center justify-between gap-2 text-left px-4 py-2 text-sm transition-colors"
                    style={{
                      background: i === activeIndex ? 'var(--accent-soft)' : 'transparent',
                      color: i === activeIndex ? 'var(--accent)' : 'var(--text-primary)',
                    }}
                  >
                    <span className="truncate">{row.label}</span>
                    {row.kind === 'entry' && (
                      <span className="shrink-0 tabular-nums text-xs" style={{ color: 'var(--text-muted)' }}>
                        {row.sublabel}
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
