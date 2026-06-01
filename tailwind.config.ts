import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Soft & earthy palette
        cream: {
          50: '#FBF8F2',
          100: '#F5EFE3',
          200: '#EBE2D0',
        },
        sage: {
          100: '#E3EADD',
          200: '#C7D6BC',
          300: '#A6BE97',
          400: '#85A574',
          500: '#6B8B5C',
          600: '#54704A',
          700: '#41573A',
        },
        clay: {
          100: '#EFDCCF',
          200: '#E0C2AC',
          300: '#CDA084',
          400: '#B98364',
          500: '#A66B4C',
        },
        bark: {
          400: '#8A7766',
          600: '#5E4F42',
          800: '#3A302881',
          900: '#2C2520',
        },
      },
      fontFamily: {
        sans: ['"Nunito"', 'system-ui', 'sans-serif'],
        serif: ['"Fraunces"', 'Georgia', 'serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        soft: '0 8px 30px -8px rgba(94, 79, 66, 0.18)',
        'soft-lg': '0 20px 50px -12px rgba(94, 79, 66, 0.25)',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.06)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        breathe: 'breathe 6s ease-in-out infinite',
        float: 'float 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
