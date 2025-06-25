import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-12-14',
  
  // 🚀 Performance: Disable heavy dev tools for faster builds
  devtools: {
    enabled: false, // Disabled for faster development builds
    timeline: {
      enabled: false
    }
  },
  
  // Essential modules + NuxtHub
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxthub/core'
  ],

  // Configuration CSS
  css: ['~/assets/css/main.css'],
  
  // Temporarily commented out modules configurations
  // i18n: {...},
  // site: {...},
  // auth: {...},
  // cloudinary: {...},

  // Configuration des variables d'environnement
  runtimeConfig: {
    // Private keys (only available on the server-side)
    authSecret: process.env['AUTH_SECRET'] || 'your-super-secret-auth-key-here',
    
    // Public keys (exposed to the client-side)
    public: {
      apiBase: '/api'
    }
  },

  // Auto-import components
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
    {
      path: '~/shared/components',
      pathPrefix: false,
      extensions: ['vue']
    }
  ],

  // Configuration Nitro pour l'API
  nitro: {
    esbuild: {
      options: {
        target: 'es2022'
      }
    },
    experimental: {
      openAPI: true
    }
  },

  // Build optimizations 
  vite: {
    esbuild: {
      target: 'es2022'
    }
  }
})