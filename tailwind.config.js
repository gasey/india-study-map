/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Inter Tight"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Warm, paper-like neutrals for a calm study feel
        parchment: {
          50: '#fbf8f3',
          100: '#f6f1e7',
          200: '#ebe2cf',
          300: '#dcceae',
          400: '#c8b485',
          500: '#b29862',
          600: '#967c4c',
          700: '#75603c',
          800: '#574731',
          900: '#3d3324',
        },
        ink: {
          50: '#f6f6f5',
          100: '#e7e7e5',
          200: '#cbcbc8',
          300: '#a4a4a0',
          400: '#7c7c77',
          500: '#5e5e59',
          600: '#454541',
          700: '#33332f',
          800: '#22221f',
          900: '#161614',
        },
        accent: {
          // Muted teal — for active layers, selected state
          DEFAULT: '#3a7a7a',
          light: '#5fa5a5',
          dark: '#264f4f',
        },
        warn: '#c46a3d', // Burnt orange for warm-region highlights
      },
      transitionTimingFunction: {
        'out-soft': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
