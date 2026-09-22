import { hasCap, useAuthStore } from '@/lib/authStore';
import type { ApiUser } from '@/lib/mpscApi';
import { modules, type AppModule } from '@/modules/registry';

// ============================================
// Module visibility gate.
//
// Some modules hold personal material that shouldn't be browsable by a
// visitor — the MUDAL Interview Prep module contains the owner's own
// employment history, family details and self-assessed weaknesses.
//
// ⚠️ READ THIS BEFORE RELYING ON IT:
// This is an obscurity gate, NOT a security boundary. This app is a
// client-side SPA — every module's content is compiled into the JS bundle
// and is served to anyone who loads the site. Hiding a route here removes
// it from the menus and blocks the casual visitor who types /interview;
// it does NOT stop anyone who opens devtools or reads the bundle.
//
// For actual privacy the content has to stop being shipped to the browser:
// either move it behind the mpsc-api (which already has real auth), or
// keep it out of the deployed build entirely.
// ============================================

/** Usernames always treated as owner, independent of backend role. */
const OWNER_USERNAMES = ['gasey'];

export function isPrivileged(user: ApiUser | null): boolean {
  if (!user) return false;
  if (OWNER_USERNAMES.includes(user.username.toLowerCase())) return true;
  if (user.role === 'owner' || user.role === 'admin') return true;
  return hasCap(user, 'admin.stats');
}

/** Reactive version for components. */
export function useIsPrivileged(): boolean {
  const user = useAuthStore((s) => s.user);
  return isPrivileged(user);
}

/** The module list with admin-only entries removed for ordinary visitors. */
export function useVisibleModules(): AppModule[] {
  const privileged = useIsPrivileged();
  return privileged ? modules : modules.filter((m) => !m.adminOnly);
}
