import fs from 'fs';
import fetch from 'node-fetch';
import readline from 'readline';
import path from 'path';

const POCKETBASE_URL = 'https://backend.fata.plus';

// You can change this to use any of the schema files
// Options: 'pb_schema.json', 'minimal_schema.json', 'fixed_schema.json', 'complete_schema.json'
const SCHEMA_FILENAME = 'minimal_schema.json';
const SCHEMA_PATH = path.join(process.cwd(), 'pocketbase', SCHEMA_FILENAME);

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function importSchema() {
  try {
    // Read the schema file
    const schemaData = fs.readFileSync(SCHEMA_PATH, 'utf8');
    const schema = JSON.parse(schemaData);

    console.log(`Found ${schema.collections.length} collections in schema file.`);

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
          console.log(`Importing schema from ${SCHEMA_FILENAME}...`);
          const importResponse = await fetch(`${POCKETBASE_URL}/api/collections/import`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token
            },
            body: JSON.stringify({
              collections: schema.collections,
              deleteMissing: false
            })
          });

          if (!importResponse.ok) {
            const errorData = await importResponse.json();
            throw new Error(`Schema import failed: ${JSON.stringify(errorData)}`);
          }

          console.log('Schema imported successfully!');

          // Create an admin user
          console.log('Creating admin user...');
          const createUserResponse = await fetch(`${POCKETBASE_URL}/api/collections/users/records`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: 'admin@fata.plus',
              password: 'Admin123!',
              passwordConfirm: 'Admin123!',
              name: 'Admin User',
              userType: 'admin',
              plan: 'premium'
            })
          });

          if (!createUserResponse.ok) {
            const errorData = await createUserResponse.json();
            console.warn(`Admin user creation failed: ${JSON.stringify(errorData)}`);
            console.log('This might be because the user already exists, which is fine.');
          } else {
            console.log('Admin user created successfully!');
            console.log('Email: admin@fata.plus');
            console.log('Password: Admin123!');
          }

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
