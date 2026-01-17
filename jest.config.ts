import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  testEnvironment: 'node',
  clearMocks: true,
  extensionsToTreatAsEsm: ['.ts'],

  roots: ['<rootDir>/__tests__'],
  testMatch: ['**/*.test.ts'],

  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          module: 'ESNext',
          moduleResolution: 'bundler',
          allowSyntheticDefaultImports: true,
          esModuleInterop: true,
          types: ['jest', 'node'],
        },
      },
    ],
    '^.+\\.(mjs|js)$': 'babel-jest',
  },

  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  // Allow-list ESM deps in node_modules that must be transformed.
  // Note: we need 4 backslashes in the template literal so the runtime string contains 2.
  transformIgnorePatterns: [
    `[/\\\\]node_modules[/\\\\](?!(@noble|@stablelib|multiformats))`,
  ],

  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.txt',
    '!**/*.test.ts',
    '!**/node_modules/**',
  ],
};

export default config;
