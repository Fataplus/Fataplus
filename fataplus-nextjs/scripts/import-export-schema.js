// Import PocketBase schema in the exact format of an export
import fs from 'fs';
import fetch from 'node-fetch';
import readline from 'readline';
import path from 'path';

const POCKETBASE_URL = 'https://backend.fata.plus';
const SCHEMA_PATH = path.join(process.cwd(), 'pocketbase', 'export_compatible_schema.json');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function importSchema() {
  try {
    // Read the schema file
    const schemaData = fs.readFileSync(SCHEMA_PATH, 'utf8');
    const collections = JSON.parse(schemaData);

    console.log(`Found ${collections.length} collections in schema file.`);

    // Use provided admin credentials
    const email = 'fenohery@fata.plus';
    const password = '2025Fefe!';

    (async () => {
      try {
        // Authenticate as admin
        console.log('Authenticating as admin...');
        const authResponse = await fetch(`${POCKETBASE_URL}/api/admins/auth-with-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            password
          })
        });

        if (!authResponse.ok) {
          throw new Error(`Authentication failed: ${authResponse.status} ${authResponse.statusText}`);
        }

        const authData = await authResponse.json();
        const token = authData.token;

        console.log('Authentication successful!');

        // Import the schema
        console.log('Importing schema...');
        const importResponse = await fetch(`${POCKETBASE_URL}/api/collections/import`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
          body: JSON.stringify({
            collections: collections,
            deleteMissing: false
          })
        });

        if (!importResponse.ok) {
          const errorData = await importResponse.json();
          throw new Error(`Schema import failed: ${JSON.stringify(errorData)}`);
        }

        console.log('Schema imported successfully!');

      } catch (error) {
        console.error('Error:', error.message);
      } finally {
        rl.close();
      }
    })();
  } catch (error) {
    console.error('Error reading schema file:', error);
    rl.close();
  }
}

importSchema();
