/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Match original app color scheme
        primary: {
          DEFAULT: '#10b981',
          light: '#34d399',
          dark: '#059669',
        },
        surface: {
          light: '#f5f5f5',
          dark: '#1e293b',
        },
        background: {
          light: '#ffffff',
          dark: '#0f172a',
        },
        // Category colors from original app
        breakfast: '#f59e0b',
        lunch: '#3b82f6',
        dinner: '#8b5cf6',
        snack: '#ec4899',
        // Workout category colors
        strength: '#ef4444',
        cardio: '#f97316',
        flexibility: '#10b981',
        skill: '#6366f1',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
    },
  },
  plugins: [],
}
