import type { Config } from 'jest'

const config: Config = {
    coverageProvider: 'v8',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^swiper/css$': 'identity-obj-proxy',
        '^swiper/css/(.*)$': 'identity-obj-proxy',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    transformIgnorePatterns: [
        '/node_modules/(?!(swiper|ssr-window|dom7)/)',
    ],
    testMatch: [
        '**/__tests__/**/*.[jt]s?(x)',
        '**/?(*.)+(spec|test).[jt]s?(x)'
    ],
    collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/*.stories.{js,jsx,ts,tsx}',
    ],
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            tsconfig: {
                jsx: 'react',
            },
        }],
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
}

export default config

// The following mocks are typically placed in a setup file (e.g., jest.setup.ts)
// or directly in test files, not in jest.config.ts.
// For the purpose of demonstrating the requested change, they are included here
// as comments, but they should be moved to jest.setup.ts for correct functionality.

/*
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() }
    }
  })),
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} }))
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/',
}));
*/
