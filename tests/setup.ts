import { vi } from 'vitest'
import { config } from '@vue/test-utils'

// Mock Nuxt composables
vi.mock('#app', () => ({
  useNuxtApp: () => ({
    $i18n: {
      t: (key: string) => key,
      locale: { value: 'fr' },
    },
  }),
  navigateTo: vi.fn(),
  useRoute: () => ({
    params: {},
    query: {},
    path: '/',
  }),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  useRuntimeConfig: () => ({
    public: {
      apiBase: '/api',
    },
  }),
}))

// Mock Pinia
vi.mock('pinia', () => ({
  createPinia: () => ({}),
  defineStore: vi.fn(),
  setActivePinia: vi.fn(),
}))

// Global test configuration
config.global.mocks = {
  $t: (key: string) => key,
  $i18n: {
    locale: 'fr',
  },
}

// Mock window.matchMedia for responsive components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
}) 