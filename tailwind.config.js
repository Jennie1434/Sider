/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          DEFAULT: '#020617',
          950: '#0f172a',
        },
        business: {
          from: '#fef3c7',
          via: '#fde68a',
          to: '#fbbf24',
        },
        tech: {
          from: '#06b6d4',
          via: '#8b5cf6',
          to: '#6366f1',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      letterSpacing: {
        tightest: '-.075em',
      },
      animation: {
        'gradient-slow': 'gradient-shift 15s ease infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { transform: 'translate(0%, 0%) scale(1)' },
          '33%': { transform: 'translate(10%, 5%) scale(1.1)' },
          '66%': { transform: 'translate(-5%, 10%) scale(1.05)' },
        },
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(circle at center, rgba(255, 255, 255, 0.03) 0%, transparent 70%)',
        'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}

