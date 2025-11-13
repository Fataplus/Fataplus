# Fataplus Multi-tenancy Project Repository

> Première agence de design produit de Madagascar spécialisée dans l'innovation agritech 🌱

Ce repository contient plusieurs projets et ressources pour l'agence de design technologique agricole Fataplus.

## 📁 Project Structure

### 🌐 [fataplus-static-website/](./fataplus-static-website/)

Site web traditionnel de 5 pages pour l'agence Fataplus

- **Technologie**: HTML5, CSS3, Vanilla JavaScript
- **Langue**: Français
- **Pages**: Accueil, À propos, Services, Projets, Contact

### 🚀 [fataplus-portal/](./fataplus-portal/)

Ressources de développement du portail client moderne for multiple project and project have tenancy managed based by client

- **Architecture**: Microservices, TypeScript, déploiement Cloudflare
- **Contenu**: Documentation architecture, guides d'installation, workflows

### 🔧 [fataplus-bknd-backend/](./fataplus-bknd-backend/)

Backend unifié basé sur bknd.io pour la gestion multi-tenants

- **Framework**: bknd.io unified backend
- **Runtime**: Cloudflare Workers
- **Database**: Cloudflare D1
- **URL**: https://fataplus-bknd-backend.fenohery.workers.dev
- **Admin UI**: https://fataplus-bknd-backend.fenohery.workers.dev/admin

### 📝 [intake-forms/](./intake-forms/)

Implémentations de formulaire d'intégration de projet

#### [intake-forms/cloudflare-workers/](./intake-forms/cloudflare-workers/)

Implémentation basée sur Cloudflare Workers

#### [intake-forms/hono-implementation/](./intake-forms/hono-implementation/)

Implémentation basée sur le framework Hono

### 📋 [open-specifications/](./open-specifications/)

Spécifications techniques et standards pour la technologie product design et agritech

### 📚 [documentation/](./documentation/)

Centre de documentation centralisé

#### [documentation/templates/](./documentation/templates/)

- `FORMULAIRE-INTAKE-PROJET.md` - Template formulaire intégration projet
- `TEMPLATE-PRD-AUTOMATIQUE.md` - Template PRD automatique
- `GUIDE-UTILISATION-FORMULAIRE.md` - Guide d'utilisation du formulaire

#### [documentation/guides/](./documentation/guides/)

- `README-TEMPLATES.md` - Documentation des templates
- Guides utilisateur et documentation additionnelle

#### [documentation/agri-ai-design-lab/](./documentation/agri-ai-design-lab/)

Documentation Agri-AI Design Lab, matériaux bootcamp et recherche

### 🛠️ [project-management/](./project-management/)

Fichiers de gestion de projet BMAD (Business Model Architecture Design)

- `.bmad/` - Configuration et workflows BMAD
- `.bmad-ephemeral/` - Fichiers temporaires BMAD
- `.clinerules/` - Règles et configurations de développement

## 🚀 Quick Start

### Site Web Statique

```bash
cd fataplus-static-website
# Ouvrir index.html dans votre navigateur
```

### Développement Portail Moderne

```bash
cd fataplus-portal
# Lire setup-guide.md pour les instructions d'installation
```

### Backend Unifié bknd.io

```bash
cd fataplus-bknd-backend
npm install
npm run dev        # Développement local
npm run deploy     # Déploiement en production
```

### Formulaires d'Intégration de Projet

```bash
cd intake-forms/cloudflare-workers
# Ou
cd intake-forms/hono-implementation
# Suivre les guides d'implémentation respectifs
```

## 📖 Documentation

- **Architecture Portail**: Voir [fataplus-portal/architecture.md](./fataplus-portal/architecture.md)
- **Configuration Développement**: Voir [fataplus-portal/setup-guide.md](./fataplus-portal/setup-guide.md)
- **Guide Déploiement**: Voir [fataplus-portal/deployment-guide.md](./fataplus-portal/deployment-guide.md)
- **Templates**: Voir [documentation/templates/](./documentation/templates/)
- **Spécifications Techniques**: Voir [open-specifications/](./open-specifications/)

---

## ℹ️ À propos du Site Web Statique

### 🎨 Caractéristiques

- **Design Responsive**: Compatible mobile, tablette et bureau
- **Animations Modernes**: Effets de scroll, transitions et micro-interactions
- **Performance Optimisée**: Code propre et optimisé pour rapidité
- **SEO Friendly**: Structure sémantique et métadonnées optimisées
- **Accessibilité**: Conforme aux normes WCAG d'accessibilité

### 🛠 Technologies Utilisées

- **HTML5**: Structure sémantique moderne
- **CSS3**: Design responsive avec Grid et Flexbox
- **JavaScript Vanilla**: Interactions dynamiques et animations
- **Font Awesome**: Icônes professionnelles

### 🎯 Contenu Basé sur l'Expertise Fataplus

Le contenu du site est basé sur l'expertise réelle de Fataplus:

- **Entreprise**: Fataplus SARLU (fondée en 2023)
- **Spécialisation**: Première agence design produit agritech à Madagascar
- **Formation**: 50+ designers via bootcamp certifié Figma EDU
- **Impact**: 10,000+ agriculteurs, objectif +30% revenus
- **Projets**: Plateforme à 85% de complétion

## 🏢 À propos de Fataplus

Fataplus est une agence malagasy de product design technologique agricole spécialisée dans:

- Systèmes d'irrigation intelligents
- Solutions d'IA agricole
- Design thinking pour l'agriculture
- Conseil technologique pour l'innovation agricole

## 📞 Contact

Pour les demandes de projet, veuillez utiliser le formulaire de contact dans le site web statique ou vous référer aux formulaires d'intégration de projet.

- **Email**: fenohery.fanomezanirina@gmail.com
- **Téléphone**: +261 34 20 472 13
- **Localisation**: Antananarivo, Madagascar
- **Portfolio**: https://app.uxcel.com/ux/fenohery
- **GitHub**: https://github.com/Fataplus

---

*Organisé pour une meilleure maintenabilité et séparation des projets*
*© 2025 Fataplus SARLU. Tous droits réservés.*
