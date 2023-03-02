module.exports = {
    ...require('./jest.config'),
    collectCoverageFrom: ['**/gitClient.ts', '!**/__tests__/**/*'],
    testRegex: '__tests__/(?!data|mocks).*integration\\.(ts|js|tsx|jsx)$',
};
