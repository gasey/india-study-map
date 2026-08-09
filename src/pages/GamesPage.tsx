import { useNavigate } from 'react-router-dom';
import { useApp } from '@/lib/store';
import { GameCard } from '@/modules/games/GameCard';
import { Badge } from '@/modules/games/Badge';

// ============================================
// GAMES HUB — real hub replacing the /games PlannedPage stub. Gauntlet Run
// is the one real game today; its card is driven by the existing, already-
// persisted `arena` store (highScore/coins/bestStreak) rather than a new
// server-side XP/Profile table — that table doesn't exist in mpsc_api and
// nothing here needs cross-device sync yet, so building it now would be
// speculative infrastructure for a requirement nobody's stated.
//
// Badges render locked-only: names/unlock criteria are a real product
// decision the user deferred ("later"), not something to guess at. See
// Badge.tsx.
// ============================================

const LOCKED_SLOTS = 6;

export default function GamesPage() {
  const navigate = useNavigate();
  const arena = useApp((s) => s.arena);

  return (
    <div className="h-full overflow-y-auto scroll-panel">
      <div className="max-w-[900px] mx-auto px-8 py-9 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-medium tracking-tight" style={{ color: 'var(--text-primary)' }}>Games</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Knowledge-gated arcade — every answer is real revision.</p>
        </div>

        <GameCard
          g={{
            glyph: '🏃',
            title: 'Gauntlet Run',
            tag: 'Runner',
            color: 'var(--blue)',
            pair: 'var(--indigo)',
            blurb: 'Dodge is survival, answers are progress — every gate asks an MCQ.',
            best: `Best ${arena.highScore.toLocaleString()}`,
            stat: `🪙 ${arena.coins}`,
          }}
          onPlay={() => navigate('/arena')}
        />

        <div>
          <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
            Badges <span className="font-normal" style={{ color: 'var(--text-muted)' }}>— criteria not defined yet</span>
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {Array.from({ length: LOCKED_SLOTS }).map((_, i) => (
              <Badge key={i} glyph="🔒" label="Locked" earned={false} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
