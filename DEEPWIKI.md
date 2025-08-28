# Deepwiki: Fataplus Nuxt Project

This document provides a detailed overview of the Fataplus Nuxt project structure, key files, and configurations.

## Project Overview

This is a Nuxt.js project that uses NuxtHub for deployment on Cloudflare. It includes a variety of features, such as user authentication, an admin dashboard, an AI assistant, a marketplace, and a content management system.

## Key Technologies

- **Framework:** [Nuxt.js](https://nuxt.com/)
- **Deployment:** [NuxtHub](https://hub.nuxt.com/) on [Cloudflare](https://www.cloudflare.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with [Flowbite](https://flowbite.com/)
- **Database:** D1 (SQLite)
- **AI:** Cloudflare Workers AI (Llama model)
- **Testing:** [Playwright](https://playwright.dev/)

## Project Structure

```
.
├── AI Instructions/      # Instructions and guides for the AI assistant
├── Fataplus Systems/     # System-related documentation
├── assets/               # CSS, fonts, and other static assets
├── components/           # Reusable Vue components
├── composables/          # Reusable Vue composables
├── content/              # Content for the website (articles, courses, etc.)
├── docs/                 # Project documentation
├── layouts/              # Layout components for different page types
├── lib/                  # Third-party libraries
├── locales/              # Translation files
├── middleware/           # Route middleware for authentication and authorization
├── modules/              # Custom Nuxt modules
├── pages/                # Application pages and routes
├── plugins/              # Nuxt plugins
├── public/               # Static files that are publicly accessible
├── scripts/              # Helper scripts for development and deployment
├── server/               # Server-side API routes and logic
├── shared/               # Shared components, constants, and data
├── systems/              # System-related code (adapters, events, etc.)
├── tests/                # End-to-end and unit tests
├── .github/              # GitHub Actions workflows and templates
├── nuxt.config.ts        # Nuxt.js configuration file
├── package.json          # Project dependencies and scripts
└── wrangler.toml         # Cloudflare Workers configuration file
```

## Key Files

- **`nuxt.config.ts`:** This file contains the main configuration for the Nuxt.js project, including modules, build settings, and environment variables.
- **`wrangler.toml`:** This file is used to configure the Cloudflare Workers deployment, including the account ID, worker name, and build settings.
- **`.github/workflows/nuxthub.yml`:** This GitHub Actions workflow automates the deployment of the project to NuxtHub on every push to the main branch.
- **`server/`:** This directory contains the server-side logic of the application, including API routes, database connections, and authentication middleware.
- **`pages/`:** This directory contains the application's pages and routes. Each `.vue` file in this directory corresponds to a specific route.
- **`components/`:** This directory contains reusable Vue components that are used throughout the application.
- **`content/`:** This directory contains the content for the website, which is managed by Nuxt Content.

## Deployment

The project is deployed to NuxtHub on every push to the main branch. The deployment process is defined in the `.github/workflows/nuxthub.yml` file.

To deploy the project manually, you can use the following command:

```bash
npx nuxi deploy
```
