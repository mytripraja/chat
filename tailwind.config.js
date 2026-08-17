/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#FF6B00',
          red: '#E31837',
          yellow: '#FFC107',
          green: '#2E7D32',
          cream: '#FFF8F0',
          dark: '#1A1A2E',
        },
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
