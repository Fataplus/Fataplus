export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // Modules essentiels pour Fataplus
  modules: [
    '@nuxt/ui',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
    '@nuxtjs/cloudinary',
    '@sidebase/nuxt-auth',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@uploadthing/nuxt'
  ],

  // Configuration CSS et UI
  css: ['~/assets/css/main.css'],
  
  // Configuration i18n (multilingue FR/MG)
  i18n: {
    locales: [
      { code: 'fr', name: 'Français', file: 'fr.json' },
      { code: 'mg', name: 'Malagasy', file: 'mg.json' }
    ],
    defaultLocale: 'fr',
    langDir: 'locales/',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  },

  // Configuration SEO
  site: {
    url: 'https://fataplus.mg',
    name: 'Fataplus',
    description: 'Plateforme numérique dédiée à l\'agriculture à Madagascar',
    defaultLocale: 'fr'
  },

  // Configuration de l'authentification
  auth: {
    baseURL: process.env.AUTH_ORIGIN,
    provider: {
      type: 'authjs'
    }
  },

  // Configuration Cloudinary pour les médias
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
  },

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

  // Configuration TypeScript
  typescript: {
    strict: true,
    typeCheck: true
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