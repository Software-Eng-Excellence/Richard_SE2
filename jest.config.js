/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/tests'],
  testMatch: ['<rootDir>/src/**/tests/**/*.ts'],
  testPathIgnorePatterns: ["/node_modules/"],
  verbose: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  collectCoverage: false, // Disable coverage to simplify testing
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testTimeout: 10000, // Increase timeout
  forceExit: true, // Force exit after tests complete
};
module.exports = config;
