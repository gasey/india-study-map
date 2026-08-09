import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { useApp } from '@/lib/store';
import { AppShell } from '@/components/shell/AppShell';
import { Home } from '@/pages/Home';
import { EmbedPage } from '@/pages/EmbedPage';
import { RecallLandingPage } from '@/pages/RecallLandingPage';
import { LibraryLandingPage } from '@/pages/LibraryLandingPage';

// ============================================
// ROOT SHELL
//
// Jabreeze = a shell of code-split modules (see modules/registry.ts).
// The map app and the PYQ module load lazily — adding a future page
// costs one lazy() line + one <Route> + one registry entry.
// Static drop-in pages (e.g. /codex/index.html) live in /public and
// bypass the router entirely.
//
// Every route renders inside <AppShell>, which always wraps it in the
// same rail + header chrome — see components/shell/AppShell.tsx.
// ============================================

const StudyMapApp = lazy(() => import('./App').then((m) => ({ default: m.App })));
const PyqPage = lazy(() => import('./modules/pyq/PyqPage'));
const FlashcardsPage = lazy(() => import('./modules/flashcards/FlashcardsPage'));
const MindMapsPage = lazy(() => import('./modules/mindmaps/MindMapsPage'));
const ChroniclePage = lazy(() => import('./modules/chronicle/ChroniclePage'));
const CurrentAffairsPage = lazy(() => import('./modules/current-affairs/CurrentAffairsPage'));
const QuizPlayerPage = lazy(() => import('./modules/current-affairs/QuizPlayerPage'));
const ArenaPage = lazy(() => import('./modules/arena/ArenaPage'));
const MpscPage = lazy(() => import('./modules/mpsc/MpscPage'));
const StateTaxOfficerPage = lazy(() => import('./modules/mpsc/StateTaxOfficerPage'));
const QuestionBankPage = lazy(() => import('./modules/question-bank/QuestionBankPage'));
const PapersPage = lazy(() => import('./pages/PapersPage'));
const TestsPage = lazy(() => import('./pages/TestsPage'));
const AdminConsolePage = lazy(() => import('./pages/AdminConsolePage'));
const GamesPage = lazy(() => import('./pages/GamesPage'));
const AccountPage = lazy(() => import('./pages/AccountPage'));
const PythonPage = lazy(() => import('./pages/PythonPage'));

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
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'ink' : 'paper');
  }, [theme]);
  return null;
}

export function Root() {
  return (
    <BrowserRouter>
      <Analytics />
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
            <Route path="/mpsc" element={<MpscPage />} />
            <Route path="/state-tax-officer" element={<StateTaxOfficerPage />} />
            <Route path="/embed/:id" element={<EmbedPage />} />
            <Route path="/question-bank" element={<QuestionBankPage />} />
            <Route path="/recall" element={<RecallLandingPage />} />
            <Route path="/library" element={<LibraryLandingPage />} />
            <Route path="/tests" element={<TestsPage />} />
            <Route path="/papers" element={<PapersPage />} />
            <Route path="/code" element={<PythonPage />} />
            <Route path="/games" element={<GamesPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/admin" element={<AdminConsolePage />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </AppShell>
    </BrowserRouter>
  );
}
