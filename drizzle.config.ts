import type { Config } from 'drizzle-kit'

export default {
  schema: './server/database/schema.ts',
  out: './server/database/migrations',
  driver: 'sqlite',
  dbCredentials: {
    url: './server/database/sqlite.db'
  },
  verbose: true,
  strict: true
} satisfies Config

// ⚠️ Cette configuration est compatible NuxtHub (Nuxt 3 + drizzle-orm) pour SQLite local.
// ⚠️ Les commandes CLI drizzle-kit migrate/generate ne fonctionneront pas avec cette version du CLI.
// ⚠️ Pour les migrations, utilise le runtime NuxtHub ou un script custom, ou migre vers Postgres pour le support CLI complet.
