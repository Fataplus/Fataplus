# Fataplus Project Rules

## 🔥 Project Overview

- Project Name: **Fataplus**
- Purpose: Build a modern agricultural platform for Madagascar, including:
  - Marketplace for farmers and buyers
  - LMS for agricultural training
  - AI Assistant (ChatGPT-based) for farming guidance

## 🧱 Architecture Guidelines

- Use **NuxtHub** as the fullstack backend + frontend platform (database, API, auth)
- Use **NuxtUI** for all UI components (cards, buttons, modals, inputs, alerts)
- No external CMS (e.g., Directus) or backend (e.g., Supabase) should be used
- Host blob images in NuxtHub `blob/` storage
- Use `vectorize/` and `AutoRAG` for AI-powered assistant and semantic content

## 📁 Pages to Build

- `/` → Landing page in French
- `/login`, `/register`, `/profile` → Auth
- `/marketplace` → Product listing (fresh produce: tomatoes, rice, etc.)
- `/marketplace/[id]` → Product details + add to cart
- `/orders` → Order history
- `/courses`, `/courses/[slug]` → Learning modules
- `/ai` → Smart AI assistant chat
- `/admin` → Optional admin dashboard

## 📦 Database Tables

- `products`: name, price, unit, stock, image
- `orders`: user_id, product_id, quantity, total, status
- `courses`: title, description, cover, instructor, lessons
- `lessons`: course_id, title, content, video
- `progress`: user_id, course_id, lesson_id, completed
- `users`: name, email, password, role
- `messages`: user_id, content, type (user/ai), timestamp

## 💬 Design & UI Rules

- Use `UCard` for product/course display
- Use `UButton`, `UInput`, `UTextarea`, `UTabs` as building blocks
- Always display content in **French first**
- UI must be mobile-friendly (responsive)

## 🤖 AI Assistant

- Call `/api/ai.ts` for assistant using OpenAI or custom endpoint
- Use NuxtHub `vectorize/` for AutoRAG content (e.g. course summaries)
- Display assistant in `/ai.vue` with NuxtUI chat-style layout

## ✅ Development Rules

- Use **GitHub Copilot** with precise inline comments:
  - `// build a product card for tomatoes`
  - `// create NuxtHub database for courses`
  - `// setup blob upload for lesson videos`
- Separate composables: `useCart`, `useAuth`, `useProducts`
- Reuse layout system: `default.vue`, `auth.vue`, `admin.vue`

## 🧪 Testing Guidelines

- Manually test critical flows:
  - login → add to cart → checkout
  - course enrollment → progress
  - AI assistant reply

## 🧠 Developer Notes

- Target launch: **before May 23**
- Focus on MVP speed > full polish
- Use Cline + Copilot to automate repetitive parts