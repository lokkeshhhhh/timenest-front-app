import { create } from 'zustand';

interface SplashState {
  /** True once the root animated splash overlay has fully faded out. */
  splashDone: boolean;
  setSplashDone: (done: boolean) => void;
}

// Separate from authStore on purpose: this is transient UI state (never
// persisted), not session state. Screens that mount underneath the splash
// use it to time their own entrance animation to when they're actually
// revealed, rather than to when they happen to mount (which is earlier,
// while still hidden behind the splash overlay).
export const useSplashStore = create<SplashState>((set) => ({
  splashDone: false,
  setSplashDone: (done) => set({ splashDone: done }),
}));
