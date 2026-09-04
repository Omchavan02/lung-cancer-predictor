/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#F0F4F9',
          100: '#D9E3F0',
          200: '#B8CCE3',
          300: '#8FAFD2',
          400: '#5E89BD',
          500: '#3A67A3',
          600: '#274E86',
          700: '#193666',
          800: '#0E2247',
          900: '#081425',
          950: '#040B15',
        },
        pearl: {
          50: '#FFFFFF',
          100: '#FBFBFD',
          200: '#F4F5F8',
          300: '#E9EBF0',
          400: '#D8DCE4',
          500: '#94A3B8',
          600: '#64748B',
          700: '#475569',
          800: '#1E293B',
          900: '#0F172A',
        },
        clinical: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
        },
        risk: {
          low: '#059669',
          high: '#DC2626',
          neutral: '#D97706',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Consolas', 'monospace'],
      },
      fontSize: {
        'display-2xl': ['clamp(3.75rem, 6.5vw, 5.5rem)', { lineHeight: '1.05', letterSpacing: '-0.035em', fontWeight: '800' }],
        'display-xl': ['clamp(2.75rem, 4.8vw, 4rem)', { lineHeight: '1.12', letterSpacing: '-0.03em', fontWeight: '700' }],
        'display-lg': ['clamp(2rem, 3.2vw, 2.75rem)', { lineHeight: '1.2', letterSpacing: '-0.025em', fontWeight: '700' }],
        'headline': ['1.5rem', { lineHeight: '1.35', letterSpacing: '-0.02em', fontWeight: '600' }],
        'body-xl': ['1.25rem', { lineHeight: '1.75', fontWeight: '400' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7', fontWeight: '400' }],
        'body-md': ['1rem', { lineHeight: '1.65', fontWeight: '400' }],
        'meta': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.01em', fontWeight: '500' }],
        'caption': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.04em', fontWeight: '600' }],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(8, 20, 37, 0.04), 0 1px 2px -1px rgba(8, 20, 37, 0.03)',
        'panel': '0 16px 36px -16px rgba(8, 20, 37, 0.08), 0 0 1px 1px rgba(233, 235, 240, 0.9)',
      },
      borderRadius: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
      }
    },
  },
  plugins: [],
}
