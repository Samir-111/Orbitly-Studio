import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/sections/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#080B14',
        surface: '#0D1220',
        'surface-elevated': '#131A2E',
        'surface-border': '#20263A',
        brand: {
          50: '#F4F3FF',
          100: '#EBE9FE',
          400: '#8B7CF6',
          500: '#6C5CE7',
          600: '#5A48DE',
          700: '#4834D4',
        },
        accent: {
          cyan: '#38BDF8',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
