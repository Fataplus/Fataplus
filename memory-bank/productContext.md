# productContext.md

## Fataplus – Product & Technical Context

### Why Fataplus Exists

Fataplus is a digital platform designed to transform Madagascar’s agricultural sector by connecting farmers, buyers, trainers, and partners. It addresses isolation, lack of market access, limited training, and low digitalization by providing a unified, accessible, and AI-powered ecosystem for commerce, learning, and community.

---

## 1. Platform Architecture

Fataplus is built as a modular, domain-driven monorepo using NuxtHub (Nuxt 3, Vue 3, TypeScript) and Cloudflare Workers for edge-first, scalable, and API-centric deployment.

**Key Domains:**
- **Marketplace:** Multi-category e-commerce (seeds, tools, fertilizers, equipment), real-time order tracking, vendor management, Stripe payments, AI-powered recommendations.
- **Learning (LMS):** Interactive courses, video, quizzes, gamification, AI-powered learning paths, integration with Outline Wiki.
- **Community:** Farmer profiles, messaging, forums, events, matchmaking, collaborative projects.
- **AI Assistant:** 24/7 Madagascar agriculture expert, AutoRAG, vector search, bilingual (FR/MG), regional/seasonal intelligence.
- **Integrations:** ERP (Dolibarr), file management (Nextcloud), document signing (DocuSeal), payment (Stripe), knowledge base (Outline), media (Cloudinary), real-time (Pusher).

**Folder Structure:**
```
Fataplus/
├── modules/marketplace/    # E-commerce
├── modules/learning/       # LMS & AI
├── modules/community/      # Social & networking
├── shared/                 # UI, composables, types, utils
├── integrations/           # External service connectors
├── server/                 # API, database, middleware
├── tests/                  # Unit, integration, E2E
```

---

## 2. Technology Stack

**Frontend:**
- Nuxt 3 (Vue 3, TypeScript, Nuxt UI, Pinia, Tailwind CSS)
- Responsive, accessible (WCAG 2.1 AA), mobile-first, dark/light mode
- Multilingual (French/Malagasy), i18n, RTL-ready

**Backend & Cloud:**
- NuxtHub (Cloudflare Workers, D1 SQL, R2 Blob, KV, Edge Cache)
- Nitro server engine (WebSockets ready)
- Drizzle ORM (type-safe DB)
- Auth.js (authentication), Zod (validation)
- API-first, modular, scalable

**AI & Automation:**
- Workers AI (Llama-2-7b, edge inference)
- Vectorize (semantic search, recommendations)
- AutoRAG (contextual knowledge base)
- Browser automation (PDF, Puppeteer)
- Real-time (WebSockets, Pusher)

**Integrations:**
- Stripe, Cloudinary, Dolibarr, Nextcloud, DocuSeal, Outline, Pusher

**Dev Tools:**
- ESLint, Prettier, Vitest, Playwright, TypeScript strict

---

## 3. Key Features & Modules

### Marketplace
- Multi-category product catalog (fruits, vegetables, processed goods, etc.)
- Real-time order/delivery tracking, dynamic pricing, inventory management
- Vendor onboarding, verification, analytics, payout, commission
- AI-powered product search & recommendations (vector search)
- Multi-payment (cash, digital, mobile money, Stripe, POS)
- Admin panel for products, orders, users, roles

### Learning (LMS)
- Notion-like blocks, video, docs, quizzes, collections
- AI assistant: document upload, synthesis, Q&A, quiz generation, note org, citation
- Personalized learning paths, progress, badges, gamification
- Integration: Outline Wiki, Nextcloud, DocuSeal
- Mobile-optimized, offline/online support

### Community
- Farmer profiles (public/private, verification, skills, location)
- Real-time chat, group messaging, file sharing, moderation
- Events calendar, meetups, workshops, registration, feedback
- Forums, Q&A, expert badges, moderation, search/filter
- Matchmaking: expertise, mentorship, business partnerships
- Notifications: push, email, SMS, in-app

### AI Assistant
- 24/7 Madagascar agriculture expert (FR/MG)
- AutoRAG: 5 major crops, agricultural calendar, regional/seasonal intelligence
- Vector search for recommendations
- Bilingual, regional, and seasonal adaptation

### Integrations
- Dolibarr (ERP), Nextcloud (files), DocuSeal (signing), Outline (wiki), Stripe (payments), Cloudinary (media), Pusher (real-time)
- Unified authentication (SSO), API access for automation (n8n), central dashboard

---

## 4. Security, Compliance & Accessibility

- Fine-grained RBAC, JWT, 2FA, session management
- GDPR compliance, data privacy, encrypted storage
- Input validation (Zod), XSS/CSRF protection, secure file upload
- HTTPS, CORS, security headers, rate limiting, logging
- Accessibility: WCAG 2.1 AA, screen reader, keyboard nav, high contrast
- Mobile-first, offline/edge support

---

## 5. Design & UX Principles

- User-centric: simple, clear navigation, feedback, gamification, onboarding
- Modular, maintainable, testable code (feature-based, DDD)
- Responsive, accessible, multi-language, inclusive UX
- Fataplus branding, color, logo, icons
- Progressive enhancement, fast loading, edge-first

---

## 6. Unique Aspects

- Edge-native, serverless, and vectorized AI for Madagascar agriculture
- Modular, domain-driven monorepo for rapid feature development
- Deep integration with local/ERP tools (Dolibarr, Nextcloud, etc.)
- AI-powered learning, marketplace, and community features
- Designed for low-bandwidth, mobile, and rural contexts

---

## 7. Business Rules & Constraints

- All user input validated client & server side
- Multi-role: admin, seller, learner, delivery, mentor, etc.
- Multi-store, multi-branch, centralized admin
- Real-time analytics, reporting, notifications
- Open to innovation: AI, RAG, automation, new integrations

---

## 8. Roadmap & Status (July 2025)

- Marketplace: 85% (AI search, vendor, payments, analytics)
- Learning: 70% (AI assistant, gamification, Outline integration)
- Community: 65% (profiles, forums, chat, events)
- AI Assistant: 90% (AutoRAG, vector search, regional/seasonal)
- Integrations: 80% (Stripe, Cloudinary, Dolibarr, Nextcloud, DocuSeal)
- Security, accessibility, and mobile: ongoing
- Next: WebSockets, mobile app, learning module, community, analytics, new integrations

---

## 9. References

- See memory-bank/projectbrief.md for business vision and goals.
- See README.md for up-to-date technical and architectural details.
- See .cursor/rules for domain-specific coding standards and compliance.
