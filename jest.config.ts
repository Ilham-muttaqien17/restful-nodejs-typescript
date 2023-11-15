import type { Config } from '@jest/types';
// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  forceExit: true,
  transform: {
    '^.+\\.[t|j]sx?$': 'ts-jest'
  },
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  testMatch: ['<rootDir>/test/*.test.ts'],
  moduleNameMapper: {
    '@src/(.*)': '<rootDir>/src/$1',
    '@test/(.*)': '<rootDir>/test/$1',
    '@@/(.*)': '<rootDir>/$1'
  }
};
export default config;
