module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,js,tsx,jsx}',
    '!<rootDir>/src/Model/**/*.{ts,js}'
  ],
  setupFilesAfterEnv: [
    '<rootDir>/test/setup.js'
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
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/test/__mocks__/fileMock.js',
    '\\.(css|less|scss)$': '<rootDir>/test/__mocks__/styleMock.js',
    'shogunApplicationConfig': '<rootDir>/assets/fallbackConfig.js'
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!@ngrx|(?!deck.gl)|ng-dynamic|@monaco-editor)'
  ],
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json'
  ],
  testEnvironment: 'jsdom',
  reporters: ['default', '@casualbot/jest-sonar-reporter'],
  coverageReporters: ['json-summary', 'lcov'],
  coverageDirectory: 'coverage/all'
};
