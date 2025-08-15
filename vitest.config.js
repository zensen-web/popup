import path from 'node:path'
import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'

const dirname = typeof __dirname === 'undefined'
  ? path.dirname(fileURLToPath(import.meta.url))
  : __dirname

export default defineConfig({
  define: {
    __DEV__: true,
  },
  build: {
    modulePreload: false,
    target: 'esnext',
  },
  esbuild: {
    target: 'esnext',
  },
  optimizeDeps: {
    include: ['lit'],
  },
  server: {
    open: true,
    host: true,
  },
  test: {
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'lcov', 'html'],
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'visual',
          browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            instances: [
              { browser: 'chromium' },
            ],
          },
        },
        plugins: [storybookTest({
          configDir: path.join(dirname, '.storybook'),
        })],
      },
    ],
  },
})
