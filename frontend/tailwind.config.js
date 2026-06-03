/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0d0f14',
        'bg-secondary': '#13161d',
        'bg-tertiary': '#1a1e28',
        border: '#252a38',
        'border-light': '#2e3547',
        primary: {
          DEFAULT: '#4f8ef7',
          hover: '#6ba3ff',
          muted: 'rgba(79, 142, 247, 0.12)',
        },
        success: {
          DEFAULT: '#22c55e',
          muted: 'rgba(34, 197, 94, 0.12)',
        },
        warning: {
          DEFAULT: '#f59e0b',
          muted: 'rgba(245, 158, 11, 0.12)',
        },
        danger: {
          DEFAULT: '#ef4444',
          muted: 'rgba(239, 68, 68, 0.12)',
        },
        purple: {
          DEFAULT: '#a78bfa',
          muted: 'rgba(167, 139, 250, 0.12)',
        },
        'text-primary': '#f1f5f9',
        'text-secondary': '#8b92a5',
        'text-muted': '#525a6e',
      },
      fontFamily: {
        sans: ['DM Sans', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
        mono: ['DM Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
        'xl': '24px',
      },
      boxShadow: {
        'glow': '0 0 24px rgba(79, 142, 247, 0.15)',
      }
    },
  },
  plugins: [],
}
