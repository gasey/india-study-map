import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as api from './mpscApi';
import type { ApiUser } from './mpscApi';

interface AuthState {
  token: string | null;
  user: ApiUser | null;
  loginError: string | null;
  loggingIn: boolean;
  signupError: string | null;
  signingUp: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string, displayName?: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      loginError: null,
      loggingIn: false,
      signupError: null,
      signingUp: false,
      login: async (username, password) => {
        set({ loggingIn: true, loginError: null });
        try {
          const { token, user } = await api.login(username, password);
          api.setApiToken(token);
          set({ token, user, loggingIn: false });
          // /api/auth/login doesn't return capabilities[] — fetch it
          // separately so role-gated UI has it immediately, not just
          // after the next page load's rehydrate refresh.
          api.me().then((fresh) => set({ user: fresh })).catch(() => {});
          return true;
        } catch (e) {
          set({ loginError: e instanceof Error ? e.message : 'Login failed', loggingIn: false });
          return false;
        }
      },
      signup: async (username, password, displayName) => {
        set({ signingUp: true, signupError: null });
        try {
          const { token, user } = await api.signup(username, password, displayName);
          api.setApiToken(token);
          set({ token, user, signingUp: false });
          api.me().then((fresh) => set({ user: fresh })).catch(() => {});
          return true;
        } catch (e) {
          set({ signupError: e instanceof Error ? e.message : 'Signup failed', signingUp: false });
          return false;
        }
      },
      logout: () => {
        api.setApiToken(null);
        set({ token: null, user: null });
      },
    }),
    {
      name: 'mpsc-auth',
      onRehydrateStorage: () => (state) => {
        // Re-hydrate the module-level token in mpscApi.ts after persist restores it.
        if (state?.token) {
          api.setApiToken(state.token);
          // Refresh from /me: picks up capabilities[] for sessions
          // persisted before it existed, and any role change made
          // server-side since this session's last login.
          api.me().then((fresh) => useAuthStore.setState({ user: fresh })).catch(() => {});
        }
      },
    },
  ),
);

/** Rank-additive capability check — mirrors the backend's has_cap(). */
export function hasCap(user: ApiUser | null, cap: string): boolean {
  return !!user?.capabilities?.includes(cap);
}
