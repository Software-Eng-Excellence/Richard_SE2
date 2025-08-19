/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/tests'],
  testMatch: ['<rootDir>/src/tests/**/*.ts'],
  testPathIgnorePatterns: ["/node_modules/"],
  verbose: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      functions: 80,
      statements: 75
    }
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};
module.exports = config;
