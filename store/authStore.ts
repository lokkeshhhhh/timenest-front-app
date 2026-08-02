import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  user: any;
  token: string | null;
  tempToken: string | null;
  tempWorkspaces: any[];
  hasSeenOnboarding: boolean;
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
      setAuth: (token, user) => set({ token, user }),
      setTempAuth: (tempToken, workspaces) => set({ tempToken, tempWorkspaces: workspaces }),
      clearTempAuth: () => set({ tempToken: null, tempWorkspaces: [] }),
      logout: () => set({ user: null, token: null, tempToken: null, tempWorkspaces: [] }),
      setHasSeenOnboarding: (seen) => set({ hasSeenOnboarding: seen }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
