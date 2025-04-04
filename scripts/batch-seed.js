/**
 * PocketBase Batch Seed Script
 * 
 * This script uses the Batch API to seed multiple records at once.
 * Run this script with Node.js after setting up the collections and a user account.
 * 
 * Usage:
 * node batch-seed.js
 */

import fetch from 'node-fetch';

// Configuration
const POCKETBASE_URL = 'https://backend.fata.plus';
const USER_EMAIL = 'your-user@example.com'; // Replace with your user email
const USER_PASSWORD = 'your-password'; // Replace with your user password

// Initial data to seed
const batchRequests = [
  // Categories
  {
    method: 'POST',
    path: '/api/collections/categories/records',
    body: {
      name: 'Vegetables',
      description: 'Fresh vegetables from local farmers',
      icon: 'leaf'
    }
  },
  {
    method: 'POST',
    path: '/api/collections/categories/records',
    body: {
      name: 'Fruits',
      description: 'Seasonal fruits from Madagascar',
      icon: 'apple'
    }
  },
  {
    method: 'POST',
    path: '/api/collections/categories/records',
    body: {
      name: 'Grains',
      description: 'Rice, wheat, and other grains',
      icon: 'grain'
    }
  },
  {
    method: 'POST',
    path: '/api/collections/categories/records',
    body: {
      name: 'Dairy',
      description: 'Milk, cheese, and other dairy products',
      icon: 'milk'
    }
  },
  {
    method: 'POST',
    path: '/api/collections/categories/records',
    body: {
      name: 'Meat',
      description: 'Fresh meat from local farmers',
      icon: 'meat'
    }
  },
  {
    method: 'POST',
    path: '/api/collections/categories/records',
    body: {
      name: 'Seeds',
      description: 'Seeds for planting',
      icon: 'seed'
    }
  },
  {
    method: 'POST',
    path: '/api/collections/categories/records',
    body: {
      name: 'Tools',
      description: 'Farming tools and equipment',
      icon: 'tool'
    }
  },
  
  // Settings
  {
    method: 'POST',
    path: '/api/collections/settings/records',
    body: {
      key: 'app_name',
      value: JSON.stringify('FataPlus'),
      description: 'Application name'
    }
  },
  {
    method: 'POST',
    path: '/api/collections/settings/records',
    body: {
      key: 'currency',
      value: JSON.stringify('MGA'),
      description: 'Default currency'
    }
  },
  {
    method: 'POST',
    path: '/api/collections/settings/records',
    body: {
      key: 'default_language',
      value: JSON.stringify('en'),
      description: 'Default language'
    }
  },
  {
    method: 'POST',
    path: '/api/collections/settings/records',
    body: {
      key: 'maintenance_mode',
      value: JSON.stringify(false),
      description: 'Maintenance mode'
    }
  }
];

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

// Function to execute batch requests
async function executeBatchRequests(token) {
  try {
    console.log('Executing batch requests...');
    
    const response = await fetch(`${POCKETBASE_URL}/api/batch`, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requests: batchRequests }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response:', errorText);
      throw new Error(`Batch execution failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Batch execution completed successfully.');
    return data;
  } catch (error) {
    console.error('Error executing batch requests:', error);
    throw error;
  }
}

// Main function
async function main() {
  try {
    console.log('Starting batch seeding process...');
    
    // Authenticate
    const token = await authenticateUser();
    console.log('Authentication successful.');
    
    // Execute batch requests
    await executeBatchRequests(token);
    
    console.log('Batch seeding completed successfully!');
  } catch (error) {
    console.error('Batch seeding failed:', error);
  }
}

// Run the script
main();
