/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: '#F8F5F0',
        primary: '#2A211D',
        accent: '#B99A6B',
        secondary: '#EDE3D8',
        body: '#756A61',
        highlight: '#B98282',
      },
      fontFamily: {
        serif: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      borderRadius: { '4xl': '2rem', '5xl': '2.5rem' },
      boxShadow: {
        // Layered shadows give cards real depth instead of one flat blur.
        soft: '0 1px 2px rgba(42,33,29,0.05), 0 8px 24px rgba(42,33,29,0.08)',
        lift: '0 2px 4px rgba(42,33,29,0.05), 0 18px 40px rgba(42,33,29,0.14), 0 40px 80px rgba(42,33,29,0.10)',
        '3d': '0 1px 1px rgba(42,33,29,0.06), 0 4px 8px rgba(42,33,29,0.06), 0 16px 32px rgba(42,33,29,0.10), 0 32px 64px rgba(42,33,29,0.10)',
        glow: '0 0 0 1px rgba(185,154,107,0.45), 0 12px 40px rgba(185,154,107,0.35)',
        btn: '0 1px 0 rgba(255,255,255,0.22) inset, 0 -2px 0 rgba(0,0,0,0.25) inset, 0 10px 24px rgba(42,33,29,0.28)',
      },
      backgroundImage: {
        'gold-cta': 'linear-gradient(135deg, #2A211D 0%, #4a3a30 55%, #B99A6B 160%)',
        'gold-sheen': 'linear-gradient(120deg, #B99A6B 0%, #E3CFA6 45%, #B99A6B 100%)',
        blush: 'radial-gradient(60% 60% at 80% 20%, rgba(185,130,130,0.22), transparent 70%), radial-gradient(50% 50% at 10% 90%, rgba(185,154,107,0.22), transparent 70%)',
      },
      keyframes: {
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        'marquee-y': { from: { transform: 'translateY(0)' }, to: { transform: 'translateY(-50%)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-14px)' } },
        'float-slow': { '0%,100%': { transform: 'translateY(0) rotate(0deg)' }, '50%': { transform: 'translateY(-22px) rotate(4deg)' } },
        'spin-slow': { to: { transform: 'rotate(360deg)' } },
        morph: { '0%,100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }, '50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' } },
        'mesh-a': { '0%,100%': { transform: 'translate(0,0) scale(1)' }, '50%': { transform: 'translate(12%,8%) scale(1.25)' } },
        'mesh-b': { '0%,100%': { transform: 'translate(0,0) scale(1.1)' }, '50%': { transform: 'translate(-14%,-6%) scale(0.9)' } },
        'gradient-pan': { '0%,100%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' } },
        'scroll-cue': { '0%': { transform: 'scaleY(0)', transformOrigin: 'top' }, '50%': { transform: 'scaleY(1)', transformOrigin: 'top' }, '51%': { transform: 'scaleY(1)', transformOrigin: 'bottom' }, '100%': { transform: 'scaleY(0)', transformOrigin: 'bottom' } },
        sheen: { '0%': { transform: 'translateX(-150%) skewX(-20deg)' }, '100%': { transform: 'translateX(350%) skewX(-20deg)' } },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
        'marquee-y': 'marquee-y 60s linear infinite',
        'marquee-y-slow': 'marquee-y 80s linear infinite reverse',
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 9s ease-in-out infinite',
        'spin-slow': 'spin-slow 40s linear infinite',
        morph: 'morph 16s ease-in-out infinite',
        'mesh-a': 'mesh-a 18s ease-in-out infinite',
        'mesh-b': 'mesh-b 22s ease-in-out infinite',
        'gradient-pan': 'gradient-pan 8s ease-in-out infinite',
        'scroll-cue': 'scroll-cue 2.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
