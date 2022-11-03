const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './src/index.html'],
  media: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['Sora', 'Open Sans', 'ui-sans-serif', 'system-ui'],
      serif: ['ui-serif', 'Georgia'],
      mono: ['ui-monospace', 'SFMono-Regular'],
      roboto: ['Roboto', 'ui-sans-serif', 'system-ui'],
    },
    extend: {
      animation: {
        'reverse-spin': 'reverse-spin 1s linear infinite',
      },
      keyframes: {
        'reverse-spin': {
          from: {
            transform: 'rotate(360deg)',
          },
        },
      },
      colors: {
        finnieBlue: {
          dark: '#030332',
          'dark-secondary': '#04043D',
          light: '#211C52',
          'light-secondary': '#373765',
          'light-tertiary': '#4A4A73',
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
          light: '#9BE7C4',
        },
        finnieGray: {
          DEFAULT: '#F2F2F2',
          light: '#F5F5F5',
          secondary: '#9B9BB2',
          tertiary: '#D6D6D6',
        },
        neutral: { ...colors.neutral, 200: '#EAEAEA' },
        finnieRed: {
          DEFAULT: '#FFA6A6',
          500: '#FF4141',
        },
        purple: {
          ...colors.purple,
          3: '#353570',
          4: '#4D3D8D',
        },
      },
      fontSize: {
        '4xs': '7px',
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
        2.75: '0.6875rem',
        3.25: '0.8125rem',
        3.5: '0.875rem',
        3.75: '0.9375rem',
        4.375: '1.09375rem',
        5.25: '1.3125rem',
        5.5: '1.375rem',
        6.25: '1.5625rem',
        6.5: '1.625rem',
        9.5: '2.375rem',
        9.75: '2.4375rem',
        13: '3.25rem',
        27.5: '6.875rem',
        30.5: '7.625rem',
        34.5: '8.625rem',
        41.25: '10.3125rem',
        44.75: '11.1875rem',
        59.25: '14.8125rem',
        71: '17.75rem',
        79.5: '19.875rem',
        98.5: '24.625rem',
        102.75: '25.6875rem',
        108.25: '27.0625rem',
        116: '29rem',
        128: '32rem',
        144.75: '35.9375rem',
        151.25: '37.8125rem',
        156: '39rem',
        249.75: '62.4375rem',
      },
      letterSpacing: {
        'finnieSpacing-tighter': '-0.02em',
        'finnieSpacing-tight': '-0.01em',
        'finnieSpacing-wide': '0.015em',
        'finnieSpacing-wider': '0.03em',
      },
      borderRadius: {
        'finnie-small': '3px',
        finnie: '4px',
      },
      gridTemplateColumns: {
        15: 'repeat(15, minmax(0, 1fr))',
        16: 'repeat(16, minmax(0, 1fr))',
      },
      gridColumnStart: {
        14: '14',
      },
      keyframes: {
        slideOut: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(-4px)' },
        },

        shrink: {
          '0%': { width: '62.4375rem', transform: 'translateX(12.3125rem)' },
          '100%': { width: '37.8125rem' },
        },
      },
      animation: {
        slideOut: 'slideOut 0.5s ease-in-out',
        shrink: 'shrink 0.25s linear',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
