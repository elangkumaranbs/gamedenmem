/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'game': ['Orbitron', 'sans-serif'],
        'pixel': ['"Press Start 2P"', 'cursive'],
        'cyber': ['Russo One', 'sans-serif'],
      },
      colors: {
        'cyber': {
          primary: '#4f46e5',
          secondary: '#7c3aed',
          accent: '#2563eb',
          dark: '#1f2937',
        }
      },
      boxShadow: {
        'neon': '0 0 5px rgba(79, 70, 229, 0.5), 0 0 10px rgba(79, 70, 229, 0.3)',
        'neon-hover': '0 0 10px rgba(79, 70, 229, 0.6), 0 0 20px rgba(79, 70, 229, 0.4)',
      },
      animation: {
        'cyber-pulse': 'cyber-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(-45deg, #4f46e5, #7c3aed, #2563eb, #4338ca)',
      }
    },
  },
  plugins: [],
};