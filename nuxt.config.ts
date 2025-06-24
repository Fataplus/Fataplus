import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-06-24',
  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  },
  
  // Only essential modules
  modules: [
    '@nuxtjs/tailwindcss'
    // Pinia completely removed
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
    // Privées (côté serveur)
    authSecret: process.env['NUXT_AUTH_SECRET'] || 'fataplus-super-secret-key-2025-madagascar-agriculture',
    databaseUrl: process.env['DATABASE_URL'] || './server/database/sqlite.db',
    openaiApiKey: process.env['OPENAI_API_KEY'],
    stripeSecretKey: process.env['STRIPE_SECRET_KEY'],
    emailHost: process.env['EMAIL_HOST'],
    emailUser: process.env['EMAIL_USER'],
    emailPassword: process.env['EMAIL_PASSWORD'],
    pusherAppId: process.env['PUSHER_APP_ID'],
    pusherKey: process.env['PUSHER_KEY'],
    pusherSecret: process.env['PUSHER_SECRET'],
    pusherCluster: process.env['PUSHER_CLUSTER'],
    
    // Publiques (côté client)
    public: {
      stripePublishableKey: process.env['NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'],
      pusherKey: process.env['NUXT_PUBLIC_PUSHER_KEY'],
      pusherCluster: process.env['NUXT_PUBLIC_PUSHER_CLUSTER'],
      apiBase: process.env['NUXT_PUBLIC_API_BASE'] || '/api',
      cloudronUrl: process.env['NUXT_PUBLIC_CLOUDRON_URL'] || 'https://my.fata.plus'
    }
  },

  // Configuration Nitro pour l'API
  nitro: {
    experimental: {
      wasm: true
    },
    esbuild: {
      options: {
        target: 'es2022'
      }
    }
  },

  // Configuration du routage
  router: {
    options: {
      scrollBehaviorType: 'smooth'
    }
  },

  // Configuration des métadonnées
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Fataplus - Agriculture Numérique Madagascar',
      meta: [
        { name: 'description', content: 'Plateforme dédiée à l\'agriculture à Madagascar : marché, formation, communauté' },
        { name: 'keywords', content: 'agriculture, madagascar, marché, formation, communauté, IA' },
        { property: 'og:title', content: 'Fataplus - Agriculture Madagascar' },
        { property: 'og:description', content: 'Plateforme dédiée à l\'agriculture à Madagascar' },
        { property: 'og:image', content: '/og-image.jpg' },
        { property: 'og:url', content: 'https://fataplus.mg' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#16a34a' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }
      ]
    }
  },

  // Enhanced auto-import configuration for all composables
  imports: {
    dirs: [
      'composables',
      'composables/**',
      'utils',
      'utils/**'
    ]
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
    }
  ],

  // Vite configuration for better module resolution
  vite: {
    define: {
      global: 'globalThis'
    }
  },

  // Enhanced TypeScript configuration
  typescript: {
    strict: false, // Temporarily disabled to avoid blocking issues
    typeCheck: false // Disabled to speed up development
  },

  // Configuration de build pour la production
  build: {
    transpile: ['@headlessui/vue']
  }
})