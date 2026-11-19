import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  // Resolves the path aliases declared in tsconfig.json, including the ones
  // added by `nest g library`.
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    root: './',
    include: ['**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      // Pinned at the suite's current coverage so it can't regress.
      thresholds: {
        statements: 98,
        branches: 86,
        functions: 96,
        lines: 98,
      },
    },
  },
});
