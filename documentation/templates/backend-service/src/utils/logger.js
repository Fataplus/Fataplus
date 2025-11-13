import winston from 'winston';

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...meta
    });
  })
);

// Create logger instance
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: {
    service: 'fataplus-doc-generator',
    environment: process.env.NODE_ENV || 'development'
  },
  transports: [
    // Console transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),

    // File transports
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),

    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  ],

  // Handle uncaught exceptions
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' })
  ],

  // Handle unhandled promise rejections
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' })
  ]
});

// Add console transport only in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
        return `${timestamp} [${level}]: ${message} ${metaStr}`;
      })
    )
  }));
}

// Helper functions for structured logging
export const logUserAction = (userId, action, details = {}) => {
  logger.info('User action', {
    type: 'user_action',
    userId,
    action,
    ...details
  });
};

export const logAPIRequest = (req, res, responseTime) => {
  logger.info('API Request', {
    type: 'api_request',
    method: req.method,
    path: req.path,
    statusCode: res.statusCode,
    responseTime: `${responseTime}ms`,
    userAgent: req.get('User-Agent'),
    ip: req.ip
  });
};

export const logDocumentGeneration = (projectTitle, documentType, duration, success) => {
  logger.info('Document generation', {
    type: 'document_generation',
    projectTitle,
    documentType,
    duration: `${duration}ms`,
    success
  });
};

export const logAIInteraction = (provider, model, promptLength, responseLength, duration) => {
  logger.info('AI Interaction', {
    type: 'ai_interaction',
    provider,
    model,
    promptLength,
    responseLength,
    duration: `${duration}ms`
  });
};

export const logError = (error, context = {}) => {
  logger.error('Application error', {
    type: 'application_error',
    error: error.message,
    stack: error.stack,
    ...context
  });
};

export default logger;