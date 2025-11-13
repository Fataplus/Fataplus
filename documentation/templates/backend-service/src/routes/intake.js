import express from 'express';
import { body, validationResult } from 'express-validator';
import { validateIntakeData } from '../utils/validation.js';
import { logger } from '../utils/logger.js';
import { generatePRD, generateTDR, generateTechnicalSpec } from '../services/documentGenerator.js';

const router = express.Router();

// Validation middleware
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array().map(error => ({
        field: error.param,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
}

// Submit intake form and generate documents
router.post('/submit', [
  // Basic validation
  body('projectTitle').notEmpty().trim().isLength({ min: 3, max: 200 }),
  body('problemStatement').notEmpty().trim().isLength({ min: 10, max: 2000 }),
  body('solutionVision').notEmpty().trim().isLength({ min: 10, max: 2000 }),
  body('targetAudience').notEmpty().trim().isLength({ min: 5, max: 1000 }),
  body('expectedImpact').notEmpty().trim().isLength({ min: 5, max: 1000 }),

  // Company info validation
  body('companyName').notEmpty().trim().isLength({ min: 2, max: 100 }),
  body('industry').isIn(['agritech', 'fintech', 'healthtech', 'edtech', 'ecommerce', 'retail', 'manufacturing', 'government', 'nonprofit', 'other']),
  body('companySize').isIn(['startup', 'sme', 'large', 'organization', 'individual']),
  body('budget').isIn(['small', 'medium', 'large', 'enterprise']),
  body('timeline').isIn(['urgent', 'short', 'medium', 'long', 'extended']),

  // Contact info validation
  body('contactName').notEmpty().trim().isLength({ min: 2, max: 100 }),
  body('contactEmail').isEmail().normalizeEmail(),
  body('contactPhone').optional().isMobilePhone('mg-MG'), // Madagascar format

  // Consent validation
  body('consent').equals('true').withMessage('Consent is required'),

  handleValidationErrors
], async (req, res) => {
  try {
    logger.info('Processing intake form submission', {
      projectTitle: req.body.projectTitle,
      contactEmail: req.body.contactEmail
    });

    // Enhanced validation using Joi
    const { error, value } = validateIntakeData(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Enhanced validation failed',
        details: error.details.map(d => d.message)
      });
    }

    // Start document generation in background
    const documentGeneration = generateDocuments(value);

    // Respond immediately with acknowledgment
    res.status(202).json({
      success: true,
      message: 'Intake form received successfully. Documents are being generated.',
      submissionId: generateSubmissionId(),
      estimatedTime: '2-5 minutes',
      status: 'processing'
    });

    // Generate documents in background
    try {
      const documents = await documentGeneration;
      logger.info('Document generation completed', {
        submissionId: generateSubmissionId(),
        documentsGenerated: Object.keys(documents).length
      });

      // Here you would typically:
      // 1. Save to database
      // 2. Send email with download links
      // 3. Update submission status
      // 4. Trigger webhook to client portal

    } catch (genError) {
      logger.error('Background document generation failed', {
        error: genError.message,
        submissionId: generateSubmissionId()
      });
      // Handle error (retry, notify admin, etc.)
    }

  } catch (error) {
    logger.error('Intake form processing failed', {
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to process intake form'
    });
  }
});

// Get submission status
router.get('/status/:submissionId', async (req, res) => {
  try {
    const { submissionId } = req.params;

    // In a real implementation, you would check database
    // For now, return mock status
    const mockStatus = {
      submissionId,
      status: 'processing', // 'processing', 'completed', 'failed'
      progress: 65,
      estimatedTimeRemaining: '2 minutes',
      documents: []
    };

    res.json({
      success: true,
      data: mockStatus
    });

  } catch (error) {
    logger.error('Status check failed', { submissionId: req.params.submissionId });
    res.status(500).json({
      success: false,
      error: 'Failed to check submission status'
    });
  }
});

// Get generated documents
router.get('/documents/:submissionId', async (req, res) => {
  try {
    const { submissionId } = req.params;

    // In a real implementation, fetch from database
    // For now, return mock documents
    const mockDocuments = {
      submissionId,
      documents: [
        {
          type: 'prd',
          filename: 'PRD-example-project.md',
          url: `/api/documents/PRD-example-project.md`,
          size: '125 KB',
          generatedAt: new Date().toISOString()
        },
        {
          type: 'tdr',
          filename: 'TDR-example-project.md',
          url: `/api/documents/TDR-example-project.md`,
          size: '98 KB',
          generatedAt: new Date().toISOString()
        },
        {
          type: 'technical',
          filename: 'Technical-Spec-example-project.md',
          url: `/api/documents/Technical-Spec-example-project.md`,
          size: '156 KB',
          generatedAt: new Date().toISOString()
        }
      ]
    };

    res.json({
      success: true,
      data: mockDocuments
    });

  } catch (error) {
    logger.error('Document retrieval failed', { submissionId: req.params.submissionId });
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve documents'
    });
  }
});

// Resend documents via email
router.post('/resend/:submissionId', [
  body('email').isEmail().normalizeEmail()
], handleValidationErrors, async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { email } = req.body;

    logger.info('Resending documents', { submissionId, email });

    // In a real implementation:
    // 1. Verify submission exists
    // 2. Generate email with download links
    // 3. Send via email service
    // 4. Log the activity

    res.json({
      success: true,
      message: 'Documents have been resent to your email'
    });

  } catch (error) {
    logger.error('Document resend failed', {
      submissionId: req.params.submissionId,
      error: error.message
    });

    res.status(500).json({
      success: false,
      error: 'Failed to resend documents'
    });
  }
});

// Validate intake form data (pre-submission)
router.post('/validate', async (req, res) => {
  try {
    const { error, value } = validateIntakeData(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details.map(d => ({
          field: d.path.join('.'),
          message: d.message,
          value: d.context.value
        }))
      });
    }

    res.json({
      success: true,
      message: 'Data is valid',
      validatedData: value
    });

  } catch (error) {
    logger.error('Validation endpoint failed', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Validation service error'
    });
  }
});

// Get form analytics (for admin use)
router.get('/analytics', async (req, res) => {
  try {
    // In a real implementation, fetch analytics from database
    const mockAnalytics = {
      totalSubmissions: 156,
      submissionsByMonth: [
        { month: '2024-01', count: 23 },
        { month: '2024-02', count: 34 },
        { month: '2024-03', count: 45 },
        { month: '2024-04', count: 54 }
      ],
      topIndustries: [
        { industry: 'agritech', count: 45 },
        { industry: 'fintech', count: 32 },
        { industry: 'ecommerce', count: 28 }
      ],
      averageComplexity: 'moderate',
      successRate: 98.7
    };

    res.json({
      success: true,
      data: mockAnalytics
    });

  } catch (error) {
    logger.error('Analytics retrieval failed', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve analytics'
    });
  }
});

// Helper functions
function generateSubmissionId() {
  return `SUB-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

async function generateDocuments(intakeData) {
  const [prd, tdr, technicalSpec] = await Promise.all([
    generatePRD(intakeData),
    generateTDR(intakeData),
    generateTechnicalSpec(intakeData)
  ]);

  return { prd, tdr, technicalSpec };
}

export default router;