// Import the working schema to PocketBase
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
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
const SCHEMA_PATH = path.join(process.cwd(), 'pocketbase', 'working_schema.json');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function importSchema() {
  try {
    // Read the schema file
    console.log(`Reading schema from ${SCHEMA_PATH}...`);
    const schemaData = fs.readFileSync(SCHEMA_PATH, 'utf8');
    const collections = JSON.parse(schemaData);

    console.log(`Found ${collections.length} collections in schema file.`);

    // Authenticate as admin
    console.log('Authenticating as admin...');
    const authResponse = await fetch(`${POCKETBASE_URL}/api/admins/auth-with-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD
      })
    });

    if (!authResponse.ok) {
      throw new Error(`Authentication failed: ${authResponse.status} ${authResponse.statusText}`);
    }

    const authData = await authResponse.json();
    const token = authData.token;

    console.log('Authentication successful!');

    // Import the schema
    console.log('Importing collections...');
    const importResponse = await fetch(`${POCKETBASE_URL}/api/collections/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(collections)
    });

    if (!importResponse.ok) {
      const errorText = await importResponse.text();
      throw new Error(`Schema import failed: ${errorText}`);
    }

    console.log('Schema import completed successfully!');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    rl.close();
  }
}

// Run the import
importSchema();
