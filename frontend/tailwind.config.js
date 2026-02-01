/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#CCFBF1',
          300: '#5EEAD4',
          500: '#14B8A6',
          700: '#0F766E',
          900: '#064E3B',
          DEFAULT: '#14B8A6',
        },
        neutral: {
          100: '#F9FAFB',
          300: '#D1D5DB',
          500: '#6B7280',
          700: '#374151',
          900: '#111827',
        },
        status: {
          reported: '#EF4444',   // Red
          inprogress: '#F59E0B', // Amber
          assigned: '#3B82F6',   // Blue
          resolved: '#22C55E',   // Green
          rejected: '#6B7280',   // Gray
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['DM Sans', 'sans-serif'],
        mono: ['Space Grotesk', 'monospace'],
      },
    },
  },
  plugins: [],
}
