import { useApp } from '@/lib/store';
import { ModuleSwitcher } from '@/modules/ModuleSwitcher';
import { useHasDesktopChrome } from '@/lib/useShellChrome';
import { eras } from '@/data/timeline/eras';
import { formatYear } from '@/data/timeline/types';
import type { ChronicleViewInfo } from './TimelineCanvas';

interface TopBarProps {
  viewInfo: ChronicleViewInfo | null;
  onOpenPalette: () => void;
}

/** Top bar (design handoff §"Screens / Views" → Canvas view → Top bar):
 *  brand + live era readout, streak/XP, Canvas/Reading toggle, search
 *  launcher. Story mode's button is intentionally omitted this phase — see
 *  the plan's deferred roadmap; it has no backing state yet. Also carries
 *  the mobile module switcher + theme toggle the old plain header had. */
export function TopBar({ viewInfo, onOpenPalette }: TopBarProps) {
  const { theme, toggleTheme } = useApp();
  const hasDesktopChrome = useHasDesktopChrome('home');
  const xp = useApp((s) => s.chronicle.xp);
  const streak = useApp((s) => s.chronicle.streak);
  const view = useApp((s) => s.chronicle.view);
  const setChronicleView = useApp((s) => s.setChronicleView);
  const level = Math.floor(xp / 100) + 1;

  const currentEra = viewInfo ? eras.find((e) => e.id === viewInfo.currentEraId) : undefined;

  return (
    <div
      className="safe-top h-[54px] shrink-0 flex items-center gap-3 px-4 border-b"
      style={{
        borderColor: 'var(--border)',
        background: 'linear-gradient(180deg, var(--bg-panel), color-mix(in srgb, var(--accent) 3%, var(--bg-panel)))',
      }}
    >
      <div className="flex items-baseline gap-2.5 min-w-0 flex-1">
        <span className={hasDesktopChrome ? 'lg:hidden' : ''}>
          <ModuleSwitcher />
        </span>
        <span className="text-base font-semibold shrink-0" style={{ color: 'var(--text-primary)' }}>
          Chronicle
        </span>
        <span className="label-eyebrow shrink-0 hidden md:inline" style={{ fontSize: 10 }}>
          Master Timeline
        </span>
        {currentEra && (
          <span className="text-xs truncate hidden sm:inline" style={{ color: 'var(--text-secondary)' }} title="Current era">
            ✛ {currentEra.label} · {formatYear(currentEra.start)}–{formatYear(currentEra.end)}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={toggleTheme}
          className={`${hasDesktopChrome ? 'lg:hidden' : ''} px-2 py-1 rounded-md text-sm hover:bg-[var(--bg-panel-elev)] transition-colors`}
          style={{ border: '1px solid var(--border)' }}
          title="Toggle theme"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <div
          className="flex items-center gap-2 px-3 py-1 rounded-full text-xs tabular-nums whitespace-nowrap"
          style={{ background: 'var(--bg-panel-elev)', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
          title="Study streak and XP — earned in quizzes and flashcards"
        >
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Lv {level}</span>
          <span style={{ color: 'var(--text-muted)' }}>·</span>
          <span style={{ color: 'var(--text-secondary)' }}>{xp} XP</span>
          <span style={{ color: 'var(--text-muted)' }}>·</span>
          <span style={{ color: 'var(--text-secondary)' }}>{streak}-day</span>
        </div>

        <div
          className="flex rounded-lg overflow-hidden shrink-0"
          style={{ border: '1px solid var(--border)' }}
        >
          <button
            onClick={() => setChronicleView('canvas')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium transition-colors"
            style={{
              background: 'transparent',
              color: view === 'canvas' ? 'var(--accent)' : 'var(--text-secondary)',
              boxShadow: view === 'canvas' ? 'inset 0 0 0 1px var(--accent)' : 'none',
            }}
          >
            ◫ Canvas
          </button>
          <button
            onClick={() => setChronicleView('reading')}
            title="Reading view — era-by-era list"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium border-l transition-colors"
            style={{
              borderColor: 'var(--border)',
              color: view === 'reading' ? 'var(--accent)' : 'var(--text-secondary)',
              boxShadow: view === 'reading' ? 'inset 0 0 0 1px var(--accent)' : 'none',
            }}
          >
            ☰ Reading
          </button>
        </div>

        <button
          onClick={onOpenPalette}
          title="Search and commands"
          className="flex items-center gap-2 w-[190px] md:w-[230px] px-2.5 py-1.5 rounded-lg text-xs shrink-0 transition-colors hover:brightness-105"
          style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
        >
          <span>🔍</span>
          <span className="flex-1 text-left truncate">Search…</span>
          <span
            className="text-[10px] px-1.5 py-0.5 rounded shrink-0"
            style={{ background: 'var(--bg-panel)', color: 'var(--text-muted)', letterSpacing: '0.05em' }}
          >
            ⌘K
          </span>
        </button>
      </div>
    </div>
  );
}
