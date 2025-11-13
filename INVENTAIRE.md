# Inventaire des Projets Fataplus Interopérabilité

## 📁 Structure Complète

```
fataplus-interoperabilite/
├── 📄 README.md                    # Vue d'ensemble projet
├── 📄 ARCHITECTURE.md             # Architecture technique
├── 📄 INVENTAIRE.md               # Ce fichier
│
├── 🔧 backend-integration/        # API et backend
│   └── fataplus-bknd-backend/     # Backend principal bknd.fata.plus
│
├── 🎨 frontend/                   # Projets web et CRM
│   ├── astro-crm/                 # Projet CRM actuel (mon-projet-astro)
│   ├── fataplus-website/          # Site principal agence
│   ├── fataplus-portal/           # Portail client
│   ├── fataplus-intake-form/      # Formulaire intake
│   ├── fataplus-intake-hono/      # Backend Hono
│   ├── fataplus-static-website/   # Site statique
│   └── project-management/        # Outils gestion
│
├── 📚 documentation/              # Spécifications techniques
│   ├── specs/                     # Specs FP-09
│   │   ├── 001-fataplus-agritech-platform
│   │   ├── 002-fataplus-design-system
│   │   ├── 003-fataplus-mcp
│   │   ├── 004-fataplus-search-analysis
│   │   ├── 005-fataplus-context-api
│   │   └── 007-fataplus-product-design-bootcamp
│   ├── 01-PROJECTS/              # Projets documentés
│   └── templates/                 # Templates réutilisables
│
├── 🤝 collaboration/              # Projets partenaires
│   └── apollon-lab/               # Collaboration ApollonLab
│
├── 🎓 bootcamp/                   # Formation UX/UI
│   └── agri-ai-design-lab/        # Programme bootcamp complet
│       ├── bootcamp-lessons/
│       ├── bootcamp-feedback/
│       └── workflows/
│
├── 🌾 agritech/                   # Projets AgriTech
│   └── fp-09-platform/            # Plateforme FP-09
│       ├── specs/
│       ├── deployment/
│       └── web-deploy/
│
└── 🎨 figma-designs/              # Designs Figma (à compléter)
```

## 🔗 Connexions Externes

### Domaines Cloudflare
- **fata.plus** → Frontend multi-tenant
- **bknd.fata.plus** → Backend API

### Partenaires
- **PIC** Pole Intégré de Croissance Madagascar
- **Zafy Tody** Incubateur Antananarivo
- **ApollonLab** Collaborations techniques

## 📋 Statut des Migrations

- ✅ **Backend bknd** → `backend-integration/`
- ✅ **Frontend projets** → `frontend/`
- ✅ **Documentation specs** → `documentation/`
- ✅ **Bootcamp UX/UI** → `bootcamp/`
- ✅ **AgriTech FP-09** → `agritech/`
- ✅ **Collaboration ApollonLab** → `collaboration/`
- ⏳ **Figma designs** → À organiser

## 🚀 Prochaines Étapes

1. Nettoyer les doublons
2. Configurer Cloudflare Pages
3. Intégrer bknd.fata.plus API
4. Déployer architecture multi-tenant
5. Connecter designs Figma