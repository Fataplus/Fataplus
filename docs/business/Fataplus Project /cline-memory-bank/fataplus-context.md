# Contexte — Fataplus

## Présentation

Fataplus est une application fullstack développée avec Nuxthub (stack Nuxt.js + modules personnalisés).  
Elle centralise des fonctionnalités de gestion de contenu, de communauté, de marketplace, d’apprentissage, etc.

## Stack technique

- **Framework principal :** Nuxt.js (Nuxthub)
- **Langage :** TypeScript
- **Modules :** content, composables, middleware, plugins, stores, etc.
- **UI :** Tailwind CSS, composants personnalisés (Flowbite, etc.)
- **Tests :** Playwright, Vitest
- **Organisation :** 
  - content/ (articles, guides, produits…)
  - components/ (UI, marketplace, learning…)
  - docs/ (stratégie, guides internes…)
  - pages/, layouts/, plugins/, stores/, etc.

## Objectif

- Plateforme centralisée pour la gestion de contenus agricoles, de profils utilisateurs, de produits, de guides, etc.
- Support de la communauté, de l’apprentissage et du marketplace.

## Structure du projet

- **content/** : articles, guides, produits, cours, mentions légales
- **components/** : UI, marketplace, learning, community, AI, etc.
- **docs/** : stratégie, guides internes, audits, plans de migration
- **modules/** : marketplace, learning, community, etc.
- **pages/** : pages principales, auth, admin, etc.
- **plugins/** : extensions Nuxt, auth, etc.
- **server/** : API, base de données, utilitaires backend
- **shared/** : composants et utilitaires partagés
- **stores/** : (présent, Pinia retiré)
- **tests/** : tests unitaires, intégration, e2e
- **types/** : définitions TypeScript
- **assets/**, **layouts/**, **public/**, **scripts/**, etc.

## Avancement / Progression

### Phases réalisées
- **Phase 1 : Stabilisation de l’environnement** : 100% (Node.js, DB, config, dépendances)
- **Phase 2 : Résolution des crises critiques** : 100% (hydratation, auth, composants complexes, stabilité)
- **Phase 3 (en cours) : Développement des features** : modules Farmer, Learning, Marketplace, Community

### Modules/fonctionnalités clés
- Authentification JWT, pages login/register, navigation simplifiée
- Marketplace (produits, vendors, commandes, analytics)
- Plateforme d’apprentissage agricole (cours, certifications, suivi)
- Système de profils agriculteurs, groupes régionaux, success stories
- Assistant IA agricole (expertise Madagascar, bilingue)
- RBAC et SuperAdmin, gestion des rôles et permissions
- Community : messagerie, groupes, événements, mobile/PWA

### Points techniques majeurs
- Suppression complète de Pinia, stores simplifiés avec Vue 3
- Base SQLite opérationnelle (20+ tables, users, produits…)
- UI moderne avec Tailwind CSS, responsive/mobile
- Tests Playwright/Vitest, scripts de setup automatisés
- Documentation et guides internes à jour

### Roadmap (prochaines étapes)
- Finaliser modules Farmer, Learning, Marketplace, Community
- Intégrations externes (Dolibarr, Nextcloud, DocuSeal, OpenAI…)
- Déploiement production, optimisation, sécurité, multilingue

## Historique / Notes

- Projet structuré pour être extensible et modulaire.
- Documentation interne présente dans `docs/`.
- Contenus éditoriaux dans `content/`.
