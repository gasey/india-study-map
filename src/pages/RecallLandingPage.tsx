import { useSearchParams } from 'react-router-dom';
import { MindMapsTab } from '@/modules/recall/MindMapsTab';
import { FlashcardsTab } from '@/modules/recall/FlashcardsTab';
import { DueTodayTab } from '@/modules/recall/DueTodayTab';

// ============================================
// RECALL — the Jabreeze design's SECTION_TABS.recall: ['Mind maps',
// 'Flashcards', 'Due today'], each an isSimple-template pane (see
// modules/recall/SimplePane.tsx) driven by real data — deck progress,
// mind-map node counts, chapterId-linked mastery. No shared cross-cutting
// due-queue: Flashcards and Mind Maps are still two separate data sources
// (real per-card "known" state vs real per-chapter quiz attempts), so
// "Due today" is a real union of not-yet-known cards, not a fabricated
// unified score.
//
// Uses a page-owned `?tab=` switcher (matching AdminConsolePage's pattern)
// rather than the shared AppHeader `tabs` prop, which no route currently
// wires up — see DEVLOG for the tradeoff.
// ============================================

type RecallTab = 'mindmaps' | 'flashcards' | 'due';

const TABS: { key: RecallTab; label: string }[] = [
  { key: 'mindmaps', label: 'Mind maps' },
  { key: 'flashcards', label: 'Flashcards' },
  { key: 'due', label: 'Due today' },
];

export function RecallLandingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = (searchParams.get('tab') as RecallTab) || 'mindmaps';

  const setTab = (t: RecallTab) => setSearchParams((prev) => {
    const next = new URLSearchParams(prev);
    next.set('tab', t);
    return next;
  });

  return (
    <div className="h-full overflow-y-auto scroll-panel">
      <div className="max-w-[1180px] mx-auto px-6 py-[22px] pb-12 flex flex-col gap-[18px]">
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

        {tab === 'mindmaps' && <MindMapsTab />}
        {tab === 'flashcards' && <FlashcardsTab />}
        {tab === 'due' && <DueTodayTab />}
      </div>
    </div>
  );
}

export default RecallLandingPage;
