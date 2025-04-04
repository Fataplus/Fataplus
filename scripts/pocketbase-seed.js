/**
 * PocketBase Seed Script
 * 
 * This script adds initial data to the PocketBase collections.
 * Run this script with Node.js after setting up the schema.
 * 
 * Usage:
 * node pocketbase-seed.js
 */

const fetch = require('node-fetch');

// Configuration
const POCKETBASE_URL = 'https://backend.fata.plus';
const ADMIN_EMAIL = 'fenohery@fata.plus';
const ADMIN_PASSWORD = '2025Fefe!';

// Initial data to seed
const seedData = {
  // Categories
  categories: [
    {
      name: 'Vegetables',
      description: 'Fresh vegetables from local farmers',
      icon: 'leaf'
    },
    {
      name: 'Fruits',
      description: 'Seasonal fruits from Madagascar',
      icon: 'apple'
    },
    {
      name: 'Grains',
      description: 'Rice, wheat, and other grains',
      icon: 'grain'
    },
    {
      name: 'Dairy',
      description: 'Milk, cheese, and other dairy products',
      icon: 'milk'
    },
    {
      name: 'Meat',
      description: 'Fresh meat from local farmers',
      icon: 'meat'
    },
    {
      name: 'Seeds',
      description: 'Seeds for planting',
      icon: 'seed'
    },
    {
      name: 'Tools',
      description: 'Farming tools and equipment',
      icon: 'tool'
    }
  ],
  
  // Settings
  settings: [
    {
      key: 'app_name',
      value: JSON.stringify('FataPlus'),
      description: 'Application name'
    },
    {
      key: 'currency',
      value: JSON.stringify('MGA'),
      description: 'Default currency'
    },
    {
      key: 'default_language',
      value: JSON.stringify('en'),
      description: 'Default language'
    },
    {
      key: 'maintenance_mode',
      value: JSON.stringify(false),
      description: 'Maintenance mode'
    }
  ]
};

// Function to authenticate with PocketBase
async function authenticate() {
  try {
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
      throw new Error(`Authentication failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}

// Function to seed a collection
async function seedCollection(token, collectionName, items) {
  try {
    console.log(`Seeding ${collectionName} collection...`);
    
    for (const item of items) {
      const response = await fetch(`${POCKETBASE_URL}/api/collections/${collectionName}/records`, {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.warn(`Warning: Failed to seed item in ${collectionName}: ${JSON.stringify(errorData)}`);
        // Continue with other items even if one fails
        continue;
      }
    }
    
    console.log(`${collectionName} collection seeded successfully.`);
  } catch (error) {
    console.error(`Error seeding ${collectionName} collection:`, error);
    // Continue with other collections even if one fails
  }
}

// Main function to seed all collections
async function seedAllCollections() {
  try {
    console.log('Starting PocketBase data seeding...');
    
    // Authenticate
    const token = await authenticate();
    console.log('Authentication successful.');
    
    // Seed collections
    for (const [collectionName, items] of Object.entries(seedData)) {
      await seedCollection(token, collectionName, items);
    }
    
    console.log('PocketBase data seeding completed successfully!');
  } catch (error) {
    console.error('Data seeding failed:', error);
  }
}

// Run the seeding
seedAllCollections();
