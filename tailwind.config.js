const palette = require('./constants/paletteRaw');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // 'class' (not the default 'media') so the user's light/dark/system
  // preference — not just the raw OS media query — can actually drive every
  // `dark:` className. NativeWind's colorScheme.set('system'|'light'|'dark')
  // still follows the OS automatically for 'system'; 'class' only removes
  // the restriction that made 'light'/'dark' overrides impossible.
  darkMode: 'class',
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        serif: ['LibertinusSerif-Regular'],
        'serif-bold': ['LibertinusSerif-Bold'],
        'serif-semibold': ['LibertinusSerif-Semibold'],
        'serif-italic': ['LibertinusSerif-Italic'],
      },
      colors: {
        // Modern SaaS theme (Bento Grid / Vibrant Purple)
        // Real light/dark pairs come from constants/paletteRaw.js (the
        // single source of truth also used by hooks/useTheme.ts) so the
        // className tokens and the raw-JS lookups can never drift apart.
        background: palette.light.background,
        backgroundDark: palette.dark.background,
        surface: palette.light.surface,
        surfaceLight: palette.light.surface, // Compatibility alias
        surfaceGray: palette.light.surfaceGray,
        surfaceGrayDark: palette.dark.surfaceGray,

        primary: palette.light.primary,          // Deep wine/maroon — app-wide accent, same in both modes
        primaryDark: '#3C3B75',                  // Distinct legacy hero-gradient indigo — NOT a dark-mode pair of `primary`
        primaryLight: palette.light.primaryLight,
        primaryLightDark: palette.dark.primaryLight,

        // Text
        textOnDark: palette.dark.textOnSurface,
        textOnLight: palette.light.textOnSurface,
        textSecondaryDark: palette.dark.textSecondary,
        textSecondaryLight: palette.light.textSecondary,
        textMuted: '#9CA3AF',        // Placeholders — same tone reads fine on both surfaces

        // Borders
        border: '#F3F4F6',            // Extremely thin/light grey borders — dark screens pair this with border-white/10
        borderDark: '#E5E7EB',        // Input border shade in LIGHT mode — NOT a dark-mode pair of `border`

        // Status / Pastels
        success: palette.light.success,
        error: palette.light.error,
        errorBg: palette.light.errorBg,
        errorBgDark: palette.dark.errorBg,
        warning: palette.light.warning,
        warningBg: palette.light.warningBg,
        warningBgDark: palette.dark.warningBg,

        // Chart Accents (decorative, unthemed)
        chartPurple: '#5A57E6',
        chartBlue: '#4B70A7',
        chartGreen: '#9EC5AE',
        chartYellow: '#FBE8AD',
      },
      borderRadius: {
        card: '24px',       // Highly rounded bento cards (24px)
        input: '12px',      // subtle rounded corners for inputs (Image 1)
        button: '9999px',   // fully rounded pill for buttons (Image 7)
        otp: '12px',        // softly rounded OTP boxes (Image 12)
        icon: '9999px',     // circular social icons
      },
      fontSize: {
        heading: ['28px', { lineHeight: '34px', fontWeight: '700' }],
        subheading: ['20px', { lineHeight: '28px', fontWeight: '600' }],
        body: ['16px', { lineHeight: '24px', fontWeight: '400' }],
        label: ['14px', { lineHeight: '20px', fontWeight: '500' }],
        caption: ['12px', { lineHeight: '16px', fontWeight: '400' }],
      },
    },
  },
  plugins: [],
}
