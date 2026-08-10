import { useEffect, useState } from 'react';

// ============================================
// useOnline — a real connectivity signal, not a decorative one.
//
// Backed by navigator.onLine plus the browser's own 'online'/'offline'
// events. This is genuinely cheap and real: the OfflineBanner (and any future
// consumer) reacts to actual loss of network, which matters because almost
// everything data-driven here (question bank, mock tests, admin) needs a live
// call to api.map.hawayu.in, while the Library / Study Map / Chronicle /
// cached decks keep working offline.
//
// navigator.onLine is conservative — it can report "online" on a captive
// portal or a dead uplink — so this is a helpful hint, never a guarantee. The
// per-request catch() paths in the data hooks remain the real safety net.
// ============================================

export function useOnline(): boolean {
  const [online, setOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  );

  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener('online', up);
    window.addEventListener('offline', down);
    return () => {
      window.removeEventListener('online', up);
      window.removeEventListener('offline', down);
    };
  }, []);

  return online;
}
