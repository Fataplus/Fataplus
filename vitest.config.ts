import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./tests/setup.ts'],
    include: ['**/*.{test,spec}.{js,ts,vue}'],
    exclude: ['node_modules', 'dist', '.nuxt', '.output', 'tests/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.{js,ts}',
        'coverage/**',
        'dist/**',
        '.nuxt/**',
        '.output/**',
      ],
    },
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, '.'),
      '@': resolve(__dirname, '.'),
      '#modules': resolve(__dirname, 'modules'),
      '#shared': resolve(__dirname, 'shared'),
      '#integrations': resolve(__dirname, 'integrations'),
      '#types': resolve(__dirname, 'types/index.ts'),
      '#marketplace': resolve(__dirname, 'modules/marketplace'),
      '#learning': resolve(__dirname, 'modules/learning'),
      '#community': resolve(__dirname, 'modules/community'),
    },
  },
}) 