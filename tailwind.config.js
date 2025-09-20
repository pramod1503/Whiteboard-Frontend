/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  
  safelist: [
    'blob', 'b1', 'b2', 'b3', 'particle-grid', 'font-inter',
    'animate-float-slow', 'animate-float-medium', 'animate-float-fast', 'animate-float-reverse',
    'animate-float-particle', 'animate-grid-move', 'animate-gradient-flow', 'animate-gradient-flow-reverse',
    'animate-text-shimmer', 'animate-title-glow', 'animate-badge-glow', 'animate-hero-entrance',
    'animate-subtitle-fade', 'animate-stats-appear', 'animate-feature-slide', 'animate-card-entrance',
    'animate-footer-fade', 'animate-sparkle', 'animate-spin-slow', 'bg-300%', 'bg-grid-pattern',
    'bg-gradient-radial', 'rounded-4xl', 'shadow-3xl', 'border-3'
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      keyframes: {
        float1: {
          '0%': { transform: 'translateY(0) rotate(0deg) scale(1)' },
          '50%': { transform: 'translateY(18px) rotate(8deg) scale(1.05)' },
          '100%': { transform: 'translateY(0) rotate(0deg) scale(1)' },
        },
        float2: {
          '0%': { transform: 'translateY(0) rotate(-6deg) scale(1)' },
          '50%': { transform: 'translateY(-16px) rotate(6deg) scale(0.98)' },
          '100%': { transform: 'translateY(0) rotate(-6deg) scale(1)' },
        },
        float3: {
          '0%': { transform: 'translateY(0) rotate(0deg) scale(1)' },
          '50%': { transform: 'translateY(28px) rotate(-10deg) scale(1.08)' },
          '100%': { transform: 'translateY(0) rotate(0deg) scale(1)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg) scale(1)' },
          '25%': { transform: 'translateY(-20px) rotate(2deg) scale(1.05)' },
          '50%': { transform: 'translateY(-10px) rotate(-1deg) scale(1.02)' },
          '75%': { transform: 'translateY(-30px) rotate(1deg) scale(1.08)' },
        },
        'float-medium': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg) scale(1)' },
          '33%': { transform: 'translateY(-15px) rotate(-2deg) scale(0.98)' },
          '66%': { transform: 'translateY(-25px) rotate(3deg) scale(1.06)' },
        },
        'float-fast': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg) scale(1)' },
          '50%': { transform: 'translateY(-35px) rotate(-3deg) scale(1.1)' },
        },
        'float-reverse': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg) scale(1)' },
          '50%': { transform: 'translateY(20px) rotate(2deg) scale(0.95)' },
        },
        'float-particle': {
          '0%, 100%': { 
            transform: 'translateY(0px) translateX(0px) scale(1)',
            opacity: '0.3',
          },
          '25%': { 
            transform: 'translateY(-30px) translateX(10px) scale(1.2)',
            opacity: '0.8',
          },
          '50%': { 
            transform: 'translateY(-20px) translateX(-15px) scale(0.8)',
            opacity: '0.5',
          },
          '75%': { 
            transform: 'translateY(-40px) translateX(5px) scale(1.1)',
            opacity: '0.9',
          },
        },
        'grid-move': {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(20px, 20px)' },
        },
        'gradient-flow': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'gradient-flow-reverse': {
          '0%, 100%': { backgroundPosition: '100% 50%' },
          '50%': { backgroundPosition: '0% 50%' },
        },
        'text-shimmer': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'title-glow': {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        'badge-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(147, 51, 234, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(147, 51, 234, 0.6)' },
        },
        'hero-entrance': {
          '0%': {
            opacity: '0',
            transform: 'translateY(60px) scale(0.9)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0) scale(1)',
          },
        },
        'subtitle-fade': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'feature-slide': {
          '0%': {
            opacity: '0',
            transform: 'translateY(50px) rotateX(20deg)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0) rotateX(0deg)',
          },
        },
        'card-entrance': {
          '0%': {
            opacity: '0',
            transform: 'translateY(40px) scale(0.95)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0) scale(1)',
          },
        },
        'footer-fade': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'sparkle': {
          '0%, 100%': { transform: 'rotate(0deg) scale(1)' },
          '25%': { transform: 'rotate(90deg) scale(1.1)' },
          '50%': { transform: 'rotate(180deg) scale(0.9)' },
          '75%': { transform: 'rotate(270deg) scale(1.05)' },
        },
        'spin-slow': {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        float1: 'float1 12s ease-in-out infinite',
        float2: 'float2 10s ease-in-out infinite',
        float3: 'float3 14s ease-in-out infinite',
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'float-medium': 'float-medium 6s ease-in-out infinite',
        'float-fast': 'float-fast 4s ease-in-out infinite',
        'float-reverse': 'float-reverse 10s ease-in-out infinite',
        'float-particle': 'float-particle 12s ease-in-out infinite',
        'grid-move': 'grid-move 20s linear infinite',
        'gradient-flow': 'gradient-flow 6s ease infinite',
        'gradient-flow-reverse': 'gradient-flow-reverse 6s ease infinite',
        'text-shimmer': 'text-shimmer 3s ease-in-out infinite',
        'title-glow': 'title-glow 4s ease-in-out infinite',
        'badge-glow': 'badge-glow 3s ease-in-out infinite',
        'hero-entrance': 'hero-entrance 1.2s ease-out',
        'subtitle-fade': 'subtitle-fade 0.8s ease-out',
        'feature-slide': 'feature-slide 0.8s ease-out both',
        'card-entrance': 'card-entrance 1s ease-out both',
        'footer-fade': 'footer-fade 1s ease-out both',
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'spin-slow': 'spin-slow 3s linear infinite',
      },
      backgroundSize: {
        '300%': '300% 300%',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.25)',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
}