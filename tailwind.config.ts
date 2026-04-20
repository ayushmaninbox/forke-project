import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent:        'var(--color-accent)',
        'accent-hover':'var(--color-accent-hover)',
        'accent-light':'var(--color-accent-light)',
        'accent-text': 'var(--color-accent-text)',
        surface:       'var(--color-bg-surface)',
        muted:         'var(--color-text-muted)',
        border:        'var(--color-border)',
      },
      fontFamily: {
        sans:  ['var(--font-sans)'],
        serif: ['var(--font-serif)'],
        mono:  ['var(--font-mono)'],
      },
    },
  },
  plugins: [],
}

export default config
