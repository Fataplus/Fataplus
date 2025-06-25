module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2022: true
  },
  extends: [
    '@nuxt/eslint-config',
    'plugin:vue/vue3-recommended',
    'prettier'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint',
    'vue'
  ],
  rules: {
    // Vue-specific rules (relaxed for CI)
    'vue/multi-word-component-names': 'off',
    'vue/no-multiple-template-root': 'off',
    'vue/attributes-order': 'off',
    'vue/require-default-prop': 'off',
    
    // TypeScript rules (relaxed for CI)
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    
    // General rules
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'prefer-const': 'off'
  },
  globals: {
    // Nuxt 3 auto-imports
    $fetch: 'readonly',
    navigateTo: 'readonly',
    useRoute: 'readonly',
    useRouter: 'readonly',
    useState: 'readonly',
    useCookie: 'readonly',
    useRuntimeConfig: 'readonly',
    definePageMeta: 'readonly',
    defineNuxtConfig: 'readonly',
    cachedEventHandler: 'readonly',
    hubVectorize: 'readonly',
    hubBrowser: 'readonly',
    createError: 'readonly',
    readBody: 'readonly'
  },
  ignorePatterns: [
    'dist',
    '.nuxt',
    '.output',
    'node_modules',
    '*.min.js',
    'UI&Idea-Box/**/*',
    'tests/**/*',
    '**/*.d.ts'
  ]
} 