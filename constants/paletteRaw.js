/**
 * Single source of truth for every color token that has a real light/dark
 * pair. Two consumers:
 *  - tailwind.config.js requires this directly (plain Node/CJS) to build
 *    the `colors` theme extension behind every `bg-*`/`text-*`/`border-*`
 *    className token.
 *  - hooks/useTheme.ts imports the same file for the smaller set of cases
 *    that need a raw hex string instead of a className (FontAwesome `color`
 *    props, React Navigation's theme, tab bar backgrounds).
 * Keeping one file means the two can never drift apart.
 *
 * NOT every existing tailwind token belongs here — a few (`primaryDark`,
 * `borderDark`, the chart colors) are distinct brand/decorative colors that
 * happen to share a name pattern but aren't actually a light/dark pair of
 * anything. Those stay as plain literals in tailwind.config.js. See the
 * comments there.
 */
module.exports = {
  light: {
    background: '#F4F6FA',
    surface: '#FFFFFF',
    surfaceGray: '#F5F7FB',
    primary: '#3D2834',
    primaryLight: '#F0EEFF',
    textOnSurface: '#1E2229',
    textSecondary: '#8FA0B5',
    success: '#10B981',
    error: '#FF5C5C',
    errorBg: '#FFEFEF',
    warning: '#FFAB2E',
    warningBg: '#FFF6E9',
  },
  dark: {
    background: '#0A0A0A',
    surface: '#151515',
    surfaceGray: '#1C1C1E',
    primary: '#3D2834',
    primaryLight: '#2A2530',
    textOnSurface: '#FFFFFF',
    textSecondary: '#E2E8F0',
    success: '#10B981',
    error: '#FF5C5C',
    errorBg: '#3A1F1F',
    warning: '#FFAB2E',
    warningBg: '#3A311F',
  },
};
