/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      colors: {
        brand: {
          50:'#eff6ff', 100:'#dbeafe', 200:'#bfdbfe', 300:'#93c5fd',
          400:'#60a5fa', 500:'#3b82f6', 600:'#2563eb', 700:'#1d4ed8',
          800:'#1e40af', 900:'#1e3a8a',
        },
        cream: {
          50:'#fdfcfb', 100:'#f8f6f2', 200:'#f0ece4', 300:'#e4ddd1', 400:'#ccc3b4',
        },
        ink: {
          900:'#1a1814', 800:'#2d2a24', 700:'#4a4640', 600:'#6b6760',
          500:'#8c8880', 400:'#b0aca5',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.35s ease-out',
        'shimmer': 'shimmer 1.8s linear infinite',
      },
      keyframes: {
        fadeIn: { '0%':{opacity:'0'}, '100%':{opacity:'1'} },
        slideUp: { '0%':{opacity:'0',transform:'translateY(16px)'}, '100%':{opacity:'1',transform:'translateY(0)'} },
        shimmer: { '0%':{backgroundPosition:'-200% 0'}, '100%':{backgroundPosition:'200% 0'} },
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.10), 0 8px 24px rgba(0,0,0,0.06)',
      }
    },
  },
  plugins: [],
}
