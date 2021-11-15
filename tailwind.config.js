module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './src/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['Sora', 'Open Sans', 'ui-sans-serif', 'system-ui'],
      serif: ['ui-serif', 'Georgia'],
      mono: ['ui-monospace', 'SFMono-Regular'],
    },
    extend: {
      colors: {
        finnieBlue: {
          dark: '#030332',
          light: '#171753',
        },
        finnieTeal: {
          DEFAULT: '#5ED9D1',
        },
      },
      spacing: {
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '48px',
        xxl: '62px',
        6.5: '1.625rem',
        9.75: '2.4375rem',
        34.5: '8.625rem',
      },
      letterSpacing: {
        finnieSpacing: '0.03em',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
