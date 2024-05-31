/** @type {import('tailwindcss').Config} */
module.exports = {
  mode : ['jit'],
  purge: {
    content : ["./src/**/*.{html,js}"],
    safelist: [
      'rotate-45',
      '-rotate-45',
      'absolute',
      'h-56'
    ]
  },
  theme: {
    extend: {
      animation: {
        fade: 'fadeOut 0.5s ease-in-out',
      },

      // that is actual animation
      keyframes: theme => ({
        fadeOut: {
          '0%': { opacity: 0.5 },
          '100%': { opacity: 1 },
        },
      }),
      fontFamily: {
        'open': ['Open Sans', 'sans-serif'],
        'noto': ['Noto Serif', 'serif'],
    }
  },
  plugins: [],
}
}