import axios from 'axios';
import { logger } from '../utils/logger.js';

// AI Service Configuration
const AI_CONFIG = {
  // Claude Configuration
  claude: {
    apiKey: process.env.CLAUDE_API_KEY,
    baseURL: 'https://api.anthropic.com/v1',
    model: 'claude-3-sonnet-20240229',
    maxTokens: 4000,
    temperature: 0.7
  },

  // OpenAI Configuration (fallback)
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: 'https://api.openai.com/v1',
    model: 'gpt-4-turbo-preview',
    maxTokens: 4000,
    temperature: 0.7
  },

  // Local AI Configuration (for self-hosted models)
  local: {
    baseURL: process.env.LOCAL_AI_URL || 'http://localhost:11434/v1',
    model: process.env.LOCAL_AI_MODEL || 'llama2',
    maxTokens: 4000,
    temperature: 0.7
  }
};

// Determine which AI service to use
function getAIProvider() {
  const preferredProvider = process.env.AI_PROVIDER || 'claude';

  switch (preferredProvider) {
    case 'claude':
      if (AI_CONFIG.claude.apiKey) return { type: 'claude', config: AI_CONFIG.claude };
      break;
    case 'openai':
      if (AI_CONFIG.openai.apiKey) return { type: 'openai', config: AI_CONFIG.openai };
      break;
    case 'local':
      return { type: 'local', config: AI_CONFIG.local };
      break;
  }

  // Fallback order
  if (AI_CONFIG.claude.apiKey) return { type: 'claude', config: AI_CONFIG.claude };
  if (AI_CONFIG.openai.apiKey) return { type: 'openai', config: AI_CONFIG.openai };
  return { type: 'local', config: AI_CONFIG.local };
}

// Generic AI call function
export async function callAI(prompt, type = 'general', context = {}) {
  try {
    const provider = getAIProvider();
    logger.info('Calling AI service', {
      provider: provider.type,
      model: provider.config.model,
      type
    });

    let response;

    switch (provider.type) {
      case 'claude':
        response = await callClaude(prompt, provider.config, context);
        break;
      case 'openai':
        response = await callOpenAI(prompt, provider.config, context);
        break;
      case 'local':
        response = await callLocalAI(prompt, provider.config, context);
        break;
      default:
        throw new Error(`Unsupported AI provider: ${provider.type}`);
    }

    logger.info('AI call successful', {
      provider: provider.type,
      responseLength: response.length
    });

    return response;

  } catch (error) {
    logger.error('AI call failed', {
      error: error.message,
      type,
      prompt: prompt.substring(0, 100) + '...'
    });

    // Fallback to template-based response
    return generateFallbackResponse(prompt, type, context);
  }
}

// Claude API call
async function callClaude(prompt, config, context) {
  const systemPrompt = buildSystemPrompt(context);

  const response = await axios.post(
    `${config.baseURL}/messages`,
    {
      model: config.model,
      max_tokens: config.maxTokens,
      temperature: config.temperature,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01'
      },
      timeout: 30000
    }
  );

  return response.data.content[0].text;
}

// OpenAI API call
async function callOpenAI(prompt, config, context) {
  const systemPrompt = buildSystemPrompt(context);

  const response = await axios.post(
    `${config.baseURL}/chat/completions`,
    {
      model: config.model,
      max_tokens: config.maxTokens,
      temperature: config.temperature,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: prompt
        }
      ]
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      timeout: 30000
    }
  );

  return response.data.choices[0].message.content;
}

// Local AI call (Ollama compatible)
async function callLocalAI(prompt, config, context) {
  const systemPrompt = buildSystemPrompt(context);

  const response = await axios.post(
    `${config.baseURL}/chat/completions`,
    {
      model: config.model,
      max_tokens: config.maxTokens,
      temperature: config.temperature,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: prompt
        }
      ]
    },
    {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 60000 // Local models might be slower
    }
  );

  return response.data.choices[0].message.content;
}

// Build system prompt based on context
function buildSystemPrompt(context) {
  const basePrompt = `Tu es un consultant expert en transformation digitale et en développement de projets logiciels pour Fataplus SARLU, la première agence de design produit agritech de Madagascar.

Ton rôle est d'aider à générer des documents de projet de haute qualité basés sur les informations fournies par les clients.

Instructions importantes :
- Réponds toujours en français
- Sois précis, professionnel et concret
- Structure tes réponses de manière claire et organisée
- Adapte le ton au type de document demandé
- Inclus des exemples pratiques quand c'est pertinent
- Anticipe les besoins non exprimés du client`;

  const contextSpecific = context.documentType ? `
Contexte du document : ${context.documentType}
Type de projet : ${context.projectType || 'Non spécifié'}` : '';

  return basePrompt + (contextSpecific ? '\n\n' + contextSpecific : '');
}

// Fallback response generator
function generateFallbackResponse(prompt, type, context) {
  logger.warn('Using fallback response generation', { type });

  const fallbacks = {
    'executive-summary': `
# Résumé Exécutif

## Vision du Projet
Ce projet représente une opportunité stratégique pour l'entreprise de répondre aux besoins du marché à travers une solution innovante.

## Proposition de Valeur
La solution proposée apportera une valeur significative aux utilisateurs finaux en résolvant les problèmes identifiés de manière efficace et efficiente.

## Impact Attendu
L'impact positif se mesurera à travers l'amélioration de l'expérience utilisateur et l'optimisation des processus existants.
`,
    'business-objectives': `
## Objectifs Business

### Objectif 1 : Lancement réussi du projet
- **KPI** : Date de lancement respectée
- **Cible** : Conformité au timeline défini
- **Mesure** : Jours de retard (objectif : 0)

### Objectif 2 : Satisfaction utilisateur
- **KPI** : Score de satisfaction utilisateur
- **Cible** : > 4/5
- **Mesure** : Enquêtes de satisfaction post-lancement

### Objectif 3 : Performance technique
- **KPI** : Disponibilité du service
- **Cible** : > 99%
- **Mesure** : Monitoring continu
`,
    'user-personas': `
## Personas Utilisateurs

### Persona Principal : Utilisateur Cible
- **Rôle** : Utilisateur final de la solution
- **Objectifs** : Accomplir ses tâches efficacement
- **Frustrations** : Outils actuels complexes ou inadaptés
- **Besoins** : Solution simple, intuitive et fiable
- **Scénario** : Utilisation quotidienne pour ses activités principales

### Persona Secondaire : Administrateur
- **Rôle** : Gestion de la plateforme
- **Objectifs** : Maintenance et support des utilisateurs
- **Besoins** : Outils d'administration robustes
`,
    'technical-architecture': `
## Architecture Technique

### Stack Recommandé
- **Frontend** : Framework JavaScript moderne (React/Vue.js)
- **Backend** : API RESTful avec Node.js ou Python
- **Base de données** : PostgreSQL ou MongoDB selon les besoins
- **Infrastructure** : Cloud avec scalabilité automatique

### Sécurité
- Authentification forte
- Chiffrement des données
- Mises à jour régulières
- Surveillance continue

### Performance
- Optimisation des temps de chargement
- Cache intelligent
- Monitoring proactif
`,
    'project-scope': `
## Périmètre du Projet

### Inclus dans le périmètre
- Fonctionnalités principales définies dans le cahier des charges
- Interface utilisateur responsive
- Documentation technique
- Tests et validation

### Exclus du périmètre
- Fonctionnalités avancées non spécifiées
- Intégrations avec systèmes tiers non listés
- Formation utilisateurs étendue
- Maintenance post-lancement

### Contraintes
- Budget et timeline définis
- Ressources techniques disponibles
- Exigences réglementaires applicables
`,
    'default': `
## Réponse Générée

Cette section a été générée automatiquement basée sur les informations fournies dans le formulaire d'intake.

**Note** : Cette réponse utilise un modèle de base et devrait être personnalisée lors de la consultation avec le client pour refléter précisément les besoins spécifiques du projet.

Pour une analyse détaillée et personnalisée, une consultation avec un consultant Fataplus est recommandée.
`
  };

  return fallbacks[type] || fallbacks['default'];
}

// Template-based generation for structured documents
export async function generateWithTemplate(template, data) {
  try {
    logger.info('Generating content with template', { template: template.name });

    // Enhanced prompt for structured generation
    const prompt = `
Génère le contenu pour la section "${template.name}" basé sur les informations suivantes :

${JSON.stringify(data, null, 2)}

Instructions spécifiques pour cette section :
${template.instructions || 'Génère un contenu professionnel et détaillé'}

Structure ta réponse selon le format attendu pour un ${template.documentType}.
`;

    return await callAI(prompt, template.type, {
      documentType: template.documentType,
      templateName: template.name
    });

  } catch (error) {
    logger.error('Template generation failed', {
      template: template.name,
      error: error.message
    });

    return generateFallbackResponse(
      `Générer du contenu pour ${template.name} basé sur : ${JSON.stringify(data)}`,
      template.type,
      { documentType: template.documentType }
    );
  }
}

// Batch AI calls for efficiency
export async function batchAICalls(requests) {
  try {
    logger.info('Starting batch AI calls', { count: requests.length });

    const promises = requests.map((request, index) =>
      callAI(request.prompt, request.type, request.context)
        .then(result => ({ index, result }))
        .catch(error => ({
          index,
          error: error.message,
          result: generateFallbackResponse(request.prompt, request.type, request.context)
        }))
    );

    const results = await Promise.all(promises);

    // Sort results by original index
    results.sort((a, b) => a.index - b.index);

    logger.info('Batch AI calls completed', {
      count: requests.length,
      successful: results.filter(r => !r.error).length
    });

    return results.map(r => r.result);

  } catch (error) {
    logger.error('Batch AI calls failed', { error: error.message });
    throw error;
  }
}

// Health check for AI services
export async function checkAIHealth() {
  const provider = getAIProvider();

  try {
    const testPrompt = "Test de connectivité - réponds simplement 'OK'.";
    const response = await callAI(testPrompt, 'health-check');

    return {
      status: 'healthy',
      provider: provider.type,
      model: provider.config.model,
      responseTime: Date.now() // Will be updated with actual timing
    };

  } catch (error) {
    return {
      status: 'unhealthy',
      provider: provider.type,
      error: error.message
    };
  }
}