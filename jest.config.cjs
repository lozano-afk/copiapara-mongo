module.exports = {
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/test/setup.js'],
  testMatch: ['**/test/**/*.test.js'],
  collectCoverageFrom: [
    'airbinb/**/*.js',
    '!airbinb/models/schemas/*.js'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};