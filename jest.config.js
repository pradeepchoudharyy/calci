module.exports = {
    testEnvironment: 'node', // Use the Node.js environment for testing
    collectCoverage: true, // Enable code coverage collection
    coverageDirectory: 'coverage', // Directory to store the coverage reports
    coverageReporters: ['text', 'lcov'], // Report formats: text and lcov (HTML)
    coverageThreshold: {
      global: {

        testMatch: ['**/?(*.)+(test).[jt]s?(x)'],
        
 },
    },
  };
  