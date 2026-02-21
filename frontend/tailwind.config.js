/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#fff7ed',
          100: '#ffedd5',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
        },
        dark: {
          900: '#0a0c10',
          800: '#0f1218',
          700: '#161b24',
          600: '#1e2535',
          500: '#26304a',
          400: '#3d4d6a',
          300: '#8896b0',
        }
      }
    },
  },
  plugins: [],
}
