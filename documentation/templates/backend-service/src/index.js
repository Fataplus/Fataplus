import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { generatePRD, generateTDR, generateTechnicalSpec } from './services/documentGenerator.js';
import { validateIntakeData } from './utils/validation.js';
import { logger } from './utils/logger.js';
import intakeRoutes from './routes/intake.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'https://fataplus.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    body: req.method === 'POST' ? '[REDACTED]' : undefined
  });
  next();
});

// Static files for generated documents
app.use('/documents', express.static(join(__dirname, '../generated-documents')));

// Routes
app.use('/api/intake', intakeRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Document generation endpoint
app.post('/api/generate-documents', async (req, res) => {
  try {
    // Validate intake data
    const { error, value } = validateIntakeData(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details.map(d => d.message)
      });
    }

    const intakeData = value;
    logger.info('Starting document generation', {
      projectTitle: intakeData.projectTitle,
      contactEmail: intakeData.contactEmail
    });

    // Generate all documents in parallel
    const [prd, tdr, techSpec] = await Promise.all([
      generatePRD(intakeData),
      generateTDR(intakeData),
      generateTechnicalSpec(intakeData)
    ]);

    // Prepare response with document URLs
    const documents = {
      prd: {
        filename: `PRD-${intakeData.projectTitle.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.md`,
        content: prd,
        url: `/api/documents/${encodeURIComponent(prd.filename)}`
      },
      tdr: {
        filename: `TDR-${intakeData.projectTitle.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.md`,
        content: tdr,
        url: `/api/documents/${encodeURIComponent(tdr.filename)}`
      },
      technicalSpec: {
        filename: `Technical-Spec-${intakeData.projectTitle.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.md`,
        content: techSpec,
        url: `/api/documents/${encodeURIComponent(techSpec.filename)}`
      }
    };

    logger.info('Document generation completed', {
      projectTitle: intakeData.projectTitle,
      documentsGenerated: Object.keys(documents).length
    });

    res.json({
      success: true,
      message: 'Documents generated successfully',
      documents,
      metadata: {
        generatedAt: new Date().toISOString(),
        projectId: `FP-${Date.now()}`,
        version: '1.0'
      }
    });

  } catch (error) {
    logger.error('Document generation failed', {
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      error: 'Document generation failed',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get document endpoint
app.get('/api/documents/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = join(__dirname, '../generated-documents', filename);

    res.download(filePath, (err) => {
      if (err) {
        logger.error('Document download failed', { filename, error: err.message });
        res.status(404).json({
          success: false,
          error: 'Document not found'
        });
      }
    });
  } catch (error) {
    logger.error('Document retrieval error', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve document'
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  logger.error('Unhandled error', {
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method
  });

  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Fataplus Document Generator Service started`, {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  });
});

export default app;