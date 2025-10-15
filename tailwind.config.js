/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        saffron: '#ff6f00',
        maroon: '#7a0f10',
        gold: '#d4af37',
        deeporange: '#ff6f00',
        cream: '#fff7f0'
      },
      boxShadow: {
        card: '0 6px 18px rgba(122,15,16,0.08)'
      }
    }
  },
  plugins: []
}
