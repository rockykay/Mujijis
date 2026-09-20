/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#f5f0e7',
        paper: '#faf7f0',
        cream: '#eee5d6',
        'warm-gray': '#8b8177',
        'dark-brown': '#51483f',
        'muted-brown': '#76695d',
        gold: '#b08a43',
        line: 'rgba(95, 82, 69, 0.18)',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        script: ['"Great Vibes"', 'cursive'],
        body: ['Jost', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        invite: '30rem',
      },
      letterSpacing: {
        invitation: '0.32em',
      },
    },
  },
  plugins: [],
};
