import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: [
      'packages/*/test/**/*.test.ts',
      'tools/*/test/**/*.test.ts',
      'scripts/test/**/*.test.mjs',
    ],
    testTimeout: 30000,
  },
});
