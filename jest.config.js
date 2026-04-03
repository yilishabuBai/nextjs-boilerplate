/** @type {import('jest').Config} */
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // 提供 Next.js 应用的路径
  dir: './',
});

// 自定义 Jest 配置
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup-tests.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '/setup-tests.ts'],
};

module.exports = createJestConfig(customJestConfig);
