/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        // New color palette
        forest: {
          50: '#f0f9f4',
          100: '#dcf4e6',
          200: '#bce8d1',
          300: '#8dd5b3',
          400: '#56bc8e',
          500: '#2E7D48', // Main forest green
          600: '#256640',
          700: '#1f5235',
          800: '#1c422c',
          900: '#183725',
        },
        gold: {
          50: '#fefbf0',
          100: '#fef6e0',
          200: '#fdebc0',
          300: '#fbdc95',
          400: '#F4C542', // Updated Warm Mustard Yellow
          500: '#f1b429',
          600: '#e89611',
          700: '#c17510',
          800: '#9b5d14',
          900: '#7e4d15',
        },
        // UI colors
        charcoal: '#2B2B2B',
        'soft-black': '#1C1C1C',
        'light-gray': '#F5F5F5',
        
        // Keep some legacy colors for compatibility but update values
        adventure: {
          50: '#f0f9f4',
          100: '#dcf4e6',
          200: '#bce8d1',
          300: '#8dd5b3',
          400: '#56bc8e',
          500: '#2E7D48',
          600: '#256640',
          700: '#1f5235',
          800: '#1c422c',
          900: '#183725',
        },
        wanderlust: {
          50: '#fefbf0',
          100: '#fef6e0',
          200: '#fdebc0',
          300: '#fbdc95',
          400: '#F4C542',
          500: '#f1b429',
          600: '#e89611',
          700: '#c17510',
          800: '#9b5d14',
          900: '#7e4d15',
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'bounce-gentle': 'bounce-gentle 2s infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
    },
  },
  plugins: [],
}