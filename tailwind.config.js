/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          50: '#FFF9FA',
          100: '#FFF0F5',
          200: '#F8C8DC',
          300: '#E8A0BF',
          400: '#D47AE8',
          500: '#AD336D',
          600: '#8A2355',
          700: '#6B1B42',
        },
        priority: {
          high: '#AD336D',
          medium: '#E8A0BF',
          low: '#519E8A',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
