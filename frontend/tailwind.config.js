/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        meesho: {
          pink: '#f43397',
          lightpink: '#fce5f1',
          gray: '#f9f9f9',
          darkgray: '#333333',
          text: '#333333',
          border: '#e8e8e8',
          footer: '#f9f9f9',
          success: '#038d63'
        }
      },
      fontFamily: {
        sans: ['Mier Book', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['Mier Bold', 'Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'card': '0 1px 8px rgba(0, 0, 0, 0.1)',
        'nav': '0 2px 8px rgba(0, 0, 0, 0.08)'
      }
    },
  },
  plugins: [],
}
