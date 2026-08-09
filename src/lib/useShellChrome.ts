/** There's only one shell now (the persistent Rail + AppHeader, always
 *  present on desktop) — this always returns true. Kept as a hook with
 *  the same signature so its ~10 existing call sites (which use the
 *  boolean to hide their own local back-link/switcher on desktop, since
 *  the global rail already has one) need zero changes. */
export function useHasDesktopChrome(_routeKind: 'home' | 'map'): boolean {
  return true;
}
