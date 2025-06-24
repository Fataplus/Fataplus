/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
    "./modules/**/*.vue",
    "./shared/**/*.vue",
    // Include Flowbite content
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      // Extend with Flowbite-compatible colors for our agricultural theme
      colors: {
        // Primary agricultural greens (maintaining our existing palette)
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',  // Our main green
          600: '#16a34a',  // Darker green
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        // Secondary orange (for accents)
        secondary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',  // Our main orange
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        }
      },
      // Extended spacing for agricultural data displays
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      // Agricultural-themed font families
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Inter', 'system-ui', 'sans-serif'],
      },
      // Enhanced shadows for cards and components
      boxShadow: {
        'agricultural': '0 4px 6px -1px rgba(22, 163, 74, 0.1), 0 2px 4px -1px rgba(22, 163, 74, 0.06)',
        'agricultural-lg': '0 10px 15px -3px rgba(22, 163, 74, 0.1), 0 4px 6px -2px rgba(22, 163, 74, 0.05)',
      }
    },
  },
  plugins: [
    // Add Flowbite plugin
    require('flowbite/plugin'),
    // Keep existing typography and forms plugins if needed
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
  // Flowbite configuration
  darkMode: 'class',
} 