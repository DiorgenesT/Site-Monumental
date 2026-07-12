/** @type {import('tailwindcss').Config} */
export default {
  content: ['./*.html', './src/**/*.{js,html}'],
  theme: {
    extend: {
      colors: {
        bordo: {
          light: '#c23349',
          DEFAULT: '#9f1c2e',
          dark: '#7a1522',
        },
        ink: {
          50: '#f8f5f0',
          100: '#f0ebe1',
          200: '#e0d6c4',
          300: '#c7b89a',
          400: '#a89474',
          500: '#8a7558',
          600: '#6b5842',
          700: '#4d4030',
          800: '#302820',
          900: '#1c1712',
          950: '#100d0a',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        display: ['"Big Shoulders Display"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
