/** @type {import('tailwindcss').Config} */
module.exports = {
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
        background: '#F4F6FA',       // Light lavender-grey canvas
        surface: '#FFFFFF',          // Pure white cards
        surfaceLight: '#FFFFFF',     // Compatibility alias
        surfaceGray: '#F5F7FB',      // Subtle off-white for inputs/inactive states
        
        primary: '#4C49ED',          // Vibrant purple for buttons/actions
        primaryDark: '#3C3B75',      // Deep indigo for headers
        primaryLight: '#F0EEFF',     // Lavender pastel for pills/active states

        // Text
        textOnDark: '#FFFFFF',       // White text on primary/dark buttons
        textOnLight: '#1E2229',      // Dark charcoal for main text
        textSecondaryDark: '#E2E8F0', // Muted text on dark panels
        textSecondaryLight: '#8FA0B5', // Muted blue-grey for secondary text
        textMuted: '#9CA3AF',        // Placeholders

        // Borders
        border: '#F3F4F6',           // Extremely thin/light grey borders
        borderDark: '#E5E7EB',       // Slightly darker for inputs

        // Status / Pastels
        success: '#10B981',
        error: '#FF5C5C',
        errorBg: '#FFEFEF',
        warning: '#FFAB2E',
        warningBg: '#FFF6E9',

        // Chart Accents
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
