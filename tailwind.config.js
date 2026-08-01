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
        // Core dark theme (sampled from Image 1 — Arcana login)
        background: '#0A0A0A',       // near-black main background
        surface: '#1A1A1A',          // slightly lighter for cards on dark
        surfaceLight: '#FFFFFF',     // white form panels / light cards
        surfaceGray: '#F5F5F5',     // very subtle off-white for input fills on white cards

        // Text — dual tokens for dark/light surfaces
        textOnDark: '#FAFAFA',       // near-white on dark backgrounds
        textOnLight: '#1A1A1A',      // near-black on white surfaces
        textSecondaryDark: '#8A8A8A', // muted gray on dark
        textSecondaryLight: '#6B7280', // muted gray on light
        textMuted: '#9CA3AF',         // placeholders everywhere

        // Borders
        border: '#E5E7EB',           // light surface borders
        borderDark: '#2A2A2A',       // dark surface borders

        // Status (functional only — never decorative)
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',

        // Data-viz accents (for future dashboard — not used in auth)
        chartPurple: '#7C3AED',
        chartBlue: '#3B82F6',
        chartOrange: '#F59E0B',
        chartGreen: '#10B981',
        chartTeal: '#06B6D4',
      },
      borderRadius: {
        card: '20px',       // moderate radius for auth cards (Image 1)
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
