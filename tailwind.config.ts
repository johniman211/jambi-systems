import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--bg) / <alpha-value>)',
        'background-secondary': 'rgb(var(--bg-secondary) / <alpha-value>)',
        'background-dark': 'rgb(var(--bg-dark) / <alpha-value>)',
        'background-dark-secondary': 'rgb(var(--bg-dark-secondary) / <alpha-value>)',
        foreground: 'rgb(var(--fg) / <alpha-value>)',
        'foreground-secondary': 'rgb(var(--fg-secondary) / <alpha-value>)',
        'foreground-muted': 'rgb(var(--fg-muted) / <alpha-value>)',
        'foreground-on-dark': 'rgb(var(--fg-on-dark) / <alpha-value>)',
        'foreground-on-dark-secondary': 'rgb(var(--fg-on-dark-secondary) / <alpha-value>)',
        card: 'rgb(var(--card) / <alpha-value>)',
        'card-hover': 'rgb(var(--card-hover) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        'border-dark': 'rgb(var(--border-dark) / <alpha-value>)',
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          hover: 'rgb(var(--accent-hover) / <alpha-value>)',
          muted: 'rgb(var(--accent-muted) / <alpha-value>)',
          foreground: 'rgb(var(--fg) / <alpha-value>)',
        },
        'accent-2': {
          DEFAULT: 'rgb(var(--accent-2) / <alpha-value>)',
          hover: 'rgb(var(--accent-2-hover) / <alpha-value>)',
          muted: 'rgb(var(--accent-2-muted) / <alpha-value>)',
        },
        ring: 'rgb(var(--ring) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
        error: 'rgb(var(--error) / <alpha-value>)',
        info: 'rgb(var(--info) / <alpha-value>)',
        primary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '88rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'glow': '0 0 20px -5px rgb(var(--accent) / 0.3)',
        'glow-lg': '0 0 40px -10px rgb(var(--accent) / 0.4)',
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'card-hover': '0 10px 40px -15px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
        'nav': '0 1px 3px 0 rgb(0 0 0 / 0.05)',
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-in-up': 'fade-in-up 0.5s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [],
}

export default config
