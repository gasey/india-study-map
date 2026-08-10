import { Link } from 'react-router-dom';
import { useOnline } from '@/lib/useOnline';

// ============================================
// OfflineBanner — the redesign's "Offline" state, wired to a real signal.
//
// The mockup (designs/Jabreeze - Redesign.dc.html, `isStates`, the Offline
// block, lines 2311-2316) renders offline as a full message card that lists
// what still works with no network vs what doesn't. Rather than a static demo
// card, this is a slim app-wide strip driven by navigator.onLine (see
// useOnline) — it only appears when the browser is actually offline, and it
// names the same split the mockup does: Library, Study Map, Chronicle and
// cached decks keep working; the question bank, mock tests and admin don't.
//
// Deliberately a banner, not the mockup's centred card: it must not replace
// whatever page the user is on (they may be mid-way through a cached Library
// set), only warn them that live features are down. Copy is adapted from the
// mockup's Offline body; the "what works" list is the real set of API-free
// routes in this app.
// ============================================

export function OfflineBanner() {
  const online = useOnline();
  if (online) return null;

  return (
    <div
      role="status"
      className="shrink-0 flex items-center gap-2.5 px-4 py-2 text-xs section-enter"
      style={{
        background: 'color-mix(in srgb, var(--warn) 12%, var(--surface))',
        borderBottom: '1px solid color-mix(in srgb, var(--warn) 45%, var(--line))',
        color: 'var(--ink)',
      }}
    >
      <span
        aria-hidden
        className="shrink-0 inline-flex items-center justify-center rounded-md"
        style={{ width: 20, height: 20, background: 'color-mix(in srgb, var(--warn) 18%, transparent)', color: 'var(--warn)', fontSize: 13 }}
      >
        ⇣
      </span>
      <span style={{ lineHeight: 1.4 }}>
        <strong style={{ fontWeight: 600 }}>You're offline.</strong>{' '}
        <Link to="/library" className="underline" style={{ color: 'var(--accent)' }}>Library</Link>,{' '}
        <Link to="/map" className="underline" style={{ color: 'var(--accent)' }}>Study Map</Link>,{' '}
        <Link to="/timeline" className="underline" style={{ color: 'var(--accent)' }}>Chronicle</Link>{' '}
        and your cached decks still work. The question bank, mock tests and admin need a connection.
      </span>
    </div>
  );
}
