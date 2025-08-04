const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

// Configuração específica para testes BDD
const bddJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js', '<rootDir>/jest.bdd.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  // moduleNameMapping: {
  //   '^@/(.*)$': '<rootDir>/src/$1',
  // },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/*.feature.{js,jsx,ts,tsx}',
  ],
  testMatch: [
    '<rootDir>/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/features/**/*.steps.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.feature.test.{js,jsx,ts,tsx}',
  ],
  testTimeout: 30000,
  // Configurações específicas para BDD
  globalSetup: '<rootDir>/jest.bdd.globalSetup.js',
  globalTeardown: '<rootDir>/jest.bdd.globalTeardown.js',
};

module.exports = createJestConfig(bddJestConfig);