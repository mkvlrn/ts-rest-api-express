import { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';

import { compilerOptions } from './tsconfig.json';

const config: Config = {
  passWithNoTests: true,
  preset: 'ts-jest',
  maxWorkers: 2,
  rootDir: './',
  testRegex: '.spec.(ts|tsx)$', // "spec" for unit tests, "test" for integration or e2e
  testEnvironment: 'node', // "jsdom" for react
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>',
  }),
  transform: {
    '^.+.(png|svg|jpg|gif|webp)$': 'jest-transform-stub',
  },
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    './src/**/*.{ts,tsx}',
    '!**/index.{ts,tsx}',
    '!**/*.dto.{ts,tx}',
  ],
  setupFiles: ['./jest.setup.ts'],
};

export default config;
