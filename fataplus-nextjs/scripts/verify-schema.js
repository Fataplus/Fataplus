// Verify PocketBase schema
import PocketBase from 'pocketbase';
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

async function verifySchema() {
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

    // Get all collections
    console.log('Fetching collections...');
    const collections = await pb.collections.getFullList();

    console.log(`Found ${collections.length} collections:`);

    // Display collection details
    collections.forEach(collection => {
      console.log(`\n--- Collection: ${collection.name} (${collection.type}) ---`);
      console.log(`Fields: ${collection.schema.length}`);

      // List fields
      collection.schema.forEach(field => {
        console.log(`  - ${field.name} (${field.type})${field.required ? ' [required]' : ''}`);
      });
    });

    console.log('\nSchema verification completed!');

  } catch (error) {
    console.error('Error verifying schema:', error);
  }
}

// Run the verification
verifySchema();
