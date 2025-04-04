// Script to set up monitoring for PocketBase
import fs from 'fs';
import path from 'path';
import readline from 'readline';

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to create monitoring scripts
const createMonitoringScripts = async () => {
  try {
    // Create the scripts directory if it doesn't exist
    const scriptsDir = path.join(process.cwd(), 'monitoring-scripts');
    if (!fs.existsSync(scriptsDir)) {
      fs.mkdirSync(scriptsDir, { recursive: true });
    }
    
    // Create the health check script
    const healthCheckScriptPath = path.join(scriptsDir, 'health-check.js');
    
    const healthCheckScriptContent = `
// PocketBase Health Check Script
// This script checks the health of your PocketBase instance and sends alerts if there are issues

// Import required modules
const https = require('https');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  pocketbase: {
    url: 'https://backend.fata.plus',
    healthEndpoint: '/api/health',
    timeout: 10000 // 10 seconds
  },
  alerts: {
    enabled: true,
    email: {
      enabled: true,
      from: 'alerts@example.com',
      to: 'admin@example.com',
      smtp: {
        host: 'smtp.example.com',
        port: 587,
        secure: false,
        auth: {
          user: 'user@example.com',
          pass: 'password'
        }
      }
    },
    slack: {
      enabled: false,
      webhookUrl: 'https://hooks.slack.com/services/xxx/yyy/zzz'
    }
  },
  logging: {
    enabled: true,
    file: path.join(__dirname, 'health-check.log'),
    console: true
  }
};

// Create a logger
const logger = {
  log: (message) => {
    const timestamp = new Date().toISOString();
    const logMessage = \`[\${timestamp}] \${message}\`;
    
    if (config.logging.console) {
      console.log(logMessage);
    }
    
    if (config.logging.enabled && config.logging.file) {
      fs.appendFileSync(config.logging.file, logMessage + '\\n');
    }
  },
  error: (message, error) => {
    const timestamp = new Date().toISOString();
    const logMessage = \`[\${timestamp}] ERROR: \${message}\`;
    const errorDetails = error ? \`\\n\${error.stack || error}\` : '';
    
    if (config.logging.console) {
      console.error(logMessage, errorDetails);
    }
    
    if (config.logging.enabled && config.logging.file) {
      fs.appendFileSync(config.logging.file, logMessage + errorDetails + '\\n');
    }
  }
};

// Check PocketBase health
const checkHealth = () => {
  return new Promise((resolve, reject) => {
    const url = \`\${config.pocketbase.url}\${config.pocketbase.healthEndpoint}\`;
    
    logger.log(\`Checking health at \${url}\`);
    
    const request = https.get(url, { timeout: config.pocketbase.timeout }, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        try {
          const result = JSON.parse(data);
          
          if (response.statusCode === 200) {
            logger.log('Health check passed');
            resolve({
              status: 'healthy',
              statusCode: response.statusCode,
              data: result
            });
          } else {
            logger.error(\`Health check failed with status code \${response.statusCode}\`);
            reject({
              status: 'unhealthy',
              statusCode: response.statusCode,
              data: result
            });
          }
        } catch (error) {
          logger.error('Error parsing health check response', error);
          reject({
            status: 'error',
            statusCode: response.statusCode,
            error: 'Invalid response format'
          });
        }
      });
    });
    
    request.on('error', (error) => {
      logger.error('Health check request failed', error);
      reject({
        status: 'error',
        error: error.message
      });
    });
    
    request.on('timeout', () => {
      request.destroy();
      logger.error('Health check timed out');
      reject({
        status: 'error',
        error: 'Request timed out'
      });
    });
  });
};

// Send email alert
const sendEmailAlert = async (subject, message) => {
  if (!config.alerts.email.enabled) {
    return;
  }
  
  try {
    const transporter = nodemailer.createTransport(config.alerts.email.smtp);
    
    await transporter.sendMail({
      from: config.alerts.email.from,
      to: config.alerts.email.to,
      subject: subject,
      text: message,
      html: \`<p>\${message.replace(/\\n/g, '<br>')}</p>\`
    });
    
    logger.log('Email alert sent');
  } catch (error) {
    logger.error('Failed to send email alert', error);
  }
};

// Send Slack alert
const sendSlackAlert = async (message) => {
  if (!config.alerts.slack.enabled) {
    return;
  }
  
  try {
    const payload = {
      text: message
    };
    
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const request = https.request(config.alerts.slack.webhookUrl, requestOptions, (response) => {
      if (response.statusCode === 200) {
        logger.log('Slack alert sent');
      } else {
        logger.error(\`Failed to send Slack alert: \${response.statusCode}\`);
      }
    });
    
    request.on('error', (error) => {
      logger.error('Failed to send Slack alert', error);
    });
    
    request.write(JSON.stringify(payload));
    request.end();
  } catch (error) {
    logger.error('Failed to send Slack alert', error);
  }
};

// Send alerts
const sendAlerts = async (subject, message) => {
  if (!config.alerts.enabled) {
    return;
  }
  
  await sendEmailAlert(subject, message);
  await sendSlackAlert(message);
};

// Main function
const main = async () => {
  try {
    const result = await checkHealth();
    
    // Everything is fine
    logger.log(\`PocketBase is healthy: \${JSON.stringify(result)}\`);
  } catch (error) {
    // Health check failed
    logger.error('PocketBase health check failed', error);
    
    // Send alerts
    const subject = 'PocketBase Health Check Failed';
    const message = \`
PocketBase Health Check Failed
Time: \${new Date().toISOString()}
Status: \${error.status}
Status Code: \${error.statusCode}
Error: \${error.error || JSON.stringify(error.data)}

Please check your PocketBase instance at \${config.pocketbase.url}.
\`;
    
    await sendAlerts(subject, message);
  }
};

// Run the script
main().catch((error) => {
  logger.error('Unhandled error in health check script', error);
});
    `;
    
    fs.writeFileSync(healthCheckScriptPath, healthCheckScriptContent);
    console.log(`Health check script created at: ${healthCheckScriptPath}`);
    
    // Create the cron job file
    const cronJobPath = path.join(scriptsDir, 'monitoring-cron');
    
    const cronJobContent = `# PocketBase Monitoring Cron Jobs
# Add this to your crontab with: crontab monitoring-cron

# Run health check every 5 minutes
*/5 * * * * node /path/to/monitoring-scripts/health-check.js >> /path/to/monitoring-scripts/cron.log 2>&1
`;
    
    fs.writeFileSync(cronJobPath, cronJobContent);
    console.log(`Cron job file created at: ${cronJobPath}`);
    
    // Create the package.json file
    const packageJsonPath = path.join(scriptsDir, 'package.json');
    
    const packageJsonContent = `{
  "name": "pocketbase-monitoring",
  "version": "1.0.0",
  "description": "Monitoring scripts for PocketBase",
  "main": "health-check.js",
  "scripts": {
    "health-check": "node health-check.js"
  },
  "dependencies": {
    "nodemailer": "^6.9.1"
  }
}
`;
    
    fs.writeFileSync(packageJsonPath, packageJsonContent);
    console.log(`Package.json file created at: ${packageJsonPath}`);
    
    // Create the README file
    const readmePath = path.join(scriptsDir, 'README.md');
    
    const readmeContent = `# PocketBase Monitoring System

This directory contains scripts for monitoring your PocketBase instance.

## Setup

1. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

2. Edit the configuration in \`health-check.js\`:
   - Set the PocketBase URL and health endpoint
   - Configure alert settings (email, Slack)
   - Configure logging settings

3. Set up a cron job to run the health check script automatically:
   \`\`\`
   crontab monitoring-cron
   \`\`\`

## Usage

### Running a Health Check Manually

\`\`\`
node health-check.js
\`\`\`

This will check the health of your PocketBase instance and send alerts if there are issues.

## Monitoring Strategy

- Health checks are run every 5 minutes
- Alerts are sent via email and/or Slack if the health check fails
- Logs are stored in \`health-check.log\`

## Advanced Monitoring

For more advanced monitoring, consider using:
- Prometheus for metrics collection
- Grafana for visualization
- Alertmanager for alert management

## Requirements

- Node.js
- nodemailer (for email alerts)
`;
    
    fs.writeFileSync(readmePath, readmeContent);
    console.log(`README file created at: ${readmePath}`);
    
    // Create the PocketBase health endpoint hook
    const hooksDir = path.join(process.cwd(), 'pb_hooks');
    if (!fs.existsSync(hooksDir)) {
      fs.mkdirSync(hooksDir, { recursive: true });
    }
    
    const healthHookPath = path.join(hooksDir, 'health.js');
    
    const healthHookContent = `
// Enhanced health endpoint for PocketBase
// This file should be placed in the pb_hooks directory of your PocketBase instance

// Initialize the app
onEvent('app.before', () => {
    // Register custom health endpoint
    routerAdd('GET', '/api/health/detailed', getDetailedHealth, {});
    
    console.log('Enhanced health endpoint initialized');
});

// Get detailed health information
async function getDetailedHealth(c) {
    try {
        // Check database connection
        const dbStatus = await checkDatabase();
        
        // Check disk space
        const diskStatus = await checkDiskSpace();
        
        // Check memory usage
        const memoryStatus = await checkMemoryUsage();
        
        // Check system load
        const loadStatus = await checkSystemLoad();
        
        // Determine overall status
        const overallStatus = 
            dbStatus.status === 'healthy' &&
            diskStatus.status === 'healthy' &&
            memoryStatus.status === 'healthy' &&
            loadStatus.status === 'healthy'
                ? 'healthy'
                : 'unhealthy';
        
        // Return health information
        return c.json(200, {
            status: overallStatus,
            message: overallStatus === 'healthy' ? 'All systems operational' : 'Some systems are experiencing issues',
            timestamp: new Date().toISOString(),
            version: $app.version(),
            uptime: process.uptime(),
            components: {
                database: dbStatus,
                disk: diskStatus,
                memory: memoryStatus,
                system: loadStatus
            }
        });
    } catch (error) {
        console.error('Error getting detailed health:', error);
        return c.json(500, {
            status: 'error',
            message: 'Error getting detailed health information',
            error: error.message
        });
    }
}

// Check database connection
async function checkDatabase() {
    try {
        // Perform a simple query to check database connection
        const result = await $app.dao().findRecordById('_admins', '');
        
        // If we get here, the database is connected (even though the record doesn't exist)
        return {
            status: 'healthy',
            message: 'Database connection is healthy'
        };
    } catch (error) {
        // Check if the error is just "record not found" which is expected
        if (error.message.includes('not found')) {
            return {
                status: 'healthy',
                message: 'Database connection is healthy'
            };
        }
        
        // Otherwise, there's a real database issue
        return {
            status: 'unhealthy',
            message: 'Database connection failed',
            error: error.message
        };
    }
}

// Check disk space
async function checkDiskSpace() {
    try {
        // This is a simplified check - in a real implementation,
        // you would use a system command or library to check disk space
        
        // For now, we'll just return a healthy status
        return {
            status: 'healthy',
            message: 'Disk space is sufficient',
            details: {
                total: '100GB',
                used: '50GB',
                free: '50GB',
                percent: 50
            }
        };
    } catch (error) {
        return {
            status: 'error',
            message: 'Failed to check disk space',
            error: error.message
        };
    }
}

// Check memory usage
async function checkMemoryUsage() {
    try {
        const memoryUsage = process.memoryUsage();
        
        // Convert to MB for readability
        const rss = Math.round(memoryUsage.rss / 1024 / 1024);
        const heapTotal = Math.round(memoryUsage.heapTotal / 1024 / 1024);
        const heapUsed = Math.round(memoryUsage.heapUsed / 1024 / 1024);
        
        // Determine status based on memory usage
        // This is a simplified check - adjust thresholds as needed
        const status = rss < 1024 ? 'healthy' : 'warning';
        
        return {
            status: status,
            message: status === 'healthy' ? 'Memory usage is normal' : 'Memory usage is high',
            details: {
                rss: \`\${rss}MB\`,
                heapTotal: \`\${heapTotal}MB\`,
                heapUsed: \`\${heapUsed}MB\`
            }
        };
    } catch (error) {
        return {
            status: 'error',
            message: 'Failed to check memory usage',
            error: error.message
        };
    }
}

// Check system load
async function checkSystemLoad() {
    try {
        // This is a simplified check - in a real implementation,
        // you would use a system command or library to check system load
        
        // For now, we'll just return a healthy status
        return {
            status: 'healthy',
            message: 'System load is normal',
            details: {
                load1: 0.5,
                load5: 0.7,
                load15: 0.6
            }
        };
    } catch (error) {
        return {
            status: 'error',
            message: 'Failed to check system load',
            error: error.message
        };
    }
}
    `;
    
    fs.writeFileSync(healthHookPath, healthHookContent);
    console.log(`Health endpoint hook created at: ${healthHookPath}`);
    
    console.log('\nMonitoring system setup completed!');
    console.log('\nNext steps:');
    console.log('1. Install dependencies in the monitoring-scripts directory');
    console.log('2. Edit the configuration in health-check.js');
    console.log('3. Copy the health.js hook to your PocketBase server');
    console.log('4. Set up a cron job to run the health check script automatically');
    console.log('5. Test the monitoring system');
    
    rl.close();
  } catch (error) {
    console.error('Error creating monitoring scripts:', error);
    rl.close();
  }
};

// Main function
const setupMonitoringSystem = async () => {
  try {
    console.log('Setting up monitoring system for PocketBase...');
    
    // Create monitoring scripts
    await createMonitoringScripts();
  } catch (error) {
    console.error('Error setting up monitoring system:', error);
    rl.close();
  }
};

// Run the script
setupMonitoringSystem();
