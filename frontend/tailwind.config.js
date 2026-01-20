/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/App.{js,ts,tsx}', './src/components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset'), require('./nativecn-preset')],
  theme: {
    extend: {
      colors: {
        // Light mode colors (default)
        background: '#F6DBFA',
        surface: '#FFFFFF',
        primary: '#754ABF', //royal purple
        secondary: '#D48354',
        dark: '#200524',
        'text-primary': '#200524',
        'text-secondary': '#754ABF',

        // Dark mode colors
        'dark-background': '#200524',
        'dark-surface': '#2D1B3D',
        'dark-primary': '#A77ED6',
        'dark-secondary': '#E89B6E',
        'dark-text': '#F6DBFA',
        'dark-text-secondary': '#D4B8E0',
      },
    },
  },
  plugins: [],
};
