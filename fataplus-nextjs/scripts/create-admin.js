/**
 * PocketBase Create Admin Script
 *
 * This script creates a new admin user in PocketBase.
 * Run this script with Node.js to create a new admin.
 *
 * Usage:
 * SUPER_ADMIN_EMAIL=your-email@example.com SUPER_ADMIN_PASSWORD=your-password NEW_ADMIN_EMAIL=new-admin@example.com NEW_ADMIN_PASSWORD=new-password node create-admin.js
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configuration
const POCKETBASE_URL = process.env.POCKETBASE_URL || 'https://backend.fata.plus';
const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL;
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD;

// New admin details
const NEW_ADMIN_EMAIL = process.env.NEW_ADMIN_EMAIL;
const NEW_ADMIN_PASSWORD = process.env.NEW_ADMIN_PASSWORD;

// Validate required environment variables
if (!SUPER_ADMIN_EMAIL || !SUPER_ADMIN_PASSWORD || !NEW_ADMIN_EMAIL || !NEW_ADMIN_PASSWORD) {
  console.error('Error: Missing required environment variables.');
  console.error('Required variables: SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD, NEW_ADMIN_EMAIL, NEW_ADMIN_PASSWORD');
  process.exit(1);
}

// Function to authenticate with PocketBase as super admin
async function authenticateSuperAdmin() {
  try {
    console.log('Authenticating as super admin...');

    const response = await fetch(`${POCKETBASE_URL}/api/admins/auth-with-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: SUPER_ADMIN_EMAIL,
        password: SUPER_ADMIN_PASSWORD,
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

// Function to create a new admin
async function createAdmin(token) {
  try {
    console.log('Creating new admin user...');

    const response = await fetch(`${POCKETBASE_URL}/api/admins`, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: NEW_ADMIN_EMAIL,
        password: NEW_ADMIN_PASSWORD,
        passwordConfirm: NEW_ADMIN_PASSWORD,
        avatar: 0,
        type: 'admin' // 'admin' for regular admin, 'super' for super admin
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response:', errorText);
      throw new Error(`Failed to create admin: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('New admin created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error creating admin:', error);
    throw error;
  }
}

// Main function
async function main() {
  try {
    console.log('Starting admin creation process...');

    // Authenticate as super admin
    const token = await authenticateSuperAdmin();
    console.log('Authentication successful.');

    // Create new admin
    await createAdmin(token);

    console.log('Admin creation completed successfully!');
    console.log(`New admin email: ${NEW_ADMIN_EMAIL}`);
    console.log('Please save the password securely.');
  } catch (error) {
    console.error('Admin creation failed:', error);
  }
}

// Run the script
main();
