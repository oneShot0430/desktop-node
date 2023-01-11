/** @type {import('jest').Config} */
const config = {
  testPathIgnorePatterns: ['/node_modules/'],
  verbose: true,
  testPathIgnorePatterns: ['/node_modules/'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/webapp/index.tsx',
    '!src/webapp/@type/*',
  ],
  projects: [
    {
      displayName: 'Webapp Unit Tests',
      preset: 'ts-jest',
      testEnvironment: 'jsdom',
      moduleDirectories: ['node_modules', 'src'],
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
      testMatch: ['<rootDir>/**/*.(spec|test).(ts|tsx)'],
      moduleNameMapper: {
        '^.+\\.svg$': '<rootDir>/src/webapp/tests/mocks/svgMocker.js',
        uuid: require.resolve('uuid'),
      },
      transform: {
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
          '<rootDir>/src/webapp/tests/mocks/fileTransformer.js',
      },
      setupFilesAfterEnv: ['<rootDir>/src/webapp/tests/jest.setup.ts'],
    },
  ],
};

module.exports = config;
