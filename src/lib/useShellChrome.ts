import { useApp } from './store';
import { SHELL_STYLES } from './shellStyles';

/** 'map' = the Study Map screen; 'home' = every other route (Home, PYQ, Cards, Mind Maps). */
export function useHasDesktopChrome(routeKind: 'home' | 'map'): boolean {
  const shellStyle = useApp((s) => s.shellStyle);
  const cfg = SHELL_STYLES[shellStyle];
  return routeKind === 'map' ? cfg.map.rail || cfg.map.topBar : cfg.home.chrome !== 'none';
}
