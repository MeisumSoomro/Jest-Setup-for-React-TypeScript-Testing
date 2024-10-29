/**
 * Jest Testing Configuration
 * 
 * Purpose: Configures testing environment
 * Usage: Used for:
 * - Unit tests
 * - Integration tests
 * - Component tests
 * 
 * Commands:
 * - npm run test
 * - npm run test:watch
 * - npm run test:coverage
 * 
 * Related Files:
 * - jest.setup.ts
 * - playwright.config.ts (E2E tests)
 */

import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
    },
    globals: {
        'ts-jest': {
            tsconfig: './tsconfig.json'
        }
    }
}

export default config