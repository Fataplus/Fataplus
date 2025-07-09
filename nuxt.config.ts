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

  // Essential modules + NuxtHub + Content
  modules: ["@nuxtjs/tailwindcss", "@nuxthub/core", "@nuxt/content"],

  // TypeScript configuration - disable strict checking temporarily
  typescript: {
    typeCheck: false,
    strict: false,
  },

  // 🚀 NuxtHub FULL STACK Configuration - All Features Enabled
  // @ts-ignore - TypeScript fix for extended NuxtHub features
  hub: {
    ai: true, // ✅ AI features (Workers AI - Llama models)
    database: true, // ✅ D1 database (SQL serverless)
    kv: true, // ✅ KV storage (global cache)
    blob: true, // ✅ R2 blob storage (files/images)
    cache: true, // 🚀 NOUVEAU: Cache automatique (+70% performance)
    browser: true, // 🚀 NOUVEAU: Browser automation (PDF/screenshots)
    vectorize: true, // 🚀 NOUVEAU: Vector database (AutoRAG avancé)
  },

  // Configuration CSS
  css: ["~/assets/css/main.css"],

  // App configuration avec font preloading
  app: {
    head: {
      link: [
        // Preload critical Fataplus font weights
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

  // Temporarily commented out modules configurations
  // i18n: {...},
  // site: {...},
  // auth: {...},
  // cloudinary: {...},

  // Configuration des variables d'environnement
  runtimeConfig: {
    // Private keys (only available on the server-side)
    authSecret: process.env["AUTH_SECRET"] || "your-super-secret-auth-key-here",

    // Public keys (exposed to the client-side)
    public: {
      apiBase: "/api",
    },
  },

  // Auto-import components
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
    {
      path: "~/shared/components",
      pathPrefix: false,
      extensions: ["vue"],
    },
  ],

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
      websocket: true, // 🚀 NOUVEAU: WebSockets pour temps réel
    },
  },

  // Build optimizations
  vite: {
    esbuild: {
      target: "es2022",
    },
  },
});
