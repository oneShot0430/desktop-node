const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  testPathIgnorePatterns: ['/node_modules/'],
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
  coveragePathIgnorePatterns: ['src/**/*.d.ts'],
  projects: [
    {
      name: 'webapp-unit',
      displayName: 'Webapp Unit Tests',
      preset: 'ts-jest',
      testEnvironment: 'jsdom',
      moduleDirectories: ['node_modules', 'src'],
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
      testMatch: ['<rootDir>/tests/unit/webapp/**/*.(spec|test).(ts|tsx)'],
      moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
      setupFilesAfterEnv: ['<rootDir>/tests/unit/webapp/jest.setup.ts'],
    },
  ],
};
