import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{js,ts,vue}', './app/app.vue', './app/error.vue'],
  theme: {
    extend: {
      colors: {
        ink: '#0F1115',
        surface: '#161A20',
        raised: '#1E232B',
        line: '#282E39',
        'line-strong': '#3A424F',
        accent: {
          DEFAULT: '#86C232',
          soft: '#A8DC5F',
          deep: '#63912A',
          wash: 'rgba(134, 194, 50, 0.10)',
        },
        content: {
          strong: '#F3F5F8',
          DEFAULT: '#AEB7C4',
          muted: '#78818F',
        },
        danger: '#F2555A',
        warn: '#E0A030',
      },
      fontFamily: {
        display: ['Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.02em' }],
        hero: ['clamp(2.5rem, 6.4vw, 4.25rem)', { lineHeight: '1.04', letterSpacing: '-0.03em' }],
        title: ['clamp(1.7rem, 3.4vw, 2.35rem)', { lineHeight: '1.14', letterSpacing: '-0.02em' }],
      },
      maxWidth: { prose: '68ch' },
      borderRadius: { card: '14px' },
      boxShadow: {
        raise: '0 1px 0 0 rgba(255,255,255,0.03) inset, 0 12px 28px -18px rgba(0,0,0,0.9)',
        lift: '0 1px 0 0 rgba(255,255,255,0.05) inset, 0 20px 44px -22px rgba(0,0,0,0.95)',
      },
      transitionTimingFunction: { out: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      keyframes: {
        rise: {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'none' },
        },
        caret: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0' } },
        shimmer: { from: { backgroundPosition: '200% 0' }, to: { backgroundPosition: '-200% 0' } },
        breathe: { '0%,100%': { opacity: '0.4' }, '50%': { opacity: '1' } },
      },
      animation: {
        rise: 'rise 0.5s cubic-bezier(0.22,1,0.36,1) both',
        caret: 'caret 1.05s step-end infinite',
        shimmer: 'shimmer 1.4s linear infinite',
        breathe: 'breathe 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [
    function ({ addUtilities }: { addUtilities: (u: Record<string, unknown>) => void }) {
      addUtilities({
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        },
        '.delay-step-1': { animationDelay: '60ms' },
        '.delay-step-2': { animationDelay: '120ms' },
        '.delay-step-3': { animationDelay: '180ms' },
        '.delay-step-4': { animationDelay: '240ms' },
      })
    },
  ],
} satisfies Config
