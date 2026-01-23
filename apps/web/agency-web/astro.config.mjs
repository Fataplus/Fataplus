import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import mermaid from "astro-mermaid";
import i18n from "astro-i18next";

export default defineConfig({
  redirects: {
    "/blog": "/blog/1",
    "/blog/home-2": "/blog/home-2/1",
    "/blog/home-3": "/blog/home-3/1",
  },
  devToolbar: { enabled: false },
  output: "server",
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    }
  }),
  vite: {
    plugins: [tailwindcss()],
    server: {
      hmr: {
        overlay: false,
      },
    },
  },
  markdown: {
    drafts: true,
    shikiConfig: {
      theme: "css-variables",
    },
  },
  site: "https://fata.plus",
  integrations: [
    sitemap(),
    mermaid(),
    i18n({
      defaultLocale: 'en',
      locales: ['en', 'es', 'fr'],
      strategy: 'pathname',
      baseRoute: 'i18n',
    })
  ],
});
