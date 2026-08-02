import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { secureAuthStorage } from './secureStorage';
import { isTokenExpired } from '../utils/jwt';

interface AuthState {
  user: any;
  token: string | null;
  tempToken: string | null;
  tempWorkspaces: any[];
  hasSeenOnboarding: boolean;
  /** True once the persisted state has been read back from storage on this launch. */
  hydrated: boolean;
  setAuth: (token: string, user: any) => void;
  setTempAuth: (tempToken: string, workspaces: any[]) => void;
  clearTempAuth: () => void;
  logout: () => void;
  setHasSeenOnboarding: (seen: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      tempToken: null,
      tempWorkspaces: [],
      hasSeenOnboarding: false,
      hydrated: false,
      setAuth: (token, user) => set({ token, user }),
      setTempAuth: (tempToken, workspaces) => set({ tempToken, tempWorkspaces: workspaces }),
      clearTempAuth: () => set({ tempToken: null, tempWorkspaces: [] }),
      logout: () => set({ user: null, token: null, tempToken: null, tempWorkspaces: [] }),
      setHasSeenOnboarding: (seen) => set({ hasSeenOnboarding: seen }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => secureAuthStorage),
      // `hydrated` is a runtime-only flag, not something to round-trip through storage.
      partialize: (state) => {
        const { hydrated, ...rest } = state;
        return rest;
      },
      onRehydrateStorage: () => (state, error) => {
        if (error || !state) {
          useAuthStore.setState({ hydrated: true });
          return;
        }
        if (state.token && isTokenExpired(state.token)) {
          useAuthStore.setState({ token: null, user: null, hydrated: true });
        } else {
          useAuthStore.setState({ hydrated: true });
        }
      },
    }
  )
);
