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
        // Primary brand — Uttarakhand emerald green ("Simply Heaven")
        forest: {
          50:  '#e7f5ef',
          100: '#c4e8d8',
          200: '#9bd6bd',
          300: '#67bf9b',
          400: '#33a87b',
          500: '#0d8a5f',
          600: '#00684a', // UTDB primary green
          700: '#075640',
          800: '#0a3f30',
          900: '#072a20', // deep emerald — navbar / footer / dark sections
        },
        // Warm saffron / marigold accent (Himalayan sunset, festive)
        terra: {
          50:  '#fdf4e7',
          100: '#fbe4c3',
          200: '#f6c987',
          300: '#f0ad4b',
          400: '#ea9b27',
          500: '#e0891e', // primary accent / CTA
          600: '#c2740f',
          700: '#9a5a0d',
        },
        // Sky blue secondary (logo bird, Char Dham)
        sky: {
          400: '#34c3f2',
          500: '#00aeef',
          600: '#0090c7',
        },
        // Golden highlight
        gold: {
          400: '#ffce54',
          500: '#f4b400',
        },
        cream: {
          50:  '#fefdfb',
          100: '#f8f7f1', // warm page background
          200: '#efece1',
          300: '#e3ddcb',
        },
      },
      fontFamily: {
        sans:    ['"Space Grotesk"', 'system-ui', 'Segoe UI', 'sans-serif'],
        display: ['"Bebas Neue"', '"Space Grotesk"', 'sans-serif'],
        script:  ['"Caveat"', 'cursive'],
      },
      boxShadow: {
        soft:    '0 4px 20px -4px rgba(7, 42, 32, 0.12)',
        card:    '0 6px 28px -8px rgba(7, 42, 32, 0.18)',
        glow:    '0 0 0 4px rgba(0, 104, 74, 0.12)',
      },
      borderRadius: {
        '2xl': '1.1rem',
        '3xl': '1.6rem',
      },
      backgroundImage: {
        'hero-overlay': 'linear-gradient(100deg, rgba(7,42,32,0.92) 0%, rgba(0,104,74,0.72) 42%, rgba(0,104,74,0.10) 100%)',
        'forest-gradient': 'linear-gradient(135deg, #072a20 0%, #00684a 100%)',
        'saffron-gradient': 'linear-gradient(135deg, #e0891e 0%, #f4b400 100%)',
      },
      keyframes: {
        'fade-up':   { '0%': { opacity: 0, transform: 'translateY(18px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        'fade-in':   { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        'float':     { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        'shimmer':   { '100%': { transform: 'translateX(100%)' } },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        'fade-in': 'fade-in 0.5s ease-out both',
        'float':   'float 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
