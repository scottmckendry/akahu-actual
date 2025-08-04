module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.ts'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    verbose: true,
    reporters: [
        'default',
        ['jest-junit', { outputDirectory: 'test-results', outputName: 'results.xml' }]
    ],
};
