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
      colors: {
        'teal-custom': "#209765",
        'bright-pink': "#EA526F",
        'champagne-pink': "#FCEADE",
        'coral': "#FF8A5B",
        'violet': '#4B1D3F',
      },
      animation: {
        fade: 'fadeOut 0.5s ease-in-out',
      },

      keyframes: theme => ({
        fadeOut: {
          '0%': { opacity: 0.5 },
          '100%': { opacity: 1 },
        },
      }),
      fontFamily: {
        'open': ['Open Sans', 'sans-serif'],
        'noto': ['Noto Serif', 'serif'],
        'source-sans': ['Source Sans 3', 'sans-serif'],
        'archivo': ["Archivo", 'sans-serif'],
        'julius': ["Julius Sans One", 'sans-serif'],
        'league': ["League Gothic", 'sans-serif'],
        'sifonn': ["Sifonn", 'sans-serif'],
    }
    
  },
  
  plugins: [],
}
}