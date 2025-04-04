// Import the final schema to PocketBase
import PocketBase from 'pocketbase';
import fs from 'fs';
import path from 'path';
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

// Schema file path
const SCHEMA_PATH = path.join(process.cwd(), 'pocketbase', 'final_schema.json');

async function importSchema() {
  try {
    console.log(`Connecting to PocketBase at ${POCKETBASE_URL}...`);

    // Initialize PocketBase client
    const pb = new PocketBase(POCKETBASE_URL);

    // Authenticate as admin
    console.log(`Authenticating as ${ADMIN_EMAIL}...`);
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);

    if (!pb.authStore.isValid) {
      throw new Error('Authentication failed');
    }

    console.log('Authentication successful!');

    // Read schema file
    console.log(`Reading schema from ${SCHEMA_PATH}...`);
    const schemaData = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8'));

    // Import collections
    console.log('Importing collections...');

    // Use the collections import endpoint
    await pb.collections.import(schemaData.collections, false);

    console.log('Schema import completed successfully!');

  } catch (error) {
    console.error('Error importing schema:', error);

    // Provide more detailed error information
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the import
importSchema();
