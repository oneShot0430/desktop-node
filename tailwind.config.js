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
