module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testTimeout: 90000,
    reporters: [
      'default',
      [
        'jest-html-reporter',
        {
          pageTitle: 'Integration Test Report',
          outputPath: '../test-report/integration/index.html', 
        },
      ],
      [
        'jest-junit',
        {
          outputDirectory: '../test-results/integration',
          outputName: 'junit-integration.xml',
        },
      ],
    ],
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: 'src', 
    testRegex: '.*\\.integration\\.spec\\.ts$', 
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: [
      '**/*.{js,ts}', 
      '!**/*.module.ts', 
      '!main.ts', 
      '!**/*.interface.ts', 
      '!**/*.d.ts', 
    ],
    collectCoverage: true,
    coverageReporters: ['text', 'lcov', 'html'],
    coverageDirectory: '../coverage/integration', 
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/$1',
    },
  };
  