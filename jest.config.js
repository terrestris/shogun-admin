const path = require('path');

const config = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,js,tsx,jsx}',
    '!<rootDir>/src/Model/**/*.{ts,js}'
  ],
  setupFilesAfterEnv: [
    '<rootDir>/test/setup.js',
    // '@testing-library/react/cleanup-after-each',
    // '@testing-library/jest-dom/extend-expect'
  ],
  testMatch: [
    '<rootDir>/src/**/?(*.)(spec).(j|t)s?(x)'
  ],
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'babel-jest'
  },
  moduleNameMapper: {
    // eslint-disable-next-line max-len
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/test/__mocks__/fileMock.js',
    '\\.(css|less|scss)$': '<rootDir>/test/__mocks__/styleMock.js',
    'shogunApplicationConfig': path.resolve(__dirname, 'jest.config.js')
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!@ngrx|(?!deck.gl)|ng-dynamic)'
  ],
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json'
  ],
  testEnvironment: 'jsdom',
  reporters: ['default', '@casualbot/jest-sonar-reporter']
};

module.exports = config;
