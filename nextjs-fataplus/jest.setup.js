// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => ({
    get: jest.fn(),
    getAll: jest.fn(),
    has: jest.fn(),
    forEach: jest.fn(),
    entries: jest.fn(),
    keys: jest.fn(),
    values: jest.fn(),
    toString: jest.fn(),
  }),
}));

// Mock server actions
jest.mock('next/dist/compiled/server-only', () => ({}));
jest.mock('next/dist/compiled/client-only', () => ({}));
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(() => '/'),
  }),
}));

// Mock cookies
jest.mock('next/headers', () => ({
  cookies: () => ({
    get: jest.fn(),
    getAll: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  }),
}));

// Mock PocketBase
jest.mock('@/integrations/pocketbase/client', () => ({
  getPocketBase: jest.fn(() => ({
    authStore: {
      model: null,
      token: '',
      isValid: false,
      clear: jest.fn(),
      save: jest.fn(),
      onChange: jest.fn(),
    },
    collection: jest.fn(() => ({
      getList: jest.fn(),
      getOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      authWithPassword: jest.fn(),
    })),
  })),
  getCurrentUser: jest.fn(),
  isAuthenticated: jest.fn(),
  getToken: jest.fn(),
  clearAuth: jest.fn(),
}));
