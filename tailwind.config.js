/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f2f7f4',
          100: '#e3eee7',
          200: '#c5dcd0',
          300: '#9ec4b1',
          400: '#6ea68c',
          500: '#48876c',
          600: '#346b54',
          700: '#285442',
          800: '#1b4334',
          850: '#163c2f',
          900: '#123428',
          950: '#0a1e17',
        },
        brand: {
          50: '#f2f7f4',
          100: '#e3eee7',
          200: '#c5dcd0',
          300: '#9ec4b1',
          400: '#6ea68c',
          500: '#48876c',
          600: '#346b54',
          700: '#1b4334',
          800: '#163c2f',
          900: '#123428',
          950: '#0a1e17',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0.375rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}


