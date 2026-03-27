/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.jsx",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(221.2 83.2% 53.3%)',
          foreground: 'hsl(210 40% 98%)',
        },
        brand: {
          50: '#faffe5',
          100: '#f3ffc6',
          200: '#e6ff93',
          300: '#d2ff55',
          400: '#baf91c',
          500: '#9de002',
          600: '#79b300',
          700: '#5b8803',
          800: '#496b09',
          900: '#3e5a0d',
          950: '#1f3201',
        },
      },
      animation: {
        shine: "shine 2s ease-in-out infinite",
        pulse: "pulse 4s ease-in-out infinite",
      },
      keyframes: {
        shine: {
          "0%": { transform: "translateX(-150%) skewX(-12deg)" },
          "100%": { transform: "translateX(150%) skewX(-12deg)" },
        },
      },
    },
  },
  plugins: [],
}
