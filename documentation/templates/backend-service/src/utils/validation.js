import Joi from 'joi';

// Define schemas for different data types
const projectTypeSchema = Joi.string().valid(
  'ui-design',
  'product-design',
  'redesign',
  'branding',
  'prototyping',
  'website',
  'ecommerce',
  'pwa',
  'saas',
  'portal',
  'chatbot',
  'recommendation',
  'predictive',
  'nlp',
  'automation',
  'ios',
  'android',
  'crossplatform'
);

const technologySchema = Joi.string().valid(
  'html-css-js',
  'react',
  'vue',
  'angular',
  'no-preference',
  'nodejs',
  'python',
  'php',
  'java',
  'mysql',
  'postgresql',
  'mongodb',
  'firebase'
);

const securitySchema = Joi.string().valid(
  'https',
  'strong-auth',
  'encryption',
  'audit',
  'gdpr'
);

const sensitiveDataSchema = Joi.string().valid(
  'personal',
  'financial',
  'medical',
  'business',
  'none'
);

const moduleSchema = Joi.string().valid(
  'auth',
  'profiles',
  'roles',
  'social-auth',
  'catalog',
  'cart',
  'payment',
  'orders'
);

// Main intake data schema
const intakeDataSchema = Joi.object({
  // Section 1: Vision Globale
  projectTitle: Joi.string().trim().min(3).max(200).required()
    .messages({
      'string.empty': 'Le titre du projet est requis',
      'string.min': 'Le titre doit contenir au moins 3 caractères',
      'string.max': 'Le titre ne peut pas dépasser 200 caractères'
    }),

  problemStatement: Joi.string().trim().min(10).max(2000).required()
    .messages({
      'string.empty': 'Le problème à résoudre est requis',
      'string.min': 'La description du problème doit contenir au moins 10 caractères'
    }),

  solutionVision: Joi.string().trim().min(10).max(2000).required()
    .messages({
      'string.empty': 'La solution envisagée est requise',
      'string.min': 'La description de la solution doit contenir au moins 10 caractères'
    }),

  targetAudience: Joi.string().trim().min(5).max(1000).required()
    .messages({
      'string.empty': 'Le public cible est requis',
      'string.min': 'La description du public cible doit contenir au moins 5 caractères'
    }),

  expectedImpact: Joi.string().trim().min(5).max(1000).required()
    .messages({
      'string.empty': 'L\'impact attendu est requis',
      'string.min': 'La description de l\'impact doit contenir au moins 5 caractères'
    }),

  // Section 2: Informations Entreprise
  companyName: Joi.string().trim().min(2).max(100).required()
    .messages({
      'string.empty': 'Le nom de l\'entreprise est requis',
      'string.min': 'Le nom doit contenir au moins 2 caractères'
    }),

  industry: Joi.string().valid(
    'agritech', 'fintech', 'healthtech', 'edtech', 'ecommerce',
    'retail', 'manufacturing', 'government', 'nonprofit', 'other'
  ).required()
    .messages({
      'any.only': 'Sélectionnez un secteur d\'activité valide'
    }),

  companySize: Joi.string().valid(
    'startup', 'sme', 'large', 'organization', 'individual'
  ).required()
    .messages({
      'any.only': 'Sélectionnez une taille d\'entreprise valide'
    }),

  budget: Joi.string().valid('small', 'medium', 'large', 'enterprise').required()
    .messages({
      'any.only': 'Sélectionnez une fourchette de budget valide'
    }),

  timeline: Joi.string().valid('urgent', 'short', 'medium', 'long', 'extended').required()
    .messages({
      'any.only': 'Sélectionnez un délai valide'
    }),

  // Section 3: Type de Projet
  projectTypes: Joi.array().items(projectTypeSchema).min(1).required()
    .messages({
      'array.min': 'Sélectionnez au moins un type de projet'
    }),

  complexity: Joi.string().valid('simple', 'moderate', 'complex', 'very-complex').required()
    .messages({
      'any.only': 'Sélectionnez un niveau de complexité valide'
    }),

  // Section 4: Spécifications Techniques
  frontendTech: Joi.array().items(technologySchema).optional(),
  backendTech: Joi.array().items(technologySchema).optional(),
  database: Joi.array().items(technologySchema).optional(),
  integrations: Joi.string().trim().max(1000).optional(),

  // Section 5: Design et UX
  visualStyle: Joi.string().valid('modern', 'corporate', 'creative', 'minimalist').required()
    .messages({
      'any.only': 'Sélectionnez un style visuel valide'
    }),

  references: Joi.string().trim().max(1000).optional(),
  existingAssets: Joi.array().items(
    Joi.string().valid('logo', 'colors', 'typography', 'none')
  ).optional(),

  // Section 6: Fonctionnalités
  mustHave: Joi.array().items(Joi.string().trim().min(3)).min(1).required()
    .messages({
      'array.min': 'Ajoutez au moins une fonctionnalité essentielle'
    }),

  shouldHave: Joi.array().items(Joi.string().trim().min(3)).optional(),
  modules: Joi.array().items(moduleSchema).optional(),

  // Section 7: Sécurité
  security: Joi.array().items(securitySchema).optional(),
  sensitiveData: Joi.array().items(sensitiveDataSchema).optional(),

  // Section 8: Informations Complémentaires
  contactName: Joi.string().trim().min(2).max(100).required()
    .messages({
      'string.empty': 'Votre nom est requis',
      'string.min': 'Le nom doit contenir au moins 2 caractères'
    }),

  contactEmail: Joi.string().email().required()
    .messages({
      'string.email': 'Veuillez fournir une adresse email valide'
    }),

  contactPhone: Joi.string().pattern(/^[+]?[0-9\s\-()]{10,20}$/).optional()
    .messages({
      'string.pattern.base': 'Veuillez fournir un numéro de téléphone valide'
    }),

  additionalInfo: Joi.string().trim().max(2000).optional(),
  consent: Joi.boolean().valid(true).required()
    .messages({
      'any.only': 'Vous devez accepter les conditions pour soumettre le formulaire'
    })
});

// Enhanced validation with business logic
export function validateIntakeData(data) {
  // First, validate the schema
  const { error, value } = intakeDataSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
    convert: true
  });

  if (error) {
    return { error, value: null };
  }

  // Business logic validations
  const businessLogicErrors = [];

  // Check for reasonable combinations
  if (value.budget === 'small' && value.timeline === 'urgent') {
    businessLogicErrors.push('Un petit budget avec un délai urgent peut nécessiter des ajustements de périmètre');
  }

  if (value.complexity === 'very-complex' && value.timeline === 'short') {
    businessLogicErrors.push('Un projet très complexe avec un délai court peut nécessiter plus de ressources');
  }

  // Validate technology consistency
  if (value.projectTypes?.includes('saas') && !value.backendTech?.length) {
    businessLogicErrors.push('Un projet SaaS nécessite généralement des technologies backend');
  }

  // Security validation
  if (value.sensitiveData?.includes('financial') && !value.security?.includes('encryption')) {
    businessLogicErrors.push('Le traitement de données financières nécessite un chiffrement');
  }

  if (value.sensitiveData?.includes('medical') && !value.security?.includes('gdpr')) {
    businessLogicErrors.push('Le traitement de données médicales nécessite la conformité RGPD');
  }

  // Validate feature completeness
  if (value.projectTypes?.includes('ecommerce') && !value.modules?.includes('payment')) {
    businessLogicErrors.push('Un projet e-commerce devrait inclure un module de paiement');
  }

  if (value.projectTypes?.includes('chatbot') && !value.backendTech?.length) {
    businessLogicErrors.push('Un projet chatbot nécessite généralement des technologies backend');
  }

  // Check for reasonable expectations
  if (value.mustHave?.length > 10) {
    businessLogicErrors.push('Trop de fonctionnalités essentielles peuvent affecter le budget et le délai');
  }

  // Return errors if any
  if (businessLogicErrors.length > 0) {
    return {
      error: {
        details: businessLogicErrors.map(msg => ({
          message: msg,
          path: ['businessLogic'],
          type: 'business.validation'
        }))
      },
      value
    };
  }

  // Enhance data with computed fields
  value.enhancedData = {
    estimatedComplexity: calculateComplexity(value),
    recommendedTimeline: recommendTimeline(value),
    riskLevel: assessRiskLevel(value),
    technologyStack: suggestTechnologyStack(value)
  };

  return { error: null, value };
}

// Helper functions for business logic
function calculateComplexity(data) {
  let score = 0;

  // Base complexity
  const complexityScores = {
    'simple': 1,
    'moderate': 2,
    'complex': 3,
    'very-complex': 4
  };
  score += complexityScores[data.complexity] || 0;

  // Project types complexity
  const complexTypes = ['saas', 'chatbot', 'predictive', 'automation'];
  score += data.projectTypes?.filter(type => complexTypes.includes(type)).length * 0.5;

  // Security requirements
  score += data.security?.length * 0.3;

  // Features count
  score += (data.mustHave?.length || 0) * 0.2;
  score += (data.shouldHave?.length || 0) * 0.1;

  if (score <= 2) return 'simple';
  if (score <= 4) return 'moderate';
  if (score <= 6) return 'complex';
  return 'very-complex';
}

function recommendTimeline(data) {
  const baseTimelines = {
    'urgent': '1 month',
    'short': '2 months',
    'medium': '4 months',
    'long': '8 months',
    'extended': '12+ months'
  };

  let baseTimeline = baseTimelines[data.timeline];

  // Adjust based on complexity
  if (calculateComplexity(data) === 'very-complex') {
    // Add 50% to timeline
    const months = parseInt(baseTimeline) * 1.5;
    baseTimeline = `${Math.ceil(months)} months`;
  }

  return baseTimeline;
}

function assessRiskLevel(data) {
  let riskScore = 0;

  // Timeline risk
  if (data.timeline === 'urgent') riskScore += 3;
  if (data.timeline === 'short') riskScore += 2;

  // Complexity risk
  if (data.complexity === 'very-complex') riskScore += 3;
  if (data.complexity === 'complex') riskScore += 2;

  // Budget risk
  if (data.budget === 'small') riskScore += 2;

  // Technology risk
  if (!data.frontendTech?.length || !data.backendTech?.length) riskScore += 1;

  // Feature risk
  if (data.mustHave?.length > 5) riskScore += 1;

  if (riskScore >= 6) return 'high';
  if (riskScore >= 3) return 'medium';
  return 'low';
}

function suggestTechnologyStack(data) {
  const suggestions = {
    frontend: [],
    backend: [],
    database: []
  };

  // Based on project types
  if (data.projectTypes?.includes('pwa') || data.projectTypes?.includes('saas')) {
    suggestions.frontend.push('React', 'Vue.js');
  }

  if (data.projectTypes?.includes('chatbot') || data.projectTypes?.includes('predictive')) {
    suggestions.backend.push('Python', 'Node.js');
  }

  if (data.projectTypes?.includes('ecommerce') || data.projectTypes?.includes('saas')) {
    suggestions.database.push('PostgreSQL', 'MongoDB');
  }

  // Based on complexity
  if (data.complexity === 'very-complex') {
    suggestions.backend.push('Node.js', 'Java');
    suggestions.database.push('PostgreSQL');
  }

  // Remove duplicates and add preferences
  if (data.frontendTech?.length) {
    suggestions.frontend = [...new Set([...suggestions.frontend, ...data.frontendTech])];
  }
  if (data.backendTech?.length) {
    suggestions.backend = [...new Set([...suggestions.backend, ...data.backendTech])];
  }
  if (data.database?.length) {
    suggestions.database = [...new Set([...suggestions.database, ...data.database])];
  }

  return suggestions;
}

export default intakeDataSchema;