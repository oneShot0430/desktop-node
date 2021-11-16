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
          100: '#BEF0ED',
          DEFAULT: '#5ED9D1',
        },
        finnieOrange: {
          DEFAULT: '#FFC78F',
        },
      },
      spacing: {
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '48px',
        xxl: '62px',
        1.5: '0.375rem',
        2.5: '0.625rem',
        5.25: '1.3125rem',
        6.5: '1.625rem',
        9.5: '2.375rem',
        9.75: '2.4375rem',
        27.5: '6.875rem',
        30.5: '7.625rem',
        34.5: '8.625rem',
      },
      letterSpacing: {
        'finnieSpacing-tight': '-0.01em',
        'finnieSpacing-wide': '0.03em',
      },
      borderRadius: {
        finnie: '4px',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
