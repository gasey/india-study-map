import { motion } from 'framer-motion';
import { useApp } from '@/lib/store';
import { basemaps } from '@/lib/basemaps';
import { ModuleSwitcher } from '@/modules/ModuleSwitcher';

/** Ordered picks for the switcher — the picture-map styles first. */
const BASEMAP_CHOICES = ['watercolor', 'natgeo', 'physical', 'relief', 'imagery', 'topo', 'opentopo', 'voyager', 'clean'];

interface TopBarProps {
  authorMode?: boolean;
  onToggleAuthor?: () => void;
  /** Mobile: open the chapter drawer. */
  onToggleNav?: () => void;
}

export function TopBar({ authorMode, onToggleAuthor, onToggleNav }: TopBarProps) {
  const { theme, toggleTheme, mode, basemapOverride, setBasemapOverride } = useApp();

  return (
    <header
      className="safe-top h-12 shrink-0 border-b flex items-center justify-between px-5"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-panel)' }}
    >
      <div className="flex items-center gap-3">
        {onToggleNav && (
          <button
            onClick={onToggleNav}
            className="lg:hidden -ml-1 w-10 h-10 -my-1 flex items-center justify-center rounded-md hover:bg-[var(--bg-panel-elev)] transition-colors active:scale-95"
            style={{ color: 'var(--text-primary)' }}
            aria-label="Open chapters"
          >
            ☰
          </button>
        )}
        <ModuleSwitcher />
        <div className="w-2 h-2 rounded-full hidden sm:block" style={{ background: 'var(--accent)' }} />
        <span className="label-eyebrow hidden sm:inline">
          {authorMode ? 'Author Mode' : mode === 'study' ? 'Study Mode' : 'Quiz Mode'}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Basemap switcher — turn any chapter into a picture map */}
        <label className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }} title="Change the map style for every chapter">
          <span aria-hidden="true">🗺</span>
          <select
            value={basemapOverride ?? ''}
            onChange={(e) => setBasemapOverride(e.target.value || null)}
            className="px-2 py-1.5 rounded-md text-xs border cursor-pointer"
            style={{ background: 'var(--bg-panel)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
            aria-label="Map style"
          >
            <option value="">Chapter default</option>
            {BASEMAP_CHOICES.filter((id) => basemaps[id]).map((id) => (
              <option key={id} value={id}>{basemaps[id].name}</option>
            ))}
          </select>
        </label>
        {onToggleAuthor && (
          <button
            onClick={onToggleAuthor}
            className={`min-h-10 px-3 py-2 rounded-md text-xs transition-colors flex items-center gap-2 active:scale-95 ${
              authorMode ? 'bg-[var(--accent)] text-white' : 'hover:bg-[var(--bg-panel-elev)]'
            }`}
            style={!authorMode ? { color: 'var(--text-secondary)' } : undefined}
            aria-label="Toggle author mode"
            title="Build a new chapter by drawing on the map"
          >
            <span>✎</span>
            <span className="hidden sm:inline">{authorMode ? 'Exit author' : 'Author'}</span>
          </button>
        )}
        <button
          onClick={toggleTheme}
          className="min-h-10 px-3 py-2 rounded-md text-xs hover:bg-[var(--bg-panel-elev)] transition-colors flex items-center gap-2 active:scale-95"
          style={{ color: 'var(--text-secondary)' }}
          aria-label="Toggle theme"
        >
          <motion.span
            initial={false}
            animate={{ rotate: theme === 'dark' ? 180 : 0 }}
            transition={{ duration: 0.4 }}
          >
            {theme === 'light' ? '☼' : '☾'}
          </motion.span>
          <span className="hidden sm:inline">{theme === 'light' ? 'Light' : 'Dark'}</span>
        </button>
      </div>
    </header>
  );
}
