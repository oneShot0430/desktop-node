module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './src/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['Sora', 'Open Sans', 'ui-sans-serif', 'system-ui'],
      serif: ['ui-serif', 'Georgia'],
      mono: ['ui-monospace', 'SFMono-Regular'],
    },
    spacing: {
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '48px',
      xxl: '62px',
    },
    extend: {
      colors: {
        finnieBlue: {
          dark: '#030332',
          light: '#171753',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
