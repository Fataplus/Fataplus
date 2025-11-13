import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import Handlebars from 'handlebars';
import { marked } from 'marked';
import { logger } from '../utils/logger.js';
import { callAI, generateWithTemplate } from './aiService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const TEMPLATES_DIR = join(__dirname, '../templates');
const OUTPUT_DIR = join(__dirname, '../../generated-documents');

// Ensure output directory exists
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Register Handlebars helpers
Handlebars.registerHelper('formatDate', () => {
  return new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

Handlebars.registerHelper('generateId', () => {
  return `FP-${Date.now().toString().slice(-6)}`;
});

Handlebars.registerHelper('json', (obj) => {
  return JSON.stringify(obj, null, 2);
});

Handlebars.registerHelper('capitalize', (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
});

Handlebars.registerHelper('budgetRange', (budget) => {
  const budgetMap = {
    'small': '< 500K MGA',
    'medium': '500K - 1M MGA',
    'large': '1M - 5M MGA',
    'enterprise': '> 5M MGA'
  };
  return budgetMap[budget] || budget;
});

Handlebars.registerHelper('timelineRange', (timeline) => {
  const timelineMap = {
    'urgent': '< 1 mois (Urgent)',
    'short': '1-3 mois',
    'medium': '3-6 mois',
    'long': '6-12 mois',
    'extended': '> 12 mois'
  };
  return timelineMap[timeline] || timeline;
});

async function loadTemplate(templateName) {
  try {
    const templatePath = join(TEMPLATES_DIR, `${templateName}.hbs`);
    if (!existsSync(templatePath)) {
      throw new Error(`Template not found: ${templateName}`);
    }
    const templateContent = readFileSync(templatePath, 'utf-8');
    return Handlebars.compile(templateContent);
  } catch (error) {
    logger.error('Failed to load template', { templateName, error: error.message });
    throw error;
  }
}

export async function generatePRD(intakeData) {
  try {
    logger.info('Generating PRD', { projectTitle: intakeData.projectTitle });

    const enhancedData = await enhanceIntakeData(intakeData, 'prd');
    const template = await loadTemplate('prd-template');

    const content = template(enhancedData);
    const filename = `PRD-${enhancedData.projectTitle.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.md`;

    // Save to file
    const filePath = join(OUTPUT_DIR, filename);
    writeFileSync(filePath, content, 'utf-8');

    logger.info('PRD generated successfully', { filename });

    return {
      filename,
      content,
      type: 'prd'
    };
  } catch (error) {
    logger.error('PRD generation failed', { error: error.message });
    throw error;
  }
}

export async function generateTDR(intakeData) {
  try {
    logger.info('Generating TDR', { projectTitle: intakeData.projectTitle });

    const enhancedData = await enhanceIntakeData(intakeData, 'tdr');
    const template = await loadTemplate('tdr-template');

    const content = template(enhancedData);
    const filename = `TDR-${enhancedData.projectTitle.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.md`;

    // Save to file
    const filePath = join(OUTPUT_DIR, filename);
    writeFileSync(filePath, content, 'utf-8');

    logger.info('TDR generated successfully', { filename });

    return {
      filename,
      content,
      type: 'tdr'
    };
  } catch (error) {
    logger.error('TDR generation failed', { error: error.message });
    throw error;
  }
}

export async function generateTechnicalSpec(intakeData) {
  try {
    logger.info('Generating Technical Specification', { projectTitle: intakeData.projectTitle });

    const enhancedData = await enhanceIntakeData(intakeData, 'technical');
    const template = await loadTemplate('technical-spec-template');

    const content = template(enhancedData);
    const filename = `Technical-Spec-${enhancedData.projectTitle.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.md`;

    // Save to file
    const filePath = join(OUTPUT_DIR, filename);
    writeFileSync(filePath, content, 'utf-8');

    logger.info('Technical specification generated successfully', { filename });

    return {
      filename,
      content,
      type: 'technical'
    };
  } catch (error) {
    logger.error('Technical specification generation failed', { error: error.message });
    throw error;
  }
}

async function enhanceIntakeData(intakeData, documentType) {
  try {
    logger.info('Enhancing intake data with AI', { documentType });

    const enhancedData = { ...intakeData };

    // Generate AI-enhanced sections based on document type
    switch (documentType) {
      case 'prd':
        enhancedData.aiGenerated = {
          executiveSummary: await generateExecutiveSummary(intakeData),
          businessObjectives: await generateBusinessObjectives(intakeData),
          userPersonas: await generateUserPersonas(intakeData),
          successMetrics: await generateSuccessMetrics(intakeData)
        };
        break;

      case 'tdr':
        enhancedData.aiGenerated = {
          projectScope: await generateProjectScope(intakeData),
          deliverables: await generateDeliverables(intakeData),
          timeline: await generateTimeline(intakeData),
          teamComposition: await generateTeamComposition(intakeData)
        };
        break;

      case 'technical':
        enhancedData.aiGenerated = {
          technicalArchitecture: await generateTechnicalArchitecture(intakeData),
          securityConsiderations: await generateSecurityConsiderations(intakeData),
          performanceRequirements: await generatePerformanceRequirements(intakeData),
          integrationPlan: await generateIntegrationPlan(intakeData)
        };
        break;
    }

    // Add metadata
    enhancedData.metadata = {
      generatedAt: new Date().toISOString(),
      projectId: `FP-${Date.now().toString().slice(-6)}`,
      version: '1.0',
      documentType
    };

    return enhancedData;
  } catch (error) {
    logger.error('Data enhancement failed', { error: error.message });
    throw error;
  }
}

// AI Generation Functions
async function generateExecutiveSummary(intakeData) {
  const prompt = `
    En tant que consultant expert en transformation digitale, génère un résumé exécutif passionnant pour ce projet :

    Titre : ${intakeData.projectTitle}
    Problème : ${intakeData.problemStatement}
    Solution : ${intakeData.solutionVision}
    Public cible : ${intakeData.targetAudience}
    Impact attendu : ${intakeData.expectedImpact}
    Secteur : ${intakeData.industry}
    Budget : ${intakeData.budget}

    Génère 3-4 paragraphes percutants qui captent l'essence du projet et sa valeur commerciale.
  `;

  return await callAI(prompt, 'executive-summary');
}

async function generateBusinessObjectives(intakeData) {
  const prompt = `
    Définis 3-5 objectifs business SMART pour ce projet :

    ${JSON.stringify(intakeData, null, 2)}

    Pour chaque objectif, inclue :
    - L'objectif clair et mesurable
    - Indicateurs de succès (KPIs)
    - Timeline réaliste
    - Impact sur l'entreprise
  `;

  return await callAI(prompt, 'business-objectives');
}

async function generateUserPersonas(intakeData) {
  const prompt = `
    Crée 2-3 personas détaillés pour les utilisateurs de ce projet :

    Projet : ${intakeData.projectTitle}
    Public cible : ${intakeData.targetAudience}
    Solution : ${intakeData.solutionVision}

    Pour chaque persona, inclue :
    - Nom et rôle
    - Objectifs et motivations
    - Frustrations actuelles
    - Besoins spécifiques
    - Scénario d'utilisation typique
  `;

  return await callAI(prompt, 'user-personas');
}

async function generateSuccessMetrics(intakeData) {
  const prompt = `
    Définis des métriques de succès précises pour ce projet :

    ${JSON.stringify(intakeData, null, 2)}

    Inclus :
    - KPIs business (revenus, utilisateurs, etc.)
    - KPIs utilisateurs (satisfaction, engagement)
    - KPIs techniques (performance, disponibilité)
    - Méthodes de mesure
    - Cibles réalistes
  `;

  return await callAI(prompt, 'success-metrics');
}

async function generateProjectScope(intakeData) {
  const prompt = `
    Définis le périmètre précis de ce projet pour un cahier des charges :

    ${JSON.stringify(intakeData, null, 2)}

    Structure ta réponse en :
    - Périmètre inclus (ce qui sera fait)
    - Périmètre exclu (ce qui ne sera pas fait)
    - Limites et contraintes
    - Hypothèses et dépendances
  `;

  return await callAI(prompt, 'project-scope');
}

async function generateDeliverables(intakeData) {
  const prompt = `
    Liste tous les livrables concrets pour ce projet :

    ${JSON.stringify(intakeData, null, 2)}

    Inclus pour chaque livrable :
    - Description détaillée
    - Format (document, code, design, etc.)
    - Critères de validation
    - Responsable typique
    - Échéance estimée
  `;

  return await callAI(prompt, 'deliverables');
}

async function generateTimeline(intakeData) {
  const prompt = `
    Crée un timeline de projet réaliste basé sur :

    Délai souhaité : ${intakeData.timeline}
    Complexité : ${intakeData.complexity}
    Types de projets : ${JSON.stringify(intakeData.projectTypes || [])}
    Fonctionnalités requises : ${JSON.stringify(intakeData.mustHave || [])}

    Génère :
    - Phases principales du projet
    - Durées estimées par phase
    - Jalons clés
    - Dépendances entre phases
    - Plan de mitigation des retards
  `;

  return await callAI(prompt, 'timeline');
}

async function generateTeamComposition(intakeData) {
  const prompt = `
    Définis la composition d'équipe idéale pour ce projet :

    ${JSON.stringify(intakeData, null, 2)}

    Inclus :
    - Rôles nécessaires (PM, dev, designer, etc.)
    - Niveau d'expérience requis
    - Temps par rôle (% ou temps plein)
    - Compétences techniques spécifiques
    - Plan de recrutement si nécessaire
  `;

  return await callAI(prompt, 'team-composition');
}

async function generateTechnicalArchitecture(intakeData) {
  const prompt = `
    Propose une architecture technique adaptée à :

    Technologies préférées : ${JSON.stringify(intakeData.frontendTech || [])} / ${JSON.stringify(intakeData.backendTech || [])}
    Base de données : ${JSON.stringify(intakeData.database || [])}
    Intégrations : ${intakeData.integrations}
    Complexité : ${intakeData.complexity}
    Types de projets : ${JSON.stringify(intakeData.projectTypes || [])}

    Décris :
    - Architecture système globale
    - Stack technique recommandé
    - Infrastructure suggérée
    - Diagramme ASCII de l'architecture
    - Justification des choix techniques
  `;

  return await callAI(prompt, 'technical-architecture');
}

async function generateSecurityConsiderations(intakeData) {
  const prompt = `
    Définis les exigences de sécurité pour ce projet :

    Exigences de sécurité : ${JSON.stringify(intakeData.security || [])}
    Données sensibles : ${JSON.stringify(intakeData.sensitiveData || [])}
    Type d'application : ${JSON.stringify(intakeData.projectTypes || [])}

    Inclus :
    - Menaces et risques identifiés
    - Mesures de sécurité techniques
    - Conformité réglementaire
    - Plan de sécurité par phases
    - Tests de sécurité prévus
  `;

  return await callAI(prompt, 'security-considerations');
}

async function generatePerformanceRequirements(intakeData) {
  const prompt = `
    Définis les exigences de performance pour ce projet :

    ${JSON.stringify(intakeData, null, 2)}

    Inclus :
    - Objectifs de temps de chargement
    - Nombre d'utilisateurs simultanés supportés
    - Pic de traffic anticipé
    - Plan de scalabilité
    - Métriques de monitoring
  `;

  return await callAI(prompt, 'performance-requirements');
}

async function generateIntegrationPlan(intakeData) {
  const prompt = `
    Crée un plan d'intégration détaillé basé sur :

    Intégrations requises : ${intakeData.integrations || 'Aucune'}
    Technologies backend : ${JSON.stringify(intakeData.backendTech || [])}

    Décris :
    - APIs et systèmes à intégrer
    - Méthodes d'intégration
    - Sécurité des intégrations
    - Plan de test des intégrations
    - Documentation requise
  `;

  return await callAI(prompt, 'integration-plan');
}