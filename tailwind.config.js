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
        },
        finnieOrange: {
          DEFAULT: '#FFC78F',
        },
        trueGray: colors.trueGray,
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
        19.5: '4.875rem', // 78px
        26.25: '6.5625rem', // 105px
        27.5: '6.875rem',
        30.5: '7.625rem',
        34.5: '8.625rem',
        35.5: '8.875rem', // 142px
        38.5: '9.625rem', // 154px
        92.75: '23.1875rem', // 371px
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
