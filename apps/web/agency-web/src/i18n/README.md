# Internationalization (i18n) Setup

This document explains how the internationalization system is set up in this Astro project.

## Overview

The project uses `astro-i18next` for internationalization support with the following features:
- Multi-language support (English, Spanish, French)
- Path-based routing strategy
- Language switcher component
- Translation utilities

## Configuration

### astro.config.mjs
```javascript
i18n({
  defaultLocale: 'en',
  locales: ['en', 'es', 'fr'],
  strategy: 'pathname',
  baseRoute: 'i18n',
})
```

## Translation Files

Translation files are located in `src/i18n/locales/`:
- `en.json` - English translations
- `es.json` - Spanish translations
- `fr.json` - French translations

### File Structure
```json
{
  "nav": {
    "home": "Home",
    "work": "Work",
    // ...
  },
  "footer": {
    "rights": "All rights reserved",
    // ...
  },
  "common": {
    "learnMore": "Learn More",
    // ...
  }
  // ...
}
```

## Usage in Components

### Astro Components
```astro
---
import { t } from 'astro-i18next';
---

<h1>{t("home.hero.title")}</h1>
<p>{t("home.hero.description")}</p>
```

### TypeScript/JavaScript
```typescript
import { t } from 'astro-i18next';
import { getCurrentLocale, getLanguageInfo } from '@/i18n/utils';

const currentLocale = getCurrentLocale(request);
const title = t("nav.home");
const languageInfo = getLanguageInfo(currentLocale);
```

## Language Switcher

The language switcher component is automatically included in the BaseLayout and appears in:
- Top-right corner on desktop
- Top-right corner on mobile

## URL Structure

With the pathname strategy:
- English: `https://example.com/en/page`
- Spanish: `https://example.com/es/page`
- French: `https://example.com/fr/page`

## Adding New Translations

1. Add the translation key to all language files in `src/i18n/locales/`
2. Use the translation in components with `t("your.key.here")`

### Example
Add to all locale files:
```json
{
  "newSection": {
    "title": "New Section",
    "description": "This is a new section"
  }
}
```

Use in component:
```astro
<h2>{t("newSection.title")}</h2>
<p>{t("newSection.description")}</p>
```

## Adding a New Language

1. Add the language code to `astro.config.mjs`
2. Create a new translation file in `src/i18n/locales/`
3. Update the language switcher component with the new language
4. Update the `getLanguageInfo` utility in `src/i18n/utils.ts`

## Best Practices

1. Use descriptive, nested keys (e.g., `nav.home` instead of just `home`)
2. Keep translations consistent across all language files
3. Use meaningful variable names for interpolated translations
4. Test all language versions when making changes
5. Consider cultural differences in translations, not just direct word-for-word translation