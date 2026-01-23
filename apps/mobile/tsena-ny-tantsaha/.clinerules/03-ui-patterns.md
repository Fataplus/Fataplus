# Fataplus UI/UX Patterns

## 🎨 General Design Rules

- Use only **NuxtUI** components for UI consistency and accessibility
- Prioritize **mobile-first** design with responsive layouts
- Maintain a clean, minimal interface optimized for **agriculteurs**
- Favor clarity over decoration: large labels, clear icons, simple actions
- Use NuxtUI’s **theme tokens** to ensure color consistency

## 📦 Component Standards

### ✅ Buttons

- Use `UButton` for all actions (submit, navigate)
- Use clear, short labels (e.g. “Commander”, “Ajouter”, “Suivant”)
- Primary action → solid style, Secondary → outline/ghost

### 📝 Inputs & Forms

- Use `UInput`, `UTextarea`, `USelect`
- Always include `label`, `hint`, and `validation` props
- Use `<UForm>` with field validation on all form pages

### 📄 Cards

- Use `UCard` for:
  - Product previews
  - Course modules
  - Order summaries
- Always include:
  - Image or icon
  - Title
  - Price or progress
  - CTA (`UButton`)

### 🧭 Navigation

- Use a `default.vue` layout with:
  - Header: app logo, user menu
  - Footer: navigation for mobile (marketplace, courses, AI, profile)
- Use breadcrumbs in complex modules (e.g., `/courses/`)

## 📱 Mobile UI Behavior

- All pages must scroll vertically
- CTA buttons should be placed at bottom or sticky
- Use `UDialog` instead of navigation for quick actions (like product detail)
- Avoid overcrowding with text or options

## 🧠 AI Assistant Page (`/ai.vue`)

- Use a sticky chat layout:
  - `UTextarea` for message input
  - `UCard` for each message (user/AI)
  - Group messages by role and time
- Use emojis or colored tags for visual feedback

## ✅ UI Consistency Rules

- Use same component shape (rounded `lg`, spacing `4`) across app
- Use `UToast` for feedback (error, success, info)
- Reuse components for:
  - Product cards
  - Course cards
  - List items (orders, lessons)

## 🎯 Accessibility & Language

- Always use **French** labels in UI
- All inputs, buttons, and modals must support `aria-label` and screen readers
- Use clear labels for farmers with low digital literacy

## 🛠 Development Tips

- Place reusable components in `components/ui/`
- Use descriptive names like `ProductCard.vue`, `LessonCard.vue`
- Use composables for UI logic: `useCartUI.ts`, `useLessonUI.ts`
- Centralize theme tokens if overriding default NuxtUI theme