// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-06-24',
  devtools: { enabled: true },
  
  // Minimal modules to get basic app working
  modules: [
    '@nuxtjs/tailwindcss'
  ],

  // Configuration CSS et UI
  css: ['~/assets/css/main.css'],
  
  // Temporarily commented out modules configurations
  // i18n: {...},
  // site: {...},
  // auth: {...},
  // cloudinary: {...},

  // Configuration des variables d'environnement
  runtimeConfig: {
    // Privées (côté serveur)
    authSecret: process.env.NUXT_AUTH_SECRET,
    databaseUrl: process.env.DATABASE_URL,
    openaiApiKey: process.env.OPENAI_API_KEY,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    emailHost: process.env.EMAIL_HOST,
    emailUser: process.env.EMAIL_USER,
    emailPassword: process.env.EMAIL_PASSWORD,
    pusherAppId: process.env.PUSHER_APP_ID,
    pusherKey: process.env.PUSHER_KEY,
    pusherSecret: process.env.PUSHER_SECRET,
    pusherCluster: process.env.PUSHER_CLUSTER,
    
    // Publiques (côté client)
    public: {
      stripePublishableKey: process.env.NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      pusherKey: process.env.NUXT_PUBLIC_PUSHER_KEY,
      pusherCluster: process.env.NUXT_PUBLIC_PUSHER_CLUSTER,
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
      cloudronUrl: process.env.NUXT_PUBLIC_CLOUDRON_URL || 'https://my.fata.plus'
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
      title: 'Fataplus - Agriculture Madagascar',
      meta: [
        { name: 'description', content: 'Plateforme dédiée à l\'agriculture à Madagascar : marché, formation, communauté' },
        { name: 'keywords', content: 'agriculture, madagascar, marché, formation, communauté, IA' },
        { property: 'og:title', content: 'Fataplus - Agriculture Madagascar' },
        { property: 'og:description', content: 'Plateforme dédiée à l\'agriculture à Madagascar' },
        { property: 'og:image', content: '/og-image.jpg' },
        { property: 'og:url', content: 'https://fataplus.mg' },
        { name: 'twitter:card', content: 'summary_large_image' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }
      ]
    }
  },

  // Configuration TypeScript (temporarily simplified)
  typescript: {
    strict: false,
    typeCheck: false
  },

  // Configuration de build pour la production
  build: {
    transpile: ['@headlessui/vue']
  },

  // Configuration des composants
  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ],

  // Configuration des imports automatiques
  imports: {
    dirs: ['stores', 'composables', 'utils']
  }
}) 