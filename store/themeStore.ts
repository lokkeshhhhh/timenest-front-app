import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemePreference = 'system' | 'light' | 'dark';

interface ThemeState {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
}

/**
 * Holds only the user's raw preference, persisted across restarts. Actually
 * driving NativeWind's colorScheme engine from this preference (resolving
 * 'system' against the live OS scheme) is hooks/useTheme.ts's job — that
 * needs a live, reactive read of the OS scheme, which only works from
 * inside a React hook, not from this store's plain actions.
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      preference: 'system',
      setPreference: (preference) => set({ preference }),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
