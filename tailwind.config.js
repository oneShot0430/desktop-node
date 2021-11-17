const colors = require('tailwindcss/colors');

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
          DEFAULT: '#171753',
        },
        finnieTeal: {
          100: '#BEF0ED',
          DEFAULT: '#5ED9D1',
          700: '#237B75',
        },
        finnieOrange: {
          DEFAULT: '#FFC78F',
        },
        finnieEmerald: {
          DEFAULT: '#49CE8B',
        },
        trueGray: { ...colors.trueGray, 200: '#EAEAEA' },
      },
      fontSize: {
        '2xs': '11px',
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
        71: '17.75rem',
      },
      letterSpacing: {
        'finnieSpacing-tight': '-0.01em',
        'finnieSpacing-wide': '0.015em',
        'finnieSpacing-wider': '0.03em',
      },
      borderRadius: {
        finnie: '4px',
      },
      gridTemplateColumns: {
        15: 'repeat(15, minmax(0, 1fr))',
        16: 'repeat(16, minmax(0, 1fr))',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
