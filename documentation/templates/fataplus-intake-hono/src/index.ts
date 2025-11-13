import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { validator } from 'hono/validator';
import { serveStatic } from 'hono/cloudflare-workers';
import type { StatusCode } from 'hono/utils/http-status-codes';

// Types pour notre application
interface FormData {
  id: string;
  projectTitle: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  problemStatement: string;
  solutionVision: string;
  targetAudience: string;
  expectedImpact: string;
  industry: string;
  companySize: string;
  budget: string;
  timeline: string;
  projectTypes: string[];
  complexity: string;
  frontendTech: string[];
  backendTech: string[];
  database: string[];
  integrations?: string;
  visualStyle: string;
  references?: string;
  existingAssets: string[];
  mustHave: string[];
  shouldHave: string[];
  modules: string[];
  security: string[];
  sensitiveData: string[];
  additionalInfo?: string;
  consent: boolean;
  timestamp: string;
  status: 'submitted' | 'reviewed' | 'approved' | 'rejected';
}

interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Créer l'application Hono
const app = new Hono<{
  Bindings: {
    FORM_SUBMISSIONS: KVNamespace;
    DB: D1Database;
    ENVIRONMENT: string;
    APP_NAME: string;
    COMPANY_NAME: string;
    CONTACT_EMAIL: string;
    CONTACT_PHONE: string;
  }
}>();

// Middlewares
app.use('*', logger());
app.use('*', cors({
  origin: ['http://localhost:3000', 'https://*.pages.dev', 'https://fataplus.com'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Servir les fichiers statiques
app.use('/*', serveStatic({ root: './static' }));

// Routes API
app.get('/api/health', (c) => {
  return c.json<APIResponse>({
    success: true,
    message: 'Fataplus Intake Form API is running',
    data: {
      version: '1.0.0',
      environment: c.env.ENVIRONMENT,
      timestamp: new Date().toISOString()
    }
  });
});

// Validation schema pour les soumissions de formulaire
const submissionSchema = {
  projectTitle: (value: string) => typeof value === 'string' && value.length >= 3 && value.length <= 100,
  companyName: (value: string) => typeof value === 'string' && value.length >= 2,
  contactName: (value: string) => typeof value === 'string' && value.length >= 2,
  contactEmail: (value: string) => {
    const email = typeof value === 'string' ? value : '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  consent: (value: boolean) => typeof value === 'boolean' && value === true,
  problemStatement: (value: string) => typeof value === 'string' && value.length >= 10,
  solutionVision: (value: string) => typeof value === 'string' && value.length >= 10,
  targetAudience: (value: string) => typeof value === 'string' && value.length >= 5,
  expectedImpact: (value: string) => typeof value === 'string' && value.length >= 5,
};

// Soumettre un formulaire
app.post('/api/submit', validator('json', (value, c) => {
  // Validation basique
  const errors: string[] = [];

  for (const [field, validator] of Object.entries(submissionSchema)) {
    if (!validator(value[field as keyof typeof submissionSchema])) {
      errors.push(`Invalid ${field}`);
    }
  }

  if (errors.length > 0) {
    return c.json<APIResponse>({
      success: false,
      error: 'Validation failed',
      message: errors.join(', ')
    }, 400);
  }

  return value;
}), async (c) => {
  try {
    const data = c.req.valid('json') as Partial<FormData>;

    // Générer un ID unique
    const projectId = `FP-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Créer l'objet de soumission
    const submission: FormData = {
      id: projectId,
      projectTitle: data.projectTitle!,
      companyName: data.companyName!,
      contactName: data.contactName!,
      contactEmail: data.contactEmail!,
      contactPhone: data.contactPhone || '',
      problemStatement: data.problemStatement!,
      solutionVision: data.solutionVision!,
      targetAudience: data.targetAudience!,
      expectedImpact: data.expectedImpact!,
      industry: data.industry || '',
      companySize: data.companySize || '',
      budget: data.budget || '',
      timeline: data.timeline || '',
      projectTypes: data.projectTypes || [],
      complexity: data.complexity || '',
      frontendTech: data.frontendTech || [],
      backendTech: data.backendTech || [],
      database: data.database || [],
      integrations: data.integrations || '',
      visualStyle: data.visualStyle || '',
      references: data.references || '',
      existingAssets: data.existingAssets || [],
      mustHave: data.mustHave || [],
      shouldHave: data.shouldHave || [],
      modules: data.modules || [],
      security: data.security || [],
      sensitiveData: data.sensitiveData || [],
      additionalInfo: data.additionalInfo || '',
      consent: data.consent!,
      timestamp: new Date().toISOString(),
      status: 'submitted'
    };

    // Sauvegarder dans KV
    await c.env.FORM_SUBMISSIONS.put(projectId, JSON.stringify(submission));

    // Sauvegarder dans l'index des soumissions
    const submissions = await c.env.FORM_SUBMISSIONS.get('submissions_index');
    const submissionList = submissions ? JSON.parse(submissions) : [];
    submissionList.push({
      id: projectId,
      projectTitle: submission.projectTitle,
      companyName: submission.companyName,
      status: submission.status,
      timestamp: submission.timestamp
    });
    await c.env.FORM_SUBMISSIONS.put('submissions_index', JSON.stringify(submissionList));

    // Envoyer l'email de notification (simulé ici)
    await sendNotificationEmail(submission, c.env);

    return c.json<APIResponse>({
      success: true,
      data: {
        projectId,
        message: 'Form submitted successfully'
      }
    });

  } catch (error) {
    console.error('Submit Error:', error);
    return c.json<APIResponse>({
      success: false,
      error: 'Failed to process submission',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Valider un champ en temps réel
app.post('/api/validate', validator('json', (value) => {
  return value;
}), async (c) => {
  const { field, value } = await c.req.json() as { field: string; value: any };

  let isValid = false;
  let message = '';

  const validators = {
    email: () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = emailRegex.test(value);
      message = isValid ? 'Valid email' : 'Invalid email format';
    },
    phone: () => {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      isValid = !value || phoneRegex.test(value);
      message = isValid ? 'Valid phone' : 'Invalid phone format';
    },
    projectTitle: () => {
      isValid = typeof value === 'string' && value.length >= 3 && value.length <= 100;
      message = isValid ? 'Valid title' : 'Title must be 3-100 characters';
    },
    required: () => {
      isValid = typeof value === 'string' && value.trim().length > 0;
      message = isValid ? 'Valid' : 'This field is required';
    }
  };

  if (validators[field as keyof typeof validators]) {
    validators[field as keyof typeof validators]();
  } else {
    isValid = true;
    message = 'Field validated';
  }

  return c.json<APIResponse>({
    success: true,
    data: { isValid, message }
  });
});

// Récupérer les soumissions (admin)
app.get('/api/submissions', async (c) => {
  try {
    const submissions = await c.env.FORM_SUBMISSIONS.get('submissions_index');
    const submissionList = submissions ? JSON.parse(submissions) : [];

    return c.json<APIResponse>({
      success: true,
      data: submissionList
    });
  } catch (error) {
    return c.json<APIResponse>({
      success: false,
      error: 'Failed to fetch submissions'
    }, 500);
  }
});

// Récupérer les détails d'une soumission
app.get('/api/submissions/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const submission = await c.env.FORM_SUBMISSIONS.get(id);

    if (!submission) {
      return c.json<APIResponse>({
        success: false,
        error: 'Submission not found'
      }, 404);
    }

    return c.json<APIResponse>({
      success: true,
      data: JSON.parse(submission)
    });
  } catch (error) {
    return c.json<APIResponse>({
      success: false,
      error: 'Failed to fetch submission'
    }, 500);
  }
});

// Mettre à jour le statut d'une soumission
app.put('/api/submissions/:id/status', async (c) => {
  try {
    const id = c.req.param('id');
    const { status } = await c.req.json();

    const submissionData = await c.env.FORM_SUBMISSIONS.get(id);
    if (!submissionData) {
      return c.json<APIResponse>({
        success: false,
        error: 'Submission not found'
      }, 404);
    }

    const submission: FormData = JSON.parse(submissionData);
    submission.status = status;

    await c.env.FORM_SUBMISSIONS.put(id, JSON.stringify(submission));

    return c.json<APIResponse>({
      success: true,
      data: submission
    });
  } catch (error) {
    return c.json<APIResponse>({
      success: false,
      error: 'Failed to update submission'
    }, 500);
  }
});

// Télécharger le PRD
app.get('/api/prd/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const submissionData = await c.env.FORM_SUBMISSIONS.get(id);

    if (!submissionData) {
      return c.json<APIResponse>({
        success: false,
        error: 'Submission not found'
      }, 404);
    }

    const submission: FormData = JSON.parse(submissionData);
    const prdContent = generatePRD(submission);

    return c.text(prdContent, 200, {
      'Content-Type': 'text/markdown',
      'Content-Disposition': `attachment; filename="PRD-${submission.projectTitle}-${new Date().toISOString().split('T')[0]}.md"`
    });
  } catch (error) {
    return c.json<APIResponse>({
      success: false,
      error: 'Failed to generate PRD'
    }, 500);
  }
});

// Helper: Envoyer l'email de notification
async function sendNotificationEmail(submission: FormData, env: any) {
  const emailBody = `
Nouveau projet soumis - Fataplus SARLU

Détails du projet:
- Projet ID: ${submission.id}
- Titre: ${submission.projectTitle}
- Client: ${submission.companyName}
- Contact: ${submission.contactName} (${submission.contactEmail})
- Téléphone: ${submission.contactPhone || 'Non spécifié'}
- Budget: ${submission.budget}
- Délai: ${submission.timeline}
- Type: ${submission.projectTypes.join(', ')}

Description:
${submission.problemStatement}

Solution proposée:
${submission.solutionVision}

Soumis le: ${new Date(submission.timestamp).toLocaleString('fr-FR')}

---
Formulaire d'Intake Fataplus
  `.trim();

  // Simulation d'envoi d'email
  // En production, vous pouvez utiliser un service comme Resend, SendGrid, etc.
  console.log('Email notification:', emailBody);
  console.log('To:', env.CONTACT_EMAIL);

  return true;
}

// Helper: Générer le PRD
function generatePRD(submission: FormData): string {
  const currentDate = new Date().toLocaleDateString('fr-FR');

  return `# Product Requirements Document - ${submission.projectTitle}

**Généré le**: ${currentDate}
**Projet ID**: ${submission.id}
**Client**: ${submission.companyName}
**Contact**: ${submission.contactName} (${submission.contactEmail})

---

## 📊 Résumé Exécutif

### Problème
${submission.problemStatement}

### Solution Proposée
${submission.solutionVision}

### Public Cible
${submission.targetAudience}

### Impact Attendu
${submission.expectedImpact}

---

## 🎯 Objectifs et Spécifications

### Type de Projet
${submission.projectTypes.join(', ')}

### Complexité Technique
${submission.complexity}

### Budget Estimé
${submission.budget}

### Délai Souhaité
${submission.timeline}

---

## 📋 Fonctionnalités

### Essentielles (Must-have)
${submission.mustHave.map((feature, index) => `${index + 1}. ${feature}`).join('\n')}

### Importantes (Should-have)
${submission.shouldHave.map((feature, index) => `${index + 1}. ${feature}`).join('\n')}

### Modules Requis
${submission.modules.join(', ')}

---

## 🛠️ Spécifications Techniques

### Frontend
${submission.frontendTech.join(', ') || 'Pas de préférence'}

### Backend
${submission.backendTech.join(', ') || 'Pas de préférence'}

### Base de Données
${submission.database.join(', ') || 'À définir'}

### Intégrations
${submission.integrations || 'Aucune'}

---

## 🎨 Design et UX

### Style Visuel
${submission.visualStyle}

### Références
${submission.references || 'Aucune'}

### Éléments Existant
${submission.existingAssets.join(', ') || 'Aucun'}

---

## 🔒 Sécurité

### Exigences
${submission.security.join(', ') || 'Standard'}

### Données Sensibles
${submission.sensitiveData.join(', ') || 'Aucune'}

---

## 📞 Contact

**Client**: ${submission.companyName}
**Contact**: ${submission.contactName}
**Email**: ${submission.contactEmail}
**Téléphone**: ${submission.contactPhone || 'Non spécifié'}

---

*Généré automatiquement via le formulaire d'intake Fataplus*
*© 2025 Fataplus SARLU. Tous droits réservés.*`;
}

// Export pour les tests
export default app;