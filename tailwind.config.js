const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/renderer/**/*.{js,jsx,ts,tsx,ejs}'],
  media: false,
  theme: {
    fontFamily: {
      sans: ['Sora', 'Open Sans', 'ui-sans-serif', 'system-ui'],
      serif: ['ui-serif', 'Georgia'],
      mono: ['ui-monospace', 'SFMono-Regular'],
      roboto: ['Roboto', 'ui-sans-serif', 'system-ui'],
    },
    extend: {
      height: {
        13: '3.25rem',
      },
      minHeight: {
        table: '6rem',
      },
      width: {
        5.5: '22px',
        22.5: '5.6rem',
        125: '31.25rem',
      },
      animation: {
        'reverse-spin': 'reverse-spin 1s linear infinite',
        slideDownAndFade:
          'slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideUpAndFade: 'slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'reverse-spin': {
          from: {
            transform: 'rotate(360deg)',
          },
        },
        slideDownAndFade: {
          from: { opacity: 0, transform: 'translateY(-2px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        slideUpAndFade: {
          from: { opacity: 0, transform: 'translateY(2px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      },
      colors: {
        finnieBlue: {
          dark: '#030332',
          'dark-secondary': '#04043D',
          light: '#211C52',
          'light-secondary': '#373765',
          'light-tertiary': '#4A4A73',
          'light-4': '#54547B',
          DEFAULT: '#171753',
        },
        blue: {
          1: '#0E0E44',
          2: '#030332',
        },
        orange: {
          2: '#FFC78F',
        },
        finniePurple: {
          DEFAULT: '#8989C7',
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
        gray: {
          light: '#E3E0EB',
          DEFAULT: '#D6D6D6',
        },
        green: {
          dark: '#087980',
          1: '#49CE8B',
          2: '#9BE7C4',
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
          1: '#8989C7',
          3: '#353570',
          4: '#4D3D8D',
          5: '#454580',
        },
      },
      backgroundImage: (theme) => ({
        'gradient-dark':
          'linear-gradient(90deg, rgba(3, 3, 50, 0.9) 0%, rgba(23, 23, 83, 0.9) 100%)',
      }),
      blur: {
        4.5: '4.5px',
      },
      opacity: {
        90: '0.9',
      },
      fontSize: {
        '4xs': '7px',
        '2xs': '11px',
      },
      padding: { 0.75: '3px' },
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
        'first-task': '3.4rem repeat(16, minmax(0, 1fr)) 3rem',
        'my-node': '2.3fr minmax(255px, 5fr) 4fr 4fr 3fr 1.8fr 1.5fr 2.6fr',
        'available-tasks': '2fr minmax(180px, 3fr) 4fr 2.5fr 1.5fr 3fr 2fr 2fr',
        'add-private-task': '14fr 3fr 2fr 2fr',
        'accounts-headers': '1fr 4fr 7fr 6fr',
        accounts: '1fr 1fr 3fr 5fr 2fr 3fr 2fr 1fr',
      },
      gridColumnStart: {
        2: '2',
        13: '13',
        15: '15',
      },
    },
  },

  variants: {
    extend: {},
  },
  plugins: [],
};
