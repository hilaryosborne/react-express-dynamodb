module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
    setupFiles: ['react-app-polyfill/jsdom'],
    testMatch: [
        '<rootDir>/src/**/__tests__/**/*.{ts,tsx,js,jsx}',
        '<rootDir>/src/**/?(*.)(spec|test).{ts,tsx,js,jsx}',
    ],
    setupFilesAfterEnv: ['./jest/setupTests.js'],
    testURL: 'http://localhost',
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
        '^.+\\.(js|jsx)$': '<rootDir>/node_modules/babel-jest',
        '^(?!.*\\.(css|json)$)': '<rootDir>/jest/fileTransform.js',
    },
    moduleNameMapper: {
        '^react-native$': 'react-native-web',
        '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
        '^@src/(.*)$': '<rootDir>/src/$1',
        '^@components/(.*)$': '<rootDir>/src/components/$1',
        '^@context/(.*)$': '<rootDir>/src/context/$1',
    },
    moduleFileExtensions: ['js', 'json', 'jsx', 'node', 'ts', 'tsx'],
};