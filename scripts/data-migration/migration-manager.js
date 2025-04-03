// PocketBase Migration Manager
// This script manages schema evolution and data migrations between versions

import PocketBase from 'pocketbase';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Configuration
const POCKETBASE_URL = 'https://backend.fata.plus';
const MIGRATIONS_DIR = path.join(process.cwd(), 'migrations');

// Ensure migrations directory exists
if (!fs.existsSync(MIGRATIONS_DIR)) {
  fs.mkdirSync(MIGRATIONS_DIR, { recursive: true });
}

// Migration state file
const MIGRATION_STATE_FILE = path.join(MIGRATIONS_DIR, 'migration_state.json');

// Initialize or load migration state
const initMigrationState = () => {
  if (fs.existsSync(MIGRATION_STATE_FILE)) {
    return JSON.parse(fs.readFileSync(MIGRATION_STATE_FILE, 'utf8'));
  } else {
    const initialState = {
      lastMigration: null,
      migrations: [],
      version: '0.0.0',
      lastRun: null
    };
    fs.writeFileSync(MIGRATION_STATE_FILE, JSON.stringify(initialState, null, 2));
    return initialState;
  }
};

// Save migration state
const saveMigrationState = (state) => {
  fs.writeFileSync(MIGRATION_STATE_FILE, JSON.stringify(state, null, 2));
};

// Create a new migration file
const createMigration = (name) => {
  const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '');
  const filename = `${timestamp}_${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.js`;
  const filePath = path.join(MIGRATIONS_DIR, filename);
  
  const template = `// Migration: ${name}
// Created: ${new Date().toISOString()}

/**
 * Apply the migration
 * @param {PocketBase} pb - PocketBase instance
 * @returns {Promise<void>}
 */
export async function up(pb) {
  // TODO: Implement migration
  console.log('Applying migration: ${name}');
  
  // Example: Create a new collection
  // await pb.collections.create({
  //   name: 'new_collection',
  //   type: 'base',
  //   schema: [
  //     {
  //       name: 'field1',
  //       type: 'text',
  //       required: true
  //     }
  //   ]
  // });
  
  // Example: Update an existing collection
  // const collection = await pb.collections.getOne('existing_collection');
  // collection.schema.push({
  //   name: 'new_field',
  //   type: 'text'
  // });
  // await pb.collections.update(collection.id, collection);
  
  // Example: Data migration
  // const records = await pb.collection('old_collection').getFullList();
  // for (const record of records) {
  //   await pb.collection('new_collection').create({
  //     field1: record.old_field
  //   });
  // }
}

/**
 * Rollback the migration
 * @param {PocketBase} pb - PocketBase instance
 * @returns {Promise<void>}
 */
export async function down(pb) {
  // TODO: Implement rollback
  console.log('Rolling back migration: ${name}');
  
  // Example: Delete a collection
  // await pb.collections.delete('new_collection');
  
  // Example: Remove a field from a collection
  // const collection = await pb.collections.getOne('existing_collection');
  // collection.schema = collection.schema.filter(field => field.name !== 'new_field');
  // await pb.collections.update(collection.id, collection);
}
`;
  
  fs.writeFileSync(filePath, template);
  console.log(`Created migration file: ${filePath}`);
  return filename;
};

// Get all migration files
const getMigrationFiles = () => {
  return fs.readdirSync(MIGRATIONS_DIR)
    .filter(file => file.endsWith('.js') && !file.startsWith('_'))
    .sort();
};

// Run migrations
const runMigrations = async (pb, targetVersion = null) => {
  const state = initMigrationState();
  const files = getMigrationFiles();
  
  // Filter migrations that haven't been run yet
  const pendingMigrations = files.filter(file => !state.migrations.includes(file));
  
  if (pendingMigrations.length === 0) {
    console.log('No pending migrations.');
    return;
  }
  
  console.log(`Found ${pendingMigrations.length} pending migrations.`);
  
  for (const file of pendingMigrations) {
    try {
      console.log(`Running migration: ${file}`);
      
      // Import the migration file
      const migration = await import(path.join(MIGRATIONS_DIR, file));
      
      // Run the migration
      await migration.up(pb);
      
      // Update migration state
      state.migrations.push(file);
      state.lastMigration = file;
      state.lastRun = new Date().toISOString();
      saveMigrationState(state);
      
      console.log(`Migration completed: ${file}`);
    } catch (error) {
      console.error(`Error running migration ${file}:`, error);
      throw error;
    }
  }
  
  console.log('All migrations completed successfully.');
};

// Rollback migrations
const rollbackMigrations = async (pb, steps = 1) => {
  const state = initMigrationState();
  
  if (state.migrations.length === 0) {
    console.log('No migrations to rollback.');
    return;
  }
  
  // Get the migrations to rollback
  const migrationsToRollback = state.migrations.slice(-steps);
  
  console.log(`Rolling back ${migrationsToRollback.length} migrations.`);
  
  for (const file of migrationsToRollback.reverse()) {
    try {
      console.log(`Rolling back migration: ${file}`);
      
      // Import the migration file
      const migration = await import(path.join(MIGRATIONS_DIR, file));
      
      // Run the rollback
      await migration.down(pb);
      
      // Update migration state
      state.migrations.pop();
      state.lastMigration = state.migrations.length > 0 ? state.migrations[state.migrations.length - 1] : null;
      state.lastRun = new Date().toISOString();
      saveMigrationState(state);
      
      console.log(`Rollback completed: ${file}`);
    } catch (error) {
      console.error(`Error rolling back migration ${file}:`, error);
      throw error;
    }
  }
  
  console.log('Rollback completed successfully.');
};

// Main function
const main = async () => {
  console.log('PocketBase Migration Manager');
  console.log('===========================');
  
  rl.question('What would you like to do? (create/run/rollback/status): ', async (action) => {
    try {
      switch (action.toLowerCase()) {
        case 'create':
          rl.question('Enter migration name: ', (name) => {
            createMigration(name);
            rl.close();
          });
          break;
          
        case 'run':
          rl.question('Enter admin email: ', (email) => {
            rl.question('Enter admin password: ', async (password) => {
              try {
                // Initialize PocketBase
                const pb = new PocketBase(POCKETBASE_URL);
                
                // Authenticate as admin
                console.log('Authenticating...');
                const authData = await pb.admins.authWithPassword(email, password);
                console.log('Authentication successful!');
                
                // Run migrations
                await runMigrations(pb);
                rl.close();
              } catch (error) {
                console.error('Error:', error);
                rl.close();
              }
            });
          });
          break;
          
        case 'rollback':
          rl.question('Enter number of migrations to rollback: ', (steps) => {
            rl.question('Enter admin email: ', (email) => {
              rl.question('Enter admin password: ', async (password) => {
                try {
                  // Initialize PocketBase
                  const pb = new PocketBase(POCKETBASE_URL);
                  
                  // Authenticate as admin
                  console.log('Authenticating...');
                  const authData = await pb.admins.authWithPassword(email, password);
                  console.log('Authentication successful!');
                  
                  // Rollback migrations
                  await rollbackMigrations(pb, parseInt(steps) || 1);
                  rl.close();
                } catch (error) {
                  console.error('Error:', error);
                  rl.close();
                }
              });
            });
          });
          break;
          
        case 'status':
          const state = initMigrationState();
          console.log('Migration Status:');
          console.log(`- Version: ${state.version}`);
          console.log(`- Last Migration: ${state.lastMigration || 'None'}`);
          console.log(`- Last Run: ${state.lastRun || 'Never'}`);
          console.log(`- Applied Migrations: ${state.migrations.length}`);
          
          if (state.migrations.length > 0) {
            console.log('\nApplied Migrations:');
            state.migrations.forEach((migration, index) => {
              console.log(`${index + 1}. ${migration}`);
            });
          }
          
          const pendingMigrations = getMigrationFiles().filter(file => !state.migrations.includes(file));
          
          if (pendingMigrations.length > 0) {
            console.log('\nPending Migrations:');
            pendingMigrations.forEach((migration, index) => {
              console.log(`${index + 1}. ${migration}`);
            });
          }
          
          rl.close();
          break;
          
        default:
          console.log('Invalid action. Please choose create, run, rollback, or status.');
          rl.close();
      }
    } catch (error) {
      console.error('Error:', error);
      rl.close();
    }
  });
};

// Run the script
main();
