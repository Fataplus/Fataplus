## Prerequisites
- Node.js `>=18` installed (Astro v5 requires modern Node)
- `npm` available (repo uses `package-lock.json`)

## Install Dependencies
- In the project root: `npm install`

## Start the Dev Server
- Run: `npm run dev`
- Open: `http://localhost:4321`
- Reference: scripts in `package.json:7-12` (`dev`: `astro dev`, `preview`: `astro preview`)

## Use Port 3000 (Optional)
- Command: `npm run dev -- --port 3000`
- Then open: `http://localhost:3000`
- No port override in `astro.config.mjs:7-34`, so flags control the port

## Build & Preview (Production Check)
- Build: `npm run build`
- Preview the build: `npm run preview`

## Troubleshooting
- Port already in use: add `--port <free_port>` (e.g., `--port 3001`)
- Node version errors: confirm `node -v` is `>=18`
- Clean install issues: remove `node_modules` and `package-lock.json`, then `npm install`

## Codebase Notes
- Framework: Astro v5 (Vite under the hood)
- Config: `astro.config.mjs:7-34` with Tailwind via `@tailwindcss/vite` and i18n via `astro-i18next`
- No `.env` required; no `process.env`/`import.meta.env` usage found

Confirm and I will run the dev server and surface the live preview URL here.