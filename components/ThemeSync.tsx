import { useEffect } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import { colorScheme as nativeWindColorScheme } from 'nativewind';
import { useThemeStore } from '../store/themeStore';

// Expo Router's web static output prerenders in Node before any browser
// exists (see secureStorage.ts for the same concern) — there's no real
// scheme to apply there anyway, the client re-applies it once it mounts.
const isServer = typeof window === 'undefined';

/**
 * Drives NativeWind's colorScheme engine from the user's theme preference.
 * Mounted exactly ONCE at the app root (see app/_layout.tsx). useTheme()
 * only *reads* the resolved scheme — this is the single place allowed to
 * imperatively call NativeWind's colorScheme.set().
 *
 * That split matters: an earlier version ran this same effect inside
 * useTheme() itself, so every one of the many components calling that hook
 * fired its own colorScheme.set() call on every preference change. On
 * native, colorScheme.set() ultimately calls Appearance.setColorScheme(),
 * a real OS-level call that can itself trigger an Android uiMode
 * configuration change — and firing that redundantly, once per consumer,
 * appears to be what tore down the navigation tree mid-render ("Couldn't
 * find a navigation context"). One call per real change is both correct
 * and far safer than N calls for the same change.
 */
export function ThemeSync() {
  const preference = useThemeStore((state) => state.preference);
  const rawSystemScheme = useRNColorScheme();

  const effective = preference === 'system' ? (rawSystemScheme === 'dark' ? 'dark' : 'light') : preference;

  useEffect(() => {
    if (isServer) return;
    try {
      nativeWindColorScheme.set(effective);
    } catch (error) {
      // A failed override must never crash the app — worst case, the
      // requested scheme just doesn't visually apply on this runtime.
      if (__DEV__) {
        console.warn('[ThemeSync] Could not apply color scheme override:', error);
      }
    }
  }, [effective]);

  return null;
}
