import { vi } from 'vitest'

// Mock localStorage for testing
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
})

// Mock fetch
global.fetch = vi.fn()

// Mock Nuxt composables
vi.mock('#app', () => ({
  useNuxtApp: () => ({
    $router: {
      push: vi.fn(),
      replace: vi.fn(),
    },
  }),
  navigateTo: vi.fn(),
  useRoute: () => ({
    params: {},
    query: {},
  }),
  useRuntimeConfig: () => ({
    public: {
      apiBase: '/api',
    },
  }),
}))

// Mock our simplified auth composable
vi.mock('~/composables/useAuth', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
    initializeAuth: vi.fn(),
  }),
}))

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