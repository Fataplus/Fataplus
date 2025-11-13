# 🚀 Guide d'Intégration Formulaire Intake + Génération IA

Ce guide explique comment intégrer le système de formulaire d'intake Fataplus avec le service de génération de documents IA pour créer un workflow complet de collecte de données et génération automatique de PRD, TDR et spécifications techniques.

## 📋 Vue d'Ensemble

### Architecture du Système
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│  Formulaire     │────│  Backend API    │────│  Services IA    │
│  Intake (HTML)  │    │  (Node.js)      │    │  (Claude/OpenAI)│
│                 │    │                 │    │                 │
│ - Vue          │    │ - Validation    │    │ - Génération    │
│ - Figma CMS     │    │ - Templates     │    │ - Intelligence  │
│ - Responsive    │    │ - API REST      │    │ - Documents     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                       ┌────────┴────────┐
                       │                 │
                ┌─────────────┐   ┌─────────────┐
                │  Documents  │   │   Client    │
                │  Générés    │   │   Portal    │
                │             │   │             │
                │ • PRD       │   │ • Dashboard │
                │ • TDR       │   │ • Download  │
                │ • Spec Tech │   │ • Status    │
                └─────────────┘   └─────────────┘
```

### Workflow Complet
1. **Client remplit le formulaire** d'intake sur le site Figma
2. **Validation JavaScript** des données en temps réel
3. **Soumission au backend** Node.js avec validation avancée
4. **Génération AI** des documents personnalisés
5. **Notification au client** avec liens de téléchargement
6. **Intégration au portal client** pour suivi et support

## 🔧 Étape 1: Configuration du Formulaire

### 1.1 Modifier le Formulaire HTML
Le formulaire `/Users/fefe/Documents/Assets/templates/fataplus-intake-form/index.html` est déjà configuré avec:

- **8 sections thématiques**: Vision → Entreprise → Projet → Technique → Design → Fonctions → Sécurité → Final
- **Progress bar** visuelle pour l'expérience utilisateur
- **Validation HTML5** pour les champs obligatoires
- **Design responsive** compatible Figma CMS

### 1.2 Personnalisation pour Figma CMS
Pour intégrer dans votre CMS Figma:

```html
<!-- Intégration via iframe -->
<iframe
  src="https://votreserveur.com/fataplus-intake-form/"
  width="100%"
  height="800px"
  frameborder="0"
  onload="this.style.height=(this.contentWindow.document.body.scrollHeight+20)+'px';">
</iframe>

<!-- Ou intégration directe du code -->
<div id="fataplus-intake-form">
  <!-- Copier le contenu du formulaire ici -->
</div>
```

### 1.3 Configuration JavaScript
Le fichier `js/main.js` inclut maintenant:

```javascript
// Configuration API
const API_BASE_URL = 'https://votreserveur.com/api'; // URL de votre backend

// Soumission améliorée avec suivi de statut
async function handleFormSubmit(e) {
    // Validation finale
    // Soumission au backend
    // Polling pour suivi de génération
    // Téléchargement automatique des documents
}
```

## 🔧 Étape 2: Déploiement du Backend

### 2.1 Installation du Service Backend

```bash
# Clonez le service backend
cd /Users/fefe/Documents/Assets/templates/backend-service

# Installation des dépendances
npm install

# Configuration de l'environnement
cp .env.example .env
# Éditez .env avec vos clés API
```

### 2.2 Configuration des Variables d'Environnement

```bash
# Configuration du serveur
PORT=3001
NODE_ENV=production
ALLOWED_ORIGINS=https://votreserveur.com

# Configuration IA (choisir un provider)
AI_PROVIDER=claude  # ou openai ou local
CLAUDE_API_KEY=sk-ant-xxx  # Votre clé Claude API
# OPENAI_API_KEY=sk-xxx  # Alternative OpenAI

# Configuration email (optionnel)
SMTP_HOST=smtp.gmail.com
SMTP_USER=votre-email@fataplus.com
SMTP_PASS=votre-app-password
```

### 2.3 Démarrage du Service

```bash
# Développement
npm run dev

# Production (recommandé)
npm install -g pm2
pm2 start src/index.js --name fataplus-docs

# Avec monitoring
pm2 monit
```

### 2.4 Configuration Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name votreserveur.com;

    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://localhost:3000;  # Votre frontend Figma
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🔧 Étape 3: Configuration des Services IA

### 3.1 Claude API (Recommandé)

1. **Obtenir une clé API**: https://console.anthropic.com/
2. **Configurer le backend**:
   ```bash
   AI_PROVIDER=claude
   CLAUDE_API_KEY=sk-ant-xxx
   ```

3. **Avantages**:
   - Meilleure compréhension du français
   - Résultats plus cohérents
   - Support du contexte technique

### 3.2 OpenAI Alternative

```bash
AI_PROVIDER=openai
OPENAI_API_KEY=sk-xxx
```

### 3.3 Modèle Local (Ollama)

```bash
# Installer Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Télécharger un modèle
ollama pull llama2

# Configuration
AI_PROVIDER=local
LOCAL_AI_URL=http://localhost:11434/v1
LOCAL_AI_MODEL=llama2
```

## 🔧 Étape 4: Test du Workflow Complet

### 4.1 Test Local

```bash
# 1. Démarrer le backend
cd backend-service
npm run dev

# 2. Ouvrir le formulaire
cd ../fataplus-intake-form
# Utiliser un serveur local ou ouvrir index.html directement

# 3. Remplir le formulaire avec données test
# 4. Vérifier la génération des documents dans `generated-documents/`
```

### 4.2 Test Production

```bash
# Vérifier le health check
curl https://votreserveur.com/api/health

# Test API endpoint
curl -X POST https://votreserveur.com/api/intake/validate \
  -H "Content-Type: application/json" \
  -d '{"projectTitle":"Test Project","problemStatement":"Test problem"}'
```

### 4.3 Validation End-to-End

1. **Formulaire**: Remplir toutes les sections
2. **Soumission**: Vérifier les logs backend
3. **Génération**: Surveiller la progression
4. **Téléchargement**: Valider les documents générés

## 🔧 Étape 5: Intégration avec Portal Client

### 5.1 Webhook pour Notification

Le backend peut notifier votre portal client:

```javascript
// Dans votre portal client
app.post('/webhooks/document-generated', async (req, res) => {
    const { submissionId, documents } = req.body;

    // Créer le projet dans votre système
    await createProject({
        id: submissionId,
        documents: documents,
        status: 'documents_ready'
    });

    // Notifier le client
    await notifyClient(submissionId, 'documents_ready');

    res.json({ success: true });
});
```

### 5.2 Dashboard Client

```javascript
// Fonction pour récupérer les statuts
async function getProjectStatus(submissionId) {
    const response = await fetch(`/api/projects/${submissionId}`);
    const project = await response.json();

    return {
        status: project.status,
        documents: project.documents,
        generatedAt: project.generatedAt
    };
}
```

## 📊 Monitoring et Maintenance

### 6.1 Logs et Monitoring

```bash
# Voir les logs en temps réel
pm2 logs fataplus-docs

# Monitoring des performances
pm2 monit

# Logs d'erreurs
tail -f logs/error.log
```

### 6.2 Métriques à Surveiller

- **Taux de réussite**: % de soumissions réussies
- **Temps de génération**: Moyenne pour PRD/TDR/Tech
- **Utilisation API**: Nombre de requêtes par jour
- **Erreurs**: Types et fréquences

### 6.3 Maintenance Programmée

```bash
# Script de maintenance
#!/bin/bash
# cleanup-docs.sh
find generated-documents/ -name "*.md" -mtime +30 -delete
pm2 restart fataplus-docs
```

## 🔒 Sécurité et Bonnes Pratiques

### 7.1 Sécurité

1. **HTTPS**: Obligatoire en production
2. **Rate Limiting**: Protection contre abus
3. **Input Validation**: Validation stricte des données
4. **Error Handling**: Pas d'informations sensibles dans les erreurs

### 7.2 Bonnes Pratiques

1. **Backups**: Sauvegarde régulière des documents générés
2. **Versioning**: Git tags pour chaque déploiement
3. **Documentation**: Maintenir ce guide à jour
4. **Testing**: Tests réguliers du workflow complet

## 🚀 Dépannage

### Problèmes Communs

#### Erreur de Connection API
```bash
# Vérifier si le backend tourne
curl localhost:3001/health

# Vérifier les logs
pm2 logs fataplus-docs
```

#### Génération IA échoue
```bash
# Vérifier la clé API
echo $CLAUDE_API_KEY

# Test manuel
curl -X POST http://localhost:3001/api/generate-documents \
  -H "Content-Type: application/json" \
  -d '{"projectTitle":"Test","problemStatement":"Test"}'
```

#### Documents non générés
```bash
# Vérifier permissions des dossiers
ls -la generated-documents/

# Vérifier espace disque
df -h
```

### Support Technique

- **Documentation**: `/backend-service/README.md`
- **Logs**: `logs/combined.log`, `logs/error.log`
- **Contact**: fenohery.fanomezanirina@gmail.com
- **Urgence**: +261 34 20 472 13

## 📈 Évolutions Possibles

### Nouvelles Fonctionnalités

1. **Multi-langues**: Support anglais et malgache
2. **Templates additionnels**: Business plan, pitch deck
3. **Collaboration**: Comments et approvals en ligne
4. **Analytics**: Données sur l'utilisation des templates

### Extensions Techniques

1. **Database**: PostgreSQL pour persistance
2. **Queue**: Redis pour traitement asynchrone
3. **CDN**: CloudFlare pour performance globale
4. **Monitoring**: New Relic / DataDog

---

**Version**: 1.0
**Dernière mise à jour**: 2025-01-11
**Mainteneur**: Équipe Fataplus