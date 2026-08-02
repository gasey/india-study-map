import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as api from './mpscApi';
import type { ApiUser } from './mpscApi';

interface AuthState {
  token: string | null;
  user: ApiUser | null;
  loginError: string | null;
  loggingIn: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      loginError: null,
      loggingIn: false,
      login: async (username, password) => {
        set({ loggingIn: true, loginError: null });
        try {
          const { token, user } = await api.login(username, password);
          api.setApiToken(token);
          set({ token, user, loggingIn: false });
          return true;
        } catch (e) {
          set({ loginError: e instanceof Error ? e.message : 'Login failed', loggingIn: false });
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
        if (state?.token) api.setApiToken(state.token);
      },
    },
  ),
);
