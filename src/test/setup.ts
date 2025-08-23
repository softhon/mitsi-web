import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extends Vitest's expect with Jest-dom matchers
expect.extend(matchers);

// cleanup after each test
afterEach(() => {
  cleanup();
});
