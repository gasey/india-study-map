import { useSearchParams } from 'react-router-dom';
import { hasCap, useAuthStore } from '@/lib/authStore';
import { DashboardTab } from '@/modules/admin/tabs/DashboardTab';
import { QuestionsTab } from '@/modules/admin/tabs/QuestionsTab';
import { ReportsTab } from '@/modules/admin/tabs/ReportsTab';
import { CommentsTab } from '@/modules/admin/tabs/CommentsTab';
import { AuditLogTab } from '@/modules/admin/tabs/AuditLogTab';
import { UsersTab } from '@/modules/admin/tabs/UsersTab';
import { StaticSetsTab } from '@/modules/admin/tabs/StaticSetsTab';
import { PapersTab } from '@/modules/admin/tabs/PapersTab';
import { FlagsTab } from '@/modules/admin/tabs/FlagsTab';
import { ImportTab } from '@/modules/admin/tabs/ImportTab';

// ============================================
// Admin console — the standalone, bank-agnostic replacement for the old
// AdminPanel.tsx embedded twice (once inside MpscPage, once inside
// StateTaxOfficerEnhanced), each reachable only via that bank's own
// `?tab=admin`. All the data here already carries a bankId — Reports,
// Comments, and Audit log all become "every bank, filterable by bank"
// instead of duplicated per page.
//
// Gated once at the page level (not per-tab) since every tab needs the
// same admin.stats capability — matches Phase 6a's plan.
// ============================================

type AdminTabKey = 'dashboard' | 'questions' | 'reports' | 'comments' | 'users' | 'audit' | 'static-sets' | 'papers' | 'flags' | 'import';

const TABS: { key: AdminTabKey; label: string }[] = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'questions', label: 'Questions' },
  { key: 'reports', label: 'Reports' },
  { key: 'comments', label: 'Comments' },
  { key: 'papers', label: 'Papers' },
  { key: 'static-sets', label: 'Static sets' },
  { key: 'flags', label: 'Flags' },
  { key: 'import', label: 'Import' },
  { key: 'users', label: 'Users & roles' },
  { key: 'audit', label: 'Audit log' },
];

export default function AdminConsolePage() {
  const { user } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = (searchParams.get('tab') as AdminTabKey) || 'dashboard';

  const setTab = (t: AdminTabKey) => setSearchParams((prev) => {
    const next = new URLSearchParams(prev);
    next.set('tab', t);
    return next;
  });

  if (!hasCap(user, 'admin.stats')) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>You don't have access to the admin console.</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto scroll-panel">
      <div className="max-w-[1100px] mx-auto px-8 py-9 flex flex-col gap-5">
        <div>
          <h1 className="text-2xl font-medium tracking-tight mb-1.5" style={{ color: 'var(--text-primary)' }}>Admin</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>One console, every bank — filter by bank inside each tab.</p>
        </div>

        <div className="flex gap-5 text-sm overflow-x-auto" style={{ borderBottom: '1px solid var(--border)' }}>
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="pb-2 whitespace-nowrap font-medium"
              style={{
                color: tab === t.key ? 'var(--accent)' : 'var(--text-secondary)',
                borderBottom: tab === t.key ? '2px solid var(--accent)' : '2px solid transparent',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'dashboard' && <DashboardTab />}
        {tab === 'questions' && <QuestionsTab />}
        {tab === 'reports' && <ReportsTab />}
        {tab === 'comments' && <CommentsTab />}
        {tab === 'papers' && <PapersTab />}
        {tab === 'static-sets' && <StaticSetsTab />}
        {tab === 'flags' && <FlagsTab />}
        {tab === 'import' && <ImportTab />}
        {tab === 'users' && <UsersTab />}
        {tab === 'audit' && <AuditLogTab />}
      </div>
    </div>
  );
}
