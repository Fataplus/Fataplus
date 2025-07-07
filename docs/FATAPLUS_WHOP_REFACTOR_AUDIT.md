# Fataplus x Whop Refactor Audit

## 1. Features Overlapping with Whop

### Features to Proxy/Remove (Handled by Whop)
- **Authentication**: Login, registration, session management
- **Memberships/Access Control**: User roles, product access, company/org management
- **Payments**: Checkout, payment processing, invoices, webhooks
- **Messaging**: Direct messages, chat, feed messages
- **User Profile (core fields)**: Basic user info, company info

### Features to Keep (Fataplus-Unique)
- **AI Assistant**: Agriculture assistant, smart search, recommendations, learning path, etc.
- **Custom Content**: Articles, guides, courses, knowledge base, stories, etc.
- **Integrations**: Nextcloud, Dolibarr, DocuSeal, Outline, etc.
- **Analytics/Reporting**: Custom analytics not covered by Whop
- **Branding/UX**: Fataplus-specific themes, colors, gamification, onboarding

---

## 2. UI Component Audit

### Current Fataplus UI Components (to be mapped)
- AppHeader.vue
- BottomNavigation.vue
- FlowbiteCard.vue
- components/marketplace/ProductCard.vue
- components/AI/AgricultureAssistant.vue
- components/community/*
- components/learning/*
- components/ui/*
- pages/auth/*
- pages/admin/*
- pages/marketplace/*
- pages/community/*
- pages/learning/*
- layouts/admin.vue

### Mapping Plan
- **Replace**: Auth, payment, messaging, and company/org management UIs with Whop design system components (storybook.whop.dev).
- **Override**: Apply Fataplus colors, fonts, and themes to Whop components.
- **Keep/Enhance**: AI, content, and integration UIs.

---

## 3. Next Steps

- [ ] For each overlapping feature, mark the files/components to be removed or proxied.
- [ ] For each UI component, note the Whop design system equivalent (if any).
- [ ] For each Fataplus-unique feature, confirm it will be kept and enhanced.
- [ ] Prepare a checklist for actual code refactor (removal, replacement, override).

---

_Last updated: 2025-07-07_
