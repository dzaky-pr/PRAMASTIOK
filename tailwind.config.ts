import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        primary: ['Rubik', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: {
          // Customize it on globals.css :root
          50: 'rgb(var(--tw-color-primary-50) / <alpha-value>)',
          100: 'rgb(var(--tw-color-primary-100) / <alpha-value>)',
          200: 'rgb(var(--tw-color-primary-200) / <alpha-value>)',
          300: 'rgb(var(--tw-color-primary-300) / <alpha-value>)',
          400: 'rgb(var(--tw-color-primary-400) / <alpha-value>)',
          500: 'rgb(var(--tw-color-primary-500) / <alpha-value>)',
          600: 'rgb(var(--tw-color-primary-600) / <alpha-value>)',
          700: 'rgb(var(--tw-color-primary-700) / <alpha-value>)',
          800: 'rgb(var(--tw-color-primary-800) / <alpha-value>)',
          900: 'rgb(var(--tw-color-primary-900) / <alpha-value>)',
          950: 'rgb(var(--tw-color-primary-950) / <alpha-value>)',
        },

        darkGrey: {
          50: '#eeeeee',
          100: '#d4d6d6',
          200: '#b6bbbf',
          300: '#96a0a8',
          400: '#7f8b96',
          500: '#687885',
          600: '#5b6974',
          700: '#4b565e',
          800: '#3c4349', //primary
          900: '#2a2e32',
        },

        lightGrey: {
          50: '#fcfcfc',
          100: '#f7f7f7',
          200: '#f2f2f2',
          300: '#ebebeb',
          400: '#c9c9c9', //primary
          500: '#ababab',
          600: '#818181',
          700: '#6d6d6d',
          800: '#4d4d4d',
          900: '#2b2b2b',
        },

        orange: {
          50: '#fffee7',
          100: '#fefac2',
          200: '#fdf799',
          300: '#fbf26e',
          400: '#f9ee4a',
          500: '#f6e91e',
          600: '#ffde25', //primary
          700: '#ffc61a',
          800: '#fead0c',
          900: '#fd8200',
        },

        yellow: {
          50: '#fefee5',
          100: '#fdfbc0',
          200: '#fbf794',
          300: '#f8f366',
          400: '#f5ef3b',
          500: '#faf200', //primary
          600: '#fade00',
          700: '#fcc500',
          800: '#fdac00',
          900: '#fe7f00',
        },

        dark: '#222222',
      },
      keyframes: {
        flicker: {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': {
            opacity: '0.99',
            filter:
              'drop-shadow(0 0 1px rgba(252, 211, 77)) drop-shadow(0 0 15px rgba(245, 158, 11)) drop-shadow(0 0 1px rgba(252, 211, 77))',
          },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': {
            opacity: '0.4',
            filter: 'none',
          },
        },
        shimmer: {
          '0%': {
            backgroundPosition: '-700px 0',
          },
          '100%': {
            backgroundPosition: '700px 0',
          },
        },
      },
      animation: {
        flicker: 'flicker 3s linear infinite',
        shimmer: 'shimmer 1.3s linear infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
} satisfies Config;
