module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        pageTitle: 'Unit Test Report',
        outputPath: '../test-report/unit/index.html', 
      },
    ],
    [
      'jest-junit',
      {
        outputDirectory: '../test-results/unit',
        outputName: 'junit-unit.xml',
      },
    ],
  ],
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src', 
  testRegex: '.*\\.unit\\.spec\\.ts$', 
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
  coverageDirectory: '../coverage/unit', 
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};
