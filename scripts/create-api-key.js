/**
 * PocketBase Create API Key Script
 *
 * This script creates an API key for an admin user in PocketBase.
 * Run this script with Node.js to create a new API key.
 *
 * Usage:
 * ADMIN_EMAIL=your-email@example.com ADMIN_PASSWORD=your-password node create-api-key.js
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configuration
const POCKETBASE_URL = process.env.POCKETBASE_URL || 'https://backend.fata.plus';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Validate required environment variables
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('Error: Missing required environment variables.');
  console.error('Required variables: ADMIN_EMAIL, ADMIN_PASSWORD');
  process.exit(1);
}

// Function to authenticate with PocketBase as admin
async function authenticateAdmin() {
  try {
    console.log('Authenticating as admin...');

    const response = await fetch(`${POCKETBASE_URL}/api/admins/auth-with-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response:', errorText);
      throw new Error(`Authentication failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}

// Function to create a new API key
async function createApiKey(token) {
  try {
    console.log('Creating new API key...');

    const response = await fetch(`${POCKETBASE_URL}/api/settings/api-keys`, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Database Seeding API Key',
        scopes: ['db.read', 'db.write', 'collections.read', 'collections.write']
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response:', errorText);
      throw new Error(`Failed to create API key: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('New API key created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error creating API key:', error);
    throw error;
  }
}

// Main function
async function main() {
  try {
    console.log('Starting API key creation process...');

    // Authenticate as admin
    const token = await authenticateAdmin();
    console.log('Authentication successful.');

    // Create new API key
    const apiKey = await createApiKey(token);

    console.log('API key creation completed successfully!');
    console.log('API Key:', apiKey.key);
    console.log('Please save this key securely as it will not be shown again.');

    // Show how to use the API key
    console.log('\nTo use this API key in your scripts:');
    console.log('1. Add the API key to your request headers:');
    console.log(`   headers: { 'Authorization': 'Admin ${apiKey.key}' }`);
    console.log('2. Use this key instead of admin credentials for authentication.');
  } catch (error) {
    console.error('API key creation failed:', error);
  }
}

// Run the script
main();
