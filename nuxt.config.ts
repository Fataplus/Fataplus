import { defineNuxtConfig } from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-12-14",

  // 🚀 Performance: Disable heavy dev tools for faster builds
  devtools: {
    enabled: false, // Disabled for faster development builds
    timeline: {
      enabled: false,
    },
  },

  // Essential modules for Whop integration + NuxtHub
  modules: ["@nuxtjs/tailwindcss", "@nuxthub/core"],

  // TypeScript configuration - disable strict checking temporarily
  typescript: {
    typeCheck: false,
    strict: false,
  },

  // 🚀 NuxtHub FULL STACK Configuration - All Features Enabled
  hub: {
    ai: true, // ✅ AI features (Workers AI - Llama model)
    analytics: true, // ✅ Analytics pour dashboard
    blob: true, // ✅ File storage (images, docs)
    browser: true, // ✅ Puppeteer pour PDF generation
    cache: true, // ✅ Cache Redis pour performance
    database: true, // ✅ D1 SQLite pour données
    kv: true, // ✅ Key-Value store pour sessions
    vectorize: true, // ✅ Vector search pour IA
  },

  // CSS Framework: Tailwind CSS + Flowbite + Iconify
  css: ["~/assets/css/main.css"],

  // Configuration Nitro pour l'API + WebSockets (Fixed OpenAPI issue)
  nitro: {
    esbuild: {
      options: {
        target: "es2022",
      },
    },
    experimental: {
      openAPI: false, // 🔧 FIXED: Disabled to resolve path resolution error
      wasm: true, // 🚀 Enable WebAssembly support
      websocket: true, // 🚀 WebSockets pour temps réel
    },
  },

  // Font preloading for better performance
  app: {
    head: {
      link: [
        {
          rel: "preload",
          href: "/fonts/Fataplus-Book.ttf",
          as: "font",
          type: "font/ttf",
          crossorigin: "anonymous",
        },
        {
          rel: "preload",
          href: "/fonts/Fataplus-Medium.ttf",
          as: "font",
          type: "font/ttf",
          crossorigin: "anonymous",
        },
        {
          rel: "preload",
          href: "/fonts/Fataplus-SemiBold.ttf",
          as: "font",
          type: "font/ttf",
          crossorigin: "anonymous",
        },
      ],
    },
  },

  // Optimisations
  build: {
    analyze: false, // Désactivé pour accélérer le build
  },

  // Configuration intl (multilingue)
  runtimeConfig: {
    // Private keys (server-side only)
    whopApiKey: process.env.WHOP_API_KEY,
    whopAppId: process.env.WHOP_APP_ID,
    whopAgentUserId: process.env.WHOP_AGENT_USER_ID,

    // Public keys (client-side)
    public: {
      whopAppId: process.env.NEXT_PUBLIC_WHOP_APP_ID,
      whopAgentUserId: process.env.NEXT_PUBLIC_WHOP_AGENT_USER_ID,
      apiBaseUrl:
        process.env.NUXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
    },
  },
});
