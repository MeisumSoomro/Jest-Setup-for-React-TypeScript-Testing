/// <reference types="@testing-library/jest-dom" />
/// <reference types="jest" />

import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.test' });

declare global {
    // Extend NodeJS.Global interface
    namespace NodeJS {
        interface Global {
            ResizeObserver: ResizeObserverConstructor;
            IntersectionObserver: IntersectionObserverConstructor;
        }
    }
}

// Define constructor types
interface ResizeObserverConstructor {
    new(): {
        observe: jest.Mock;
        unobserve: jest.Mock;
        disconnect: jest.Mock;
    };
}

interface IntersectionObserverConstructor {
    new(callback: IntersectionObserverCallback, options?: IntersectionObserverInit): {
        observe: jest.Mock;
        unobserve: jest.Mock;
        disconnect: jest.Mock;
        takeRecords: jest.Mock;
        root: Element | null;
        rootMargin: string;
        thresholds: ReadonlyArray<number>;
    };
}

// Setup text encoder/decoder for Node.js environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof TextDecoder;

// Mock ResizeObserver
const mockResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
}));

global.ResizeObserver = mockResizeObserver;

// Mock Intersection Observer
const mockIntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
    takeRecords: jest.fn(),
    root: null,
    rootMargin: '',
    thresholds: []
}));

global.IntersectionObserver = mockIntersectionObserver;

// Clear mocks between tests
beforeEach(() => {
    jest.clearAllMocks();
});