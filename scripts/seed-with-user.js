/**
 * PocketBase Seed Script Using Regular User Authentication
 * 
 * This script adds initial data to the PocketBase collections using a regular user account.
 * Run this script with Node.js after setting up the collections and a user account.
 * 
 * Usage:
 * node seed-with-user.js
 */

import fetch from 'node-fetch';

// Configuration
const POCKETBASE_URL = 'https://backend.fata.plus';
const USER_EMAIL = 'your-user@example.com'; // Replace with your user email
const USER_PASSWORD = 'your-password'; // Replace with your user password

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

// Function to authenticate with PocketBase as a regular user
async function authenticateUser() {
  try {
    console.log('Authenticating as user...');
    
    const response = await fetch(`${POCKETBASE_URL}/api/collections/users/auth-with-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identity: USER_EMAIL,
        password: USER_PASSWORD,
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
        const errorText = await response.text();
        console.warn(`Warning: Failed to seed item in ${collectionName}: ${errorText}`);
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
    const token = await authenticateUser();
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
