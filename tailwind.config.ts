import type { Config } from 'tailwindcss';

// Every color below reads from a CSS variable defined in app/globals.css,
// so light/dark mode is a single class toggle on <html> — no duplicate
// palettes scattered through the codebase (Rule 17: single source of truth).
const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        'text-primary': 'var(--color-text-primary)',
        'text-muted': 'var(--color-text-muted)',
        primary: 'var(--color-primary)',
        accent: 'var(--color-accent)',
      },
      fontFamily: {
        // Content/liturgical text — Part B3
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        // Interface/software chrome — Part B3
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
