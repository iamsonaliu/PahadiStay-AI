/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  // ↓ REQUIRED for dark mode via CSS class (.dark on <html>)
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        forest: {
          50:  '#f0f7f3',
          100: '#d9ede2',
          700: '#2d6a4f',
          800: '#1f4e37',
          900: '#1a3a2a',
        },
        cream: {
          50:  '#fefcf8',
          100: '#f5f0e8',
          200: '#ede4d3',
        },
        terra: {
          500: '#c4622d',
          600: '#a84f22',
        },
      },
      fontFamily: {
        sans: ['system-ui', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}