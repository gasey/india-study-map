import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/store';
import { ModuleSwitcher } from '@/modules/ModuleSwitcher';
import { HomeBackLink } from '@/components/shell/HomeBackLink';
import { useHasDesktopChrome } from '@/lib/useShellChrome';
import { DayShelf, type DayShelfEntry } from './DayShelf';
import type { ArchiveManifest } from './types';

// ============================================
// CURRENT AFFAIRS — archive of daily MCQ quizzes.
// Reads /data/current-affairs/index.json at runtime (not bundled — a
// future pipeline regenerates these files without a rebuild). Score
// badges come from the store's caAttempts, keyed by date.
// ============================================

type FetchState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; manifest: ArchiveManifest };

export function CurrentAffairsPage() {
  const { theme, toggleTheme, caAttempts } = useApp();
  const [state, setState] = useState<FetchState>({ status: 'loading' });
  const hasDesktopChrome = useHasDesktopChrome('home');
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    fetch('/data/current-affairs/index.json')
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status}`);
        return res.json();
      })
      .then((manifest: ArchiveManifest) => {
        if (!cancelled) setState({ status: 'ready', manifest });
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error' });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const days = state.status === 'ready' ? state.manifest.days : [];

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--bg-app)', color: 'var(--text-primary)' }}>
      {/* Hidden at desktop widths — AppHeader already covers the title there. */}
      <header
        className="lg:hidden safe-top h-12 shrink-0 border-b flex items-center justify-between px-5 gap-3"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-panel)' }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <HomeBackLink hasDesktopChrome={hasDesktopChrome} />
          <span className={hasDesktopChrome ? 'lg:hidden' : ''}><ModuleSwitcher /></span>
          <span className="label-eyebrow hidden md:inline">Current Affairs</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {days.length} {days.length === 1 ? 'day' : 'days'}
          </span>
          <button
            onClick={toggleTheme}
            className={`${hasDesktopChrome ? 'lg:hidden' : ''} px-2 py-1 rounded-md text-sm hover:bg-[var(--bg-panel-elev)] transition-colors`}
            style={{ border: '1px solid var(--border)' }}
            title="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      <main className="scroll-panel flex-1 min-h-0 overflow-y-auto px-5 py-6 flex justify-center">
        <div className="w-full max-w-2xl">
          {state.status === 'loading' && (
            <div className="rounded-xl p-8 text-center" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
              <p style={{ color: 'var(--text-secondary)' }}>Loading…</p>
            </div>
          )}

          {state.status === 'error' && (
            <div className="rounded-xl p-8 text-center" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
              <div className="text-3xl mb-2">⚠️</div>
              <p className="font-medium mb-1">Couldn't load Current Affairs.</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Check your connection and try reloading.</p>
            </div>
          )}

          {state.status === 'ready' && days.length === 0 && (
            <div className="rounded-xl p-8 text-center fact-in" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
              <div className="text-3xl mb-2">📰</div>
              <p className="font-medium mb-1">No quizzes yet.</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Check back once the first daily digest is published.</p>
            </div>
          )}

          {state.status === 'ready' && days.length > 0 && (
            <DayShelf
              days={days.map((day, i): DayShelfEntry => {
                const attempt = caAttempts[day.date];
                return {
                  ...day,
                  state: i === 0 ? 'today' : attempt ? 'done' : 'missed',
                  scoreLabel: attempt ? `${attempt.score}/${attempt.total}` : i === 0 ? 'Not started' : 'Missed',
                };
              })}
              active={0}
              onPick={(i) => navigate(`/current-affairs/${days[i].date}`)}
            />
          )}

          <div className="mt-4 flex items-center justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
            <Link to="/" className="hover:underline">← Home</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CurrentAffairsPage;
