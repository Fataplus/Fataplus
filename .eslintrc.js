module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2022: true
  },
  extends: [
    '@nuxt/eslint-config',
    '@vue/typescript/recommended',
    'plugin:vue/vue3-recommended',
    'prettier'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2022,
    sourceType: 'module',
    extraFileExtensions: ['.vue']
  },
  plugins: [
    '@typescript-eslint',
    'vue'
  ],
  rules: {
    // 🎯 Vue.js Rules - Balanced approach
    'vue/multi-word-component-names': 'off',
    'vue/no-multiple-template-root': 'off',
    'vue/component-definition-name-casing': ['error', 'PascalCase'],
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/attributes-order': 'warn',
    'vue/order-in-components': 'warn',
    'vue/require-default-prop': 'warn',
    'vue/require-prop-types': 'warn',
    'vue/no-unused-vars': 'error',
    'vue/no-v-html': 'warn',

    // 📘 TypeScript Rules - Production Ready
    '@typescript-eslint/no-unused-vars': ['warn', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_'
    }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/no-var-requires': 'error',
    '@typescript-eslint/ban-ts-comment': ['warn', {
      'ts-expect-error': 'allow-with-description',
      'ts-ignore': 'allow-with-description',
      'ts-nocheck': 'allow-with-description',
      'ts-check': false
    }],

    // 🔧 General JavaScript Rules
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'prefer-const': 'warn',
    'no-var': 'error',
    'object-shorthand': 'warn',
    'prefer-template': 'warn',
    'no-duplicate-imports': 'error',
    'no-unused-expressions': 'warn',
    'eqeqeq': ['error', 'always'],

    // 📋 Import/Export Rules (relaxed)
    'sort-imports': 'off', // Too noisy for now

    // 🔒 Security Rules (essential only)
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error'
  },
  globals: {
    // 🚀 Nuxt 3 Auto-imports
    $fetch: 'readonly',
    navigateTo: 'readonly',
    useRoute: 'readonly',
    useRouter: 'readonly',
    useState: 'readonly',
    useCookie: 'readonly',
    useRuntimeConfig: 'readonly',
    definePageMeta: 'readonly',
    defineNuxtConfig: 'readonly',
    
    // 🤖 NuxtHub Auto-imports
    cachedEventHandler: 'readonly',
    hubVectorize: 'readonly',
    hubBrowser: 'readonly',
    hubBlob: 'readonly',
    hubKV: 'readonly',
    hubDatabase: 'readonly',
    
    // 🔧 Nitro/H3 Auto-imports
    createError: 'readonly',
    readBody: 'readonly',
    getQuery: 'readonly',
    getCookie: 'readonly',
    setCookie: 'readonly',
    sendRedirect: 'readonly',
    defineEventHandler: 'readonly',
    
    // 🧪 Testing Globals
    describe: 'readonly',
    it: 'readonly',
    expect: 'readonly',
    beforeEach: 'readonly',
    afterEach: 'readonly',
    beforeAll: 'readonly',
    afterAll: 'readonly',
    vi: 'readonly'
  },
  ignorePatterns: [
    'dist',
    '.nuxt',
    '.output',
    'node_modules',
    '*.min.js',
    'UI&Idea-Box/**/*',
    'tests/**/*',
    '**/*.d.ts',
    '.github/**/*',
    'public/**/*'
  ],
  overrides: [
    // 📄 Specific rules for different file types
    {
      files: ['pages/**/*.vue', 'layouts/**/*.vue'],
      rules: {
        'vue/multi-word-component-names': 'off'
      }
    },
    {
      files: ['server/**/*.ts'],
      rules: {
        'no-console': 'off' // Server logs are acceptable
      }
    },
    {
      files: ['**/*.config.ts', '**/*.config.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off'
      }
    },
    {
      files: ['**/*.test.ts', '**/*.spec.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off'
      }
    }
  ]
} 