/**
 * Vercel Deployment Script
 * 
 * This script deploys the Next.js app to Vercel.
 * It uses the Vercel CLI to deploy the app.
 * 
 * Usage:
 * VERCEL_TOKEN=your-token node deploy-vercel.js
 */

import { execSync } from 'child_process';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Vercel token
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;

if (!VERCEL_TOKEN) {
  console.error('Error: VERCEL_TOKEN environment variable is required');
  process.exit(1);
}

// Environment variables to set in Vercel
const envVars = [
  'NEXT_PUBLIC_POCKETBASE_URL',
  'POCKETBASE_URL',
  'NEXT_PUBLIC_GA_MEASUREMENT_ID',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD',
];

// Check if Vercel CLI is installed
try {
  execSync('vercel --version', { stdio: 'ignore' });
} catch (error) {
  console.log('Installing Vercel CLI...');
  execSync('npm install -g vercel', { stdio: 'inherit' });
}

// Login to Vercel
console.log('Logging in to Vercel...');
execSync(`echo "${VERCEL_TOKEN}" | vercel login --token`, { stdio: 'inherit' });

// Set environment variables
console.log('Setting environment variables...');
for (const envVar of envVars) {
  const value = process.env[envVar];
  if (value) {
    console.log(`Setting ${envVar}...`);
    execSync(`vercel env add ${envVar} production "${value}"`, { stdio: 'inherit' });
  }
}

// Deploy to production
console.log('Deploying to production...');
execSync('vercel --prod', { stdio: 'inherit' });

console.log('Deployment completed successfully!');
