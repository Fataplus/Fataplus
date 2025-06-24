# 🚀 Guide de Démarrage Rapide - Fataplus

> Lancez votre plateforme Fataplus en 10 minutes !

## ⚡ Installation Express

### 1. **Prérequis**
```bash
# Vérifiez vos versions
node --version  # >= 18.0.0
npm --version   # >= 8.0.0
git --version   # >= 2.0.0
```

### 2. **Clonage & Installation**
```bash
# Cloner le projet
git clone https://github.com/fataplus/platform.git
cd fataplus-platform

# Installer les dépendances (automatique)
npm install

# Configuration rapide
cp .env.example .env
```

### 3. **Configuration Minimale**
Éditez le fichier `.env` avec ces valeurs essentielles :

```bash
# Authentification (générer une clé aléatoire)
NUXT_AUTH_SECRET=votre-cle-secrete-32-caracteres-minimum

# Base de données (SQLite local)
DATABASE_URL=./server/database/sqlite.db

# OpenAI pour l'IA (optionnel pour commencer)
OPENAI_API_KEY=sk-votre-cle-openai

# Cloudinary pour les images (gratuit)
CLOUDINARY_CLOUD_NAME=votre-cloud-name
CLOUDINARY_API_KEY=votre-api-key
CLOUDINARY_API_SECRET=votre-api-secret
```

### 4. **Initialisation & Lancement**
```bash
# Créer la base de données
npm run db:migrate

# Démarrer le serveur
npm run dev
```

🎉 **Votre plateforme est accessible sur : http://localhost:3000**

---

## 🛠️ Configuration Avancée

### **Services Externes (Optionnels)**

#### **Cloudinary (Images)**
1. Créer un compte gratuit sur [cloudinary.com](https://cloudinary.com)
2. Récupérer : Cloud Name, API Key, API Secret
3. Ajouter dans `.env`

#### **OpenAI (IA)**
1. Créer un compte sur [platform.openai.com](https://platform.openai.com)
2. Générer une clé API
3. Ajouter `OPENAI_API_KEY` dans `.env`

#### **Stripe (Paiements)**
1. Créer un compte sur [stripe.com](https://stripe.com)
2. Mode test : récupérer les clés test
3. Ajouter dans `.env`

---

## 📊 Données de Test

### **Créer un Utilisateur Admin**
```bash
# Via l'interface web
1. Aller sur http://localhost:3000/auth/register
2. S'inscrire avec role "Admin"
3. Vérifier l'email dans les logs console

# Ou via script
npm run seed:admin
```

### **Charger des Données de Démo**
```bash
# Produits d'exemple
npm run seed:products

# Cours de formation
npm run seed:courses

# Utilisateurs de test
npm run seed:users

# Tout en une fois
npm run seed:all
```

---

## 🎯 Fonctionnalités Prêtes à Tester

### **✅ Marketplace**
- **Catalogue** : `/marketplace`
- **Produit** : `/marketplace/product/[slug]`
- **Panier** : Clic sur icône panier
- **Commande** : `/checkout`

### **✅ Formation**
- **Cours** : `/learning`
- **Détail cours** : `/learning/course/[slug]`
- **IA Assistant** : Bouton "IA Assistant" dans le header

### **✅ Communauté**
- **Forums** : `/community`
- **Messages** : `/community/messages`
- **Profil** : `/profile`

### **✅ Administration**
- **Dashboard Admin** : `/admin/dashboard` (role admin requis)
- **Gestion Produits** : `/admin/products`
- **Gestion Utilisateurs** : `/admin/users`

---

## 🔧 Commandes Utiles

### **Développement**
```bash
npm run dev          # Serveur développement
npm run dev:host     # Accessible réseau local
npm run typecheck    # Vérification TypeScript
npm run lint         # Vérification code
```

### **Base de Données**
```bash
npm run db:studio    # Interface graphique DB
npm run db:reset     # Réinitialiser DB
npm run db:backup    # Sauvegarder DB
```

### **Tests**
```bash
npm run test         # Tests unitaires
npm run test:e2e     # Tests end-to-end
npm run test:watch   # Tests en continu
```

### **Production**
```bash
npm run build        # Build production
npm run preview      # Aperçu production
npm run deploy       # Déployer (Cloudflare)
```

---

## 🐛 Résolution de Problèmes

### **Port 3000 déjà utilisé**
```bash
# Changer le port
PORT=3001 npm run dev

# Ou dans package.json
"dev": "nuxt dev --port 3001"
```

### **Erreur base de données**
```bash
# Supprimer et recréer
rm server/database/sqlite.db
npm run db:migrate
```

### **Problème de permissions**
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### **Erreur TypeScript**
```bash
# Reconstruire les types
npm run postinstall
npm run typecheck
```

---

## 📱 Version Mobile

### **Configuration FlutterFlow**
1. Créer projet sur [flutterflow.io](https://flutterflow.io)
2. Configurer API endpoint : `http://votre-ip:3000/api`
3. Importer le schema API depuis `/api/schema`
4. Suivre le guide mobile dans `/docs/mobile.md`

---

## 🌐 Déploiement Production

### **Cloudflare (Recommandé)**
```bash
# Installation CLI
npm install -g wrangler

# Login et configuration
npx wrangler login
npx wrangler pages project create fataplus

# Déploiement
npm run deploy
```

### **Vercel (Alternative)**
```bash
# Installation CLI
npm install -g vercel

# Déploiement
vercel --prod
```

---

## 📞 Support Express

### **🆘 Problème Bloquant ?**
1. **Documentation** : [docs.fata.plus](https://docs.fata.plus)
2. **Issues GitHub** : [github.com/fataplus/platform/issues](https://github.com/fataplus/platform/issues)
3. **Discord** : [discord.gg/fataplus](https://discord.gg/fataplus)
4. **Email** : support@fata.plus

### **📋 Checklist Debug**
- [ ] Node.js >= 18 installé
- [ ] Variables `.env` configurées
- [ ] Base de données migrée
- [ ] Port 3000 libre
- [ ] Logs console sans erreurs
- [ ] Network/firewall OK

---

## 🎉 Prochaines Étapes

### **Phase 1 - Local**
1. ✅ Installation réussie
2. ✅ Premier utilisateur créé
3. ✅ Données de test chargées
4. ✅ Toutes les pages accessibles

### **Phase 2 - Personnalisation**
1. 🔄 Configurer les services externes
2. 🔄 Personnaliser le design/branding
3. 🔄 Ajouter du contenu spécifique
4. 🔄 Configurer les intégrations

### **Phase 3 - Production**
1. 📋 Tests complets
2. 📋 Déploiement staging
3. 📋 Configuration domaine
4. 📋 Lancement production

---

**🚀 Vous êtes prêt à transformer l'agriculture malgache avec Fataplus !**

*Pour aller plus loin, consultez le [README complet](README.md) et la [documentation technique](docs/)* 