# Fataplus Document Generator Backend Service

Service backend Node.js/Express pour générer automatiquement des documents de projet (PRD, TDR, spécifications techniques) basés sur les données du formulaire d'intake Fataplus avec l'aide de l'IA.

## 🚀 Fonctionnalités

- **Génération AI-Powered**: Utilise Claude, OpenAI, ou modèles locaux pour générer des documents personnalisés
- **Validation Avancée**: Validation des données avec Joi et logique métier
- **Templates Handlebars**: Templates configurables pour différents types de documents
- **API RESTful**: Endpoints REST pour l'intégration avec le frontend
- **Monitoring & Logging**: Winston pour le logging, métriques de performance
- **Error Handling**: Gestion robuste des erreurs avec fallback
- **CORS & Sécurité**: Configuration CORS et sécurité intégrée

## 📋 Prérequis

- Node.js 18+
- npm ou yarn
- Accès API Claude ou OpenAI (optionnel)
- MongoDB ou PostgreSQL (optionnel)

## 🛠️ Installation

1. **Cloner le dépôt**
   ```bash
   git clone <repository-url>
   cd backend-service
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   ```bash
   cp .env.example .env
   # Éditer .env avec vos configurations
   ```

4. **Créer les dossiers nécessaires**
   ```bash
   mkdir -p logs generated-documents uploads
   ```

5. **Démarrer le service**
   ```bash
   # Développement
   npm run dev

   # Production
   npm start
   ```

## 🔧 Configuration

### Variables d'Environnement

```bash
# Service
PORT=3001
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000

# AI Service
AI_PROVIDER=claude  # claude, openai, local
CLAUDE_API_KEY=votre_clé_claude
OPENAI_API_KEY=votre_clé_openai

# Email (optionnel)
SMTP_HOST=smtp.gmail.com
SMTP_USER=votre_email
```

### Configuration des Services IA

#### Claude API (Recommandé)
```env
AI_PROVIDER=claude
CLAUDE_API_KEY=sk-ant-...
```

#### OpenAI (Alternative)
```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
```

#### Modèle Local (Ollama)
```env
AI_PROVIDER=local
LOCAL_AI_URL=http://localhost:11434/v1
LOCAL_AI_MODEL=llama2
```

## 📚 API Endpoints

### Soumission du Formulaire
```http
POST /api/intake/submit
Content-Type: application/json

{
  "projectTitle": "Platforme agricole intelligente",
  "problemStatement": "...",
  "solutionVision": "...",
  "contactEmail": "email@example.com"
}
```

### Vérifier le Statut
```http
GET /api/intake/status/{submissionId}
```

### Télécharger les Documents
```http
GET /api/intake/documents/{submissionId}
```

### Télécharger un Document Spécifique
```http
GET /api/documents/{filename}
```

### Health Check
```http
GET /health
```

## 🏗️ Architecture

```
src/
├── index.js              # Point d'entrée principal
├── routes/               # Routes API
│   └── intake.js         # Routes formulaire d'intake
├── services/             # Services métier
│   ├── aiService.js      # Service IA (Claude/OpenAI/Local)
│   └── documentGenerator.js  # Génération de documents
├── utils/                # Utilitaires
│   ├── validation.js     # Validation des données
│   └── logger.js         # Configuration logging
└── templates/            # Templates Handlebars
    ├── prd-template.hbs
    ├── tdr-template.hbs
    └── technical-spec-template.hbs
```

## 🎨 Personnalisation

### Ajouter de Nouveaux Templates

1. **Créer un template Handlebars**
   ```handlebars
   <!-- templates/custom-template.hbs -->
   # {{projectTitle}}

   Généré le: {{formatDate}}
   Par: {{contactName}}
   ```

2. **Ajouter le générateur**
   ```javascript
   export async function generateCustomDoc(intakeData) {
     const template = await loadTemplate('custom-template');
     const content = template(intakeData);
     // ... sauvegarder et retourner
   }
   ```

### Étendre la Validation

```javascript
// Ajouter des règles personnalisées
const customSchema = Joi.object({
  customField: Joi.string().min(5).required()
});
```

## 🧪 Tests

```bash
# Lancer les tests
npm test

# Tests avec couverture
npm run test:coverage
```

## 📊 Monitoring

### Logs
- **Console**: En développement
- **Fichiers**: `logs/combined.log`, `logs/error.log`
- **Format**: JSON structuré

### Métriques
- Health check endpoint: `/health`
- Metrics endpoint (optionnel): `/metrics`

## 🔒 Sécurité

- **CORS**: Configuration par origine
- **Validation**: Joi + validation métier
- **Rate Limiting**: Protection contre les abus
- **Input Sanitization**: Protection XSS/injection
- **Error Handling**: Pas de fuites d'informations

## 🚀 Déploiement

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  doc-generator:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - AI_PROVIDER=claude
      - CLAUDE_API_KEY=${CLAUDE_API_KEY}
```

### Deployment Checklist
- [ ] Configurer les variables d'environnement
- [ ] Démarrer le service IA (si local)
- [ ] Configurer le monitoring
- [ ] Tester les endpoints critiques
- [ ] Configurer le backup

## 🐛 Dépannage

### Problèmes Communs

**API Key non valide**
```
ERROR: Authentication failed
```
- Vérifier la clé API dans .env
- Confirmer le provider AI correct

**Timeout de génération**
```
ERROR: Request timeout
```
- Augmenter le timeout dans la configuration
- Vérifier la connectivité réseau

**Erreur de validation**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": ["projectTitle is required"]
}
```
- Vérifier les champs obligatoires
- Consulter la documentation API

### Logs de Debug

```javascript
// Activer le debug
process.env.LOG_LEVEL = 'debug';

// Logs personnalisés
logger.info('Custom event', { customData: 'value' });
```

## 📈 Performance

### Optimisations
- **Cache**: Redis pour les réponses récurrentes
- **Compression**: Gzip pour les réponses
- **Connection Pooling**: Base de données optimisée
- **Async Processing**: Génération en arrière-plan

### Monitoring
- **Response Time**: Temps de réponse API
- **Error Rate**: Taux d'erreur
- **Throughput**: Requêtes/seconde
- **Memory Usage**: Utilisation mémoire

## 🤝 Contribuer

1. Fork le projet
2. Créer une branche feature
3. Commit les changements
4. Push vers la branche
5. Créer une Pull Request

## 📄 Licence

MIT License - voir le fichier LICENSE pour détails

## 📞 Support

- **Email**: fenohery.fanomezanirina@gmail.com
- **Phone**: +261 34 20 472 13
- **Issues**: GitHub Issues