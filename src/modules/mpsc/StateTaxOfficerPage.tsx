import { Link } from 'react-router-dom';
import { useApp } from '@/lib/store';
import { ModuleSwitcher } from '@/modules/ModuleSwitcher';
import { useHasDesktopChrome } from '@/lib/useShellChrome';
import { getBank } from '@/data/banks';
import { StateTaxOfficerEnhanced } from './StateTaxOfficerEnhanced';

// ============================================
// STATE TAX OFFICER — standalone module (own route, own switcher entry).
// Full-page shell around StateTaxOfficerEnhanced so it appears as its
// own app in the ModuleSwitcher rather than being buried as a tab
// inside the general MPSC Old Questions module.
//
// Reads directly from the 'mpsc-state-tax-officer' bank — NOT useMpscData(),
// which only serves the 'mpsc-old-questions' bank (+ its remote API). Wiring
// this to useMpscData() was a bug: it silently showed 0 questions because
// none of that bank's rows carry a source field matching this page's filter.
// ============================================

const stateTaxOfficerBank = getBank('mpsc-state-tax-officer');

export default function StateTaxOfficerPage() {
  const { theme, toggleTheme } = useApp();
  const hasDesktopChrome = useHasDesktopChrome('home');

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--bg-app)' }}>
      <div className="shrink-0 flex items-center gap-3 px-5 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
        {!hasDesktopChrome && <ModuleSwitcher />}
        <span className="text-lg">🎯</span>
        <div className="min-w-0">
          <div className="text-sm font-semibold truncate">State Tax Officer · Group B Gazetted</div>
          <div className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
            Comprehensive prep — primers, question bank, mock tests
          </div>
        </div>
        <button
          onClick={toggleTheme}
          className="ml-auto px-2.5 py-1 rounded-md text-sm hover:bg-[var(--bg-panel-elev)]"
          style={{ border: '1px solid var(--border)' }}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="flex-1 min-h-0">
        <StateTaxOfficerEnhanced allQuestions={stateTaxOfficerBank?.questions ?? []} papers={stateTaxOfficerBank?.papers ?? []} />
      </div>

      <div className="shrink-0 px-5 py-2 text-xs border-t" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
        <Link to="/" className="hover:underline">← Back to Home</Link>
      </div>
    </div>
  );
}
