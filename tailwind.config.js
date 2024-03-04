/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: 'var(--sans-font-family)',
        serif: 'var(--serif-font-family)',
        display: 'var(--display-font-family)',
      },
      colors: {
        transparent: 'transparent',
        white: 'var(--white-color)',
        black: 'var(--black-color)',
        grey: {
          DEFAULT: 'var(--grey-color-100)',
          900: 'var(--grey-color-900)',
          800: 'var(--grey-color-800)',
          700: 'var(--grey-color-700)',
          600: 'var(--grey-color-600)',
          500: 'var(--grey-color-500)',
          400: 'var(--grey-color-400)',
          300: 'var(--grey-color-300)',
          200: 'var(--grey-color-200)',
          100: 'var(--grey-color-100)',
          50: 'var(--grey-color-50)',
        },
        error: {
          DEFAULT: 'var(--error-color)',
        },
        warning: {
          DEFAULT: 'var(--warning-color)',
        },
        success: {
          DEFAULT: 'var(--success-color)',
        },
        info: {
          DEFAULT: 'var(--info-color)',
        },
      },
    },
  },
  plugins: [],
}
