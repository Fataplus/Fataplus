# 📝 Nuxt Content v3 - Guide d'Utilisation Fataplus

## 🎯 Vue d'ensemble

Fataplus utilise **Nuxt Content v3** comme système de gestion de contenu unifié pour toutes les données de la plateforme : marketplace, formations, articles, guides agricoles, base de connaissances et pages légales.

## 🏗️ Architecture des Collections

### Structure des Dossiers

```
content/
├── products/          # 🛒 Produits marketplace
├── courses/           # 📚 Cours de formation
├── articles/          # 📰 Articles communauté
├── guides/            # 📖 Guides agricoles
├── knowledge/         # 🤖 Base de connaissances IA
├── legal/             # 📄 Pages légales
└── stories/           # 🎉 Témoignages agriculteurs
```

### Collections Définies

#### 1. **Products** (Marketplace)

```yaml
---
title: "Nom du produit"
description: "Description du produit"
price: 25000
category: "seeds" | "tools" | "fertilizers" | "equipment" | "organic"
vendor: "Nom du vendeur"
region: "SAVA" | "Alaotra-Mangoro" | etc.
featured: true
images: ["url1.jpg", "url2.jpg"]
tags: ["vanille", "graines", "premium"]
availability: "in-stock" | "out-of-stock" | "pre-order"
publishedAt: 2024-12-16
---
```

#### 2. **Courses** (Formation)

```yaml
---
title: "Titre du cours"
description: "Description du cours"
instructor: "Nom de l'instructeur"
level: "beginner" | "intermediate" | "advanced"
duration: "6 semaines"
category: "crop-management" | "livestock" | "pest-control" | etc.
price: 0
featured: true
certificate: true
objectives: ["Objectif 1", "Objectif 2"]
modules:
  - title: "Module 1"
    duration: "1 semaine"
    content: "Description"
publishedAt: 2024-12-15
---
```

#### 3. **Articles** (Communauté)

```yaml
---
title: "Titre de l'article"
description: "Résumé de l'article"
author: "Nom de l'auteur"
category: "news" | "tips" | "market-updates" | etc.
featured: true
region: "SAVA"
readTime: "8 min de lecture"
tags: ["vanille", "prix", "export"]
publishedAt: 2024-12-16
---
```

#### 4. **Guides** (Guides Agricoles)

```yaml
---
title: "Guide de Plantation"
description: "Guide complet pour..."
category: "planting" | "harvesting" | "pest-management" | etc.
crop: "vanilla" | "rice" | "clove" | etc.
difficulty: "easy" | "medium" | "hard"
region: "SAVA"
tools: ["Bêche", "Sécateur"]
materials: ["Plants de vanille"]
duration: "1 journée"
featured: true
publishedAt: 2024-12-16
---
```

#### 5. **Knowledge** (Base de Connaissances IA)

```yaml
---
title: "Titre de la connaissance"
category: "crops" | "livestock" | "weather" | etc.
keywords: ["vanille", "plantation", "SAVA"]
crop: "vanilla"
region: "SAVA"
confidence: 0.95
sources: ["source1", "source2"]
lastVerified: 2024-12-16
---
```

#### 6. **Legal** (Pages Légales)

```yaml
---
title: "Conditions Générales"
type: "terms" | "privacy" | "cookies" | etc.
version: "1.0"
effectiveDate: 2024-12-16
lastUpdated: 2024-12-16
---
```

#### 7. **Stories** (Témoignages)

```yaml
---
title: "Histoire de succès"
farmer:
  name: "Nom de l'agriculteur"
  location: "Localisation"
  crop: "vanille"
story: "Description de l'histoire"
results:
  yield_increase: "50%"
  income_increase: "30%"
featured: true
publishedAt: 2024-12-16
---
```

## 🔧 Utilisation du Composable

### Import et Utilisation

```typescript
// Dans vos pages/composants
const { getProducts, getFeaturedProducts, getCourses, getArticles, getGuides } =
  useFataplusContent();

// Récupérer des produits en vedette
const featuredProducts = await getFeaturedProducts(6);

// Récupérer des cours par niveau
const beginnerCourses = await getCourses({ level: "beginner", limit: 10 });

// Récupérer des articles par région
const savaArticles = await getArticles({ region: "SAVA", limit: 5 });
```

### Fonctions Disponibles

#### Products (Marketplace)

- `getProducts(options)` - Liste des produits avec filtres
- `getProduct(slug)` - Un produit spécifique
- `getFeaturedProducts(limit)` - Produits en vedette

#### Courses (Formation)

- `getCourses(options)` - Liste des cours avec filtres
- `getCourse(slug)` - Un cours spécifique
- `getFeaturedCourses(limit)` - Cours en vedette

#### Articles (Communauté)

- `getArticles(options)` - Liste des articles avec filtres
- `getArticle(slug)` - Un article spécifique
- `getFeaturedArticles(limit)` - Articles en vedette

#### Guides (Documentation)

- `getGuides(options)` - Liste des guides avec filtres
- `getGuide(slug)` - Un guide spécifique
- `getFeaturedGuides(limit)` - Guides en vedette

#### Legal & Autres

- `getLegalPage(type)` - Page légale par type
- `getHomepageContent()` - Contenu pour la page d'accueil

## 📝 Workflow de Création de Contenu

### 1. Créer un Nouveau Produit

```bash
# Créer le fichier
touch content/products/nouveau-produit.md
```

```markdown
---
title: "Nouveau Produit Agricole"
description: "Description du nouveau produit"
price: 15000
category: "tools"
vendor: "Vendeur Local"
region: "Analamanga"
featured: false
tags: ["outil", "agriculture", "moderne"]
availability: "in-stock"
publishedAt: 2024-12-16
---

# Nouveau Produit Agricole

## Description détaillée

Contenu en Markdown du produit...

## Spécifications

- **Matériau** : Acier inoxydable
- **Dimensions** : 30cm x 15cm
- **Poids** : 2kg

## Mode d'emploi

1. Étape 1
2. Étape 2
3. Étape 3
```

### 2. Créer un Nouveau Cours

```bash
touch content/courses/nouveau-cours.md
```

### 3. Créer un Nouvel Article

```bash
touch content/articles/nouvel-article.md
```

### 4. Créer un Nouveau Guide

```bash
touch content/guides/nouveau-guide.md
```

## 🎨 Composants de Rendu

### Utilisation avec ContentList

```vue
<template>
  <ContentList path="/products" v-slot="{ list }">
    <div v-for="product in list" :key="product._path" class="product-card">
      <h3>{{ product.title }}</h3>
      <p>{{ product.description }}</p>
      <span>{{ product.price }} MGA</span>
    </div>
  </ContentList>
</template>
```

### Utilisation avec ContentRenderer

```vue
<template>
  <div>
    <ContentDoc path="/products/vanilla-seeds" v-slot="{ doc }">
      <div>
        <h1>{{ doc.title }}</h1>
        <p>Prix: {{ doc.price }} MGA</p>
        <ContentRenderer :value="doc" />
      </div>
    </ContentDoc>
  </div>
</template>
```

## 🔍 Recherche et Filtrage

### Recherche Avancée

```typescript
// Recherche par mots-clés dans tous les contenus
const results = await searchContent("vanille", [
  "products",
  "guides",
  "articles",
]);

// Filtres spécifiques
const savaProducts = await getProducts({
  region: "SAVA",
  category: "seeds",
  featured: true,
  limit: 10,
});

// Guides par culture
const vanillaGuides = await getGuides({
  crop: "vanilla",
  difficulty: "medium",
  limit: 5,
});
```

### Tri et Pagination

```typescript
// Tri par date de publication
const latestProducts = await getProducts({
  sort: "publishedAt",
  limit: 20,
});

// Articles les plus récents
const recentArticles = await getArticles({
  limit: 10,
}); // Déjà trié par publishedAt desc
```

## 🚀 Déploiement avec NuxtHub

### Configuration Automatique

Nuxt Content est automatiquement configuré pour NuxtHub :

- Contenu stocké dans Cloudflare D1
- CDN global pour les assets
- Cache intelligent des requêtes

### Variables d'Environnement

```bash
# .env
NUXT_CONTENT_DATABASE_URL=d1://your-d1-database
```

## 📊 Performance et Optimisation

### Cache Strategy

```typescript
// Cache des contenus fréquemment accédés
const { data: products, pending } = await useLazyAsyncData(
  "featured-products",
  () => getFeaturedProducts(6),
  {
    default: () => [],
    server: true, // Cache côté serveur
    client: false, // Pas de re-fetch côté client
  }
);
```

### Pagination Efficace

```typescript
// Pagination avec lazy loading
const {
  data: products,
  pending,
  refresh,
} = await useLazyAsyncData(`products-page-${page}`, () =>
  getProducts({
    limit: 12,
    offset: (page - 1) * 12,
  })
);
```

## 🛠️ Maintenance et Mise à Jour

### Validation du Contenu

```bash
# Vérifier la syntaxe des collections
npm run content:validate

# Régénérer les types TypeScript
npm run content:types
```

### Nettoyage et Optimisation

```bash
# Nettoyer le cache de contenu
npm run content:clear

# Optimiser les images
npm run content:optimize-images
```

## 🔒 Sécurité et Permissions

### Validation des Données

- Tous les contenus sont validés avec Zod schemas
- Type-safe à l'exécution et au build
- Protection contre l'injection de contenu malveillant

### Contrôle d'Accès

```typescript
// Exemple : contenu premium
const getPremiumCourses = async () => {
  const { user } = useAuth();
  if (!user?.isPremium) {
    throw new Error("Accès premium requis");
  }
  return await getCourses({ premium: true });
};
```

## 🎯 Bonnes Pratiques

### 1. **Nommage des Fichiers**

- Utiliser des slugs SEO-friendly
- Format : `kebab-case.md`
- Exemple : `guide-plantation-vanille.md`

### 2. **Structure du Contenu**

- Frontmatter complet pour toutes les métadonnées
- Contenu Markdown structuré avec titres H2/H3
- Images optimisées dans `/public/images/`

### 3. **Performance**

- Utiliser `useLazyAsyncData` pour le cache
- Limiter le nombre d'éléments par page
- Optimiser les images (WebP, responsive)

### 4. **SEO**

- Métadonnées complètes dans le frontmatter
- URLs canoniques pour chaque contenu
- Schema.org markup automatique

### 5. **Accessibilité**

- Texte alternatif pour toutes les images
- Structure de titres cohérente
- Liens descriptifs

## 🚨 Dépannage

### Erreurs Courantes

#### 1. Collection non trouvée

```bash
Error: Collection 'products' not found
```

**Solution** : Vérifier `content.config.ts` et le dossier `/content/products/`

#### 2. Schema invalide

```bash
ZodError: Invalid frontmatter
```

**Solution** : Vérifier que toutes les propriétés requises sont présentes

#### 3. Problème de cache

```bash
Content not updating
```

**Solution** : Supprimer `.nuxt/` et redémarrer le serveur

### Support et Documentation

- **Documentation officielle** : [content.nuxt.com](https://content.nuxt.com)
- **Exemples** : Voir `/pages/content-demo.vue`
- **Issues** : Créer un ticket dans le repo Fataplus

---

**✨ Nuxt Content v3 transforme Fataplus en CMS moderne, type-safe et ultra-performant !**

_Dernière mise à jour : 16 décembre 2024_
