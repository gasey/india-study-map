import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { useApp, useHasHydrated, type MindsetCheckIn } from '@/lib/store';
import { messageFor } from '@/lib/mindsetMessages';

const CHECK_INS: { key: MindsetCheckIn; label: string }[] = [
  { key: 'calm', label: 'Calm' },
  { key: 'scattered', label: 'Scattered' },
  { key: 'avoiding', label: 'Avoiding' },
  { key: 'confused', label: 'Confused' },
];

/** Home dashboard's "Return to Learning" card — the daily entry point into
 *  the mindset system. Deliberately the quietest card on the page: no
 *  gradient, no urgency color, no streak number. Shows at most once per
 *  day, gated by preferred hour / quiet days, and a plain "Not today"
 *  dismisses it with zero penalty (no missed-day tracking anywhere). */
export function DailyLearningReset() {
  const navigate = useNavigate();
  const hydrated = useHasHydrated();
  const mindset = useApp((s) => s.mindset);
  const dismissToday = useApp((s) => s.dismissMindsetToday);
  const setCheckIn = useApp((s) => s.setMindsetCheckIn);
  const bumpMessage = useApp((s) => s.bumpMindsetMessage);

  const today = useMemo(() => new Date(), []);
  const todayStr = today.toDateString();
  const weekday = today.getDay();

  const shouldShow =
    hydrated &&
    mindset.enabled &&
    mindset.lastDismissedDay !== todayStr &&
    !mindset.quietDays.includes(weekday) &&
    today.getHours() >= mindset.preferredHour;

  const checkInToday = mindset.lastCheckInDay === todayStr ? mindset.lastCheckIn : null;

  // Advance the message rotation once, the first time the card renders
  // "fresh" today (no check-in yet) — not on every re-render.
  useEffect(() => {
    if (shouldShow && !checkInToday && mindset.lastShownMessageIdx < 0) {
      bumpMessage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldShow]);

  if (!shouldShow) return null;

  const message = messageFor(checkInToday, mindset.lastShownMessageIdx);

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-[10px] tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
          Return to learning
        </span>
        <button
          onClick={dismissToday}
          className="text-[11px] shrink-0"
          style={{ color: 'var(--text-muted)' }}
        >
          Not today
        </button>
      </div>

      <p className="text-[15px] leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-primary)' }}>
        {message}
      </p>

      {!checkInToday && (
        <div className="flex flex-col gap-2">
          <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
            How does studying feel right now?
          </span>
          <div className="flex gap-2 flex-wrap">
            {CHECK_INS.map((c) => (
              <button
                key={c.key}
                onClick={() => setCheckIn(c.key)}
                className="px-3 py-1.5 rounded-full text-[12px]"
                style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <button
          onClick={() => navigate('/mindset')}
          className="px-4 py-2 rounded-lg text-[13px] font-medium"
          style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}
        >
          Sit With It — 2 min
        </button>
      </div>
    </div>
  );
}
