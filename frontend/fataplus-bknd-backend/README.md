# Fataplus Unified Backend - bknd.io
> Backend unifié pour l'agence de design produit agritech Fataplus 🌱

Ce backend unifié basé sur bknd.io fournit une solution complète pour la gestion multi-tenants des projets clients de Fataplus.

## 🏗️ Architecture

- **Framework**: bknd.io unified backend
- **Runtime**: Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite)
- **Authentification**: Session-based avec gestion multi-tenants
- **Admin UI**: Interface d'administration visuelle intégrée

## 📋 Fonctionnalités

### Multi-tenancy
- Gestion des clients avec isolation des données
- Portails clients personnalisés
- Permissions granulaires par rôle

### Gestion de Projets
- Formulaire d'intégration de projet
- Suivi de statut des projets
- Catégorisation par domaine (agritech, design, consulting)

### Données Agritech
- Gestion des données agricoles
- Systèmes d'irrigation intelligents
- Suivi des rendements et performances

## 🚀 Déploiement

### Production
**URL**: https://fataplus-bknd-backend.fenohery.workers.dev
**Admin UI**: https://fataplus-bknd-backend.fenohery.workers.dev/admin

### Configuration

```bash
# Installation des dépendances
npm install

# Génération des types
npm run typegen

# Développement local
npm run dev

# Déploiement en production
npm run deploy
```

## 📚 Collections de Données

### Clients
- `id`: Identifiant unique
- `name`: Nom du client
- `email`: Email de contact
- `projects`: Liste des projets associés
- `created_at/updated_at`: Timestamps

### Projets
- `id`: Identifiant unique
- `client_id`: Référence au client
- `title`: Titre du projet
- `description`: Description détaillée
- `status`: Statut (pending/active/completed)
- `category`: Catégorie (agritech/design/consulting)
- `requirements`: Configuration JSON

### Données Agricoles
- `id`: Identifiant unique
- `project_id`: Référence au projet
- `crop_type`: Type de culture
- `farm_size`: Surface agricole
- `location`: Coordonnées géographiques
- `irrigation_system`: Type d'irrigation
- `yield_data`: Données de rendement

## 🔧 Configuration Multi-tenancy

La configuration permet l'isolation complète des données entre clients tout en offrant une vue d'administration centralisée pour l'équipe Fataplus.

## 📖 Documentation

- **Documentation bknd.io**: https://docs.bknd.io
- **Guide Cloudflare Workers**: https://developers.cloudflare.com/workers/
- **Support Discord**: https://discord.gg/952SFk8Tb8

---

*Déployé sur Cloudflare Workers avec ❤️ par Fataplus SARLU*
