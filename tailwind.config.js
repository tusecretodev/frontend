/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        'dark': '#000000',
        'light': '#ffffff',
        'gray-dark': '#1a1a1a',
        'gray-medium': '#333333',
        'gray-light': '#666666',
      },
    },
  },
  plugins: [],
}