module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    createDefaultProgram: true,
  },
  extends: [
    'erb',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/electron',
    'plugin:import/typescript',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['unused-imports'],
  rules: {
    semi: ['error', 'always'],
    quotes: ['error', 'single', { avoidEscape: true }],
    'jsx-quotes': ['error', 'prefer-double'],
    'import/extensions': ['error', 'never', { svg: 'always', json: 'always' }],
    'import/newline-after-import': ['error', { count: 1 }],
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'object',
          'type',
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'unused-imports/no-unused-imports': 'error',
    '@typescript-eslint/no-var-requires': 'off',
    'import/prefer-default-export': 'off',
    'no-console': 'off',
    'react/jsx-filename-extension': 'off',
    'promise/always-return': 'off',
    'no-use-before-define': 'off',
    'react/require-default-props': 'off',
    'react/no-unused-prop-types': 'warn',
    'no-shadow': 'warn',
    'jsx-a11y/click-events-have-key-events': 'warn',
    'prefer-template': 'warn',
    'jsx-a11y/label-has-associated-control': 'warn',
    'no-nested-ternary': 'warn',
    'react/no-array-index-key': 'warn',
    'jsx-a11y/tabindex-no-positive': 'warn',
    'jsx-a11y/jsx-a11y/no-noninteractive-tabindex': 'warn',
  },
  parser: '@typescript-eslint/parser',
  settings: {
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
      webpack: {
        config: require.resolve('./.erb/configs/webpack.config.eslint.ts'),
      },
      typescript: {},
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
};
