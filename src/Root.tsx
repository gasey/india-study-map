import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useApp } from '@/lib/store';
import { AppShell } from '@/components/shell/AppShell';
import { Home } from '@/pages/Home';

// ============================================
// ROOT SHELL
//
// Jabreeze = a shell of code-split modules (see modules/registry.ts).
// The map app and the PYQ module load lazily — adding a future page
// costs one lazy() line + one <Route> + one registry entry.
// Static drop-in pages (e.g. /codex/index.html) live in /public and
// bypass the router entirely.
//
// Every route renders inside <AppShell>, which picks the rail /
// command-bar / no-chrome wrapper for the active shell style
// (see lib/shellStyles.ts) — flip it from the switcher in the rail.
// ============================================

const StudyMapApp = lazy(() => import('./App').then((m) => ({ default: m.App })));
const PyqPage = lazy(() => import('./modules/pyq/PyqPage'));
const FlashcardsPage = lazy(() => import('./modules/flashcards/FlashcardsPage'));
const MindMapsPage = lazy(() => import('./modules/mindmaps/MindMapsPage'));
const ChroniclePage = lazy(() => import('./modules/chronicle/ChroniclePage'));
const CurrentAffairsPage = lazy(() => import('./modules/current-affairs/CurrentAffairsPage'));
const QuizPlayerPage = lazy(() => import('./modules/current-affairs/QuizPlayerPage'));
const ArenaPage = lazy(() => import('./modules/arena/ArenaPage'));

function Loading() {
  return (
    <div className="h-full flex items-center justify-center" style={{ background: 'var(--bg-app)' }}>
      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading…</div>
    </div>
  );
}

/** Theme class must apply on every module, not just the map. */
function ThemeSync() {
  const theme = useApp((s) => s.theme);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  return null;
}

export function Root() {
  return (
    <BrowserRouter>
      <ThemeSync />
      <AppShell>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/map" element={<StudyMapApp />} />
            <Route path="/pyq" element={<PyqPage />} />
            <Route path="/flashcards" element={<FlashcardsPage />} />
            <Route path="/mindmaps" element={<MindMapsPage />} />
            <Route path="/timeline" element={<ChroniclePage />} />
            <Route path="/current-affairs" element={<CurrentAffairsPage />} />
            <Route path="/current-affairs/:date" element={<QuizPlayerPage />} />
            <Route path="/arena" element={<ArenaPage />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </AppShell>
    </BrowserRouter>
  );
}
