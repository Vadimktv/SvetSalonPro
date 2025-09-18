import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/data/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}'
  ],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: {
        '2xl': '1280px'
      }
    },
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#ec4899',
          foreground: '#ffffff'
        },
        secondary: {
          DEFAULT: '#9333ea',
          foreground: '#ffffff'
        },
        muted: {
          DEFAULT: '#f5f5f5',
          foreground: '#737373'
        },
        accent: {
          DEFAULT: '#fdf2f8',
          foreground: '#881337'
        },
        border: '#f1f5f9',
        input: '#e2e8f0',
        ring: '#ec4899'
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans]
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      },
      boxShadow: {
        floating: '0 30px 50px -20px rgba(236,72,153,0.25)'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle at top, rgba(236,72,153,0.2), transparent 60%)'
      }
    }
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/forms'), require('@tailwindcss/typography')]
};

export default config;
