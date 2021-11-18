const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  testPathIgnorePatterns: ['/node_modules/'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/webapp/index.tsx',
    '!src/webapp/@type/*',
  ],
  projects: [
    {
      name: 'webapp-unit',
      displayName: 'Webapp Unit Tests',
      preset: 'ts-jest',
      testEnvironment: 'jsdom',
      moduleDirectories: ['node_modules', 'src'],
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
      testMatch: ['<rootDir>/tests/unit/webapp/**/*.(spec|test).(ts|tsx)'],
      moduleNameMapper: {
        ...pathsToModuleNameMapper(compilerOptions.paths),
        '\\.css$': 'identity-object-proxy',
      },
      transform: {
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
          '<rootDir>/tests/unit/webapp/__mock__/fileTransformer.js',
      },
      setupFilesAfterEnv: ['<rootDir>/tests/unit/webapp/jest.setup.ts'],
    },
  ],
};
