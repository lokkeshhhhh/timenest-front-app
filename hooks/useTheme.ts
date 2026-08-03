import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import { useThemeStore, ThemePreference } from '../store/themeStore';
import paletteRaw from '../constants/paletteRaw';

export type { ThemePreference };

export type ResolvedScheme = 'light' | 'dark';

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceGray: string;
  primary: string;
  primaryLight: string;
  textOnSurface: string;
  textSecondary: string;
  success: string;
  error: string;
  errorBg: string;
  warning: string;
  warningBg: string;
}

const palette = paletteRaw as Record<ResolvedScheme, ThemeColors>;

export interface UseThemeResult {
  /** The scheme actually in effect right now — always 'light' or 'dark', never 'system'. */
  scheme: ResolvedScheme;
  /** The user's raw preference, including 'system' — what the Settings toggle should show as selected. */
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  /** Raw hex colors for the resolved scheme — for the cases a className can't reach (icon `color` props, nav theme, tab bar). */
  colors: ThemeColors;
}

/**
 * The single source of truth for theme in this app. Every component that
 * needs to know light vs. dark — to pick a raw color or to read the user's
 * preference — should call this hook instead of React Native's
 * `useColorScheme()` directly.
 *
 * This hook only *reads* state — resolving the user's preference against
 * the live OS scheme and imperatively driving NativeWind's colorScheme
 * engine is `<ThemeSync />`'s job (mounted once at the app root). Keeping
 * that write confined to one place, instead of one per consumer of this
 * hook, avoids redundant native calls — see ThemeSync.tsx for why that
 * matters.
 */
export function useTheme(): UseThemeResult {
  const preference = useThemeStore((state) => state.preference);
  const setPreference = useThemeStore((state) => state.setPreference);
  const { colorScheme } = useNativeWindColorScheme();
  const scheme: ResolvedScheme = colorScheme === 'dark' ? 'dark' : 'light';

  return {
    scheme,
    preference,
    setPreference,
    colors: palette[scheme],
  };
}
