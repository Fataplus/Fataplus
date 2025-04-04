/**
 * PocketBase Schema Setup Script
 * 
 * This script creates all the necessary collections for the FataPlus application.
 * Run this script with Node.js to set up your PocketBase instance.
 * 
 * Usage:
 * node pocketbase-schema.js
 */

const fetch = require('node-fetch');

// Configuration
const POCKETBASE_URL = 'https://backend.fata.plus';
const ADMIN_EMAIL = 'fenohery@fata.plus';
const ADMIN_PASSWORD = '2025Fefe!';

// Collections to create
const collections = [
  // Users collection (extends the built-in users collection)
  {
    name: 'users',
    type: 'auth',
    schema: [
      {
        name: 'name',
        type: 'text',
        required: true,
      },
      {
        name: 'avatar',
        type: 'file',
        required: false,
      },
      {
        name: 'location',
        type: 'text',
        required: false,
      },
      {
        name: 'bio',
        type: 'text',
        required: false,
      },
      {
        name: 'role',
        type: 'select',
        required: true,
        options: {
          values: ['admin', 'farmer', 'buyer', 'seller']
        }
      },
      {
        name: 'isGuest',
        type: 'bool',
        required: false,
      }
    ]
  },
  
  // Products collection
  {
    name: 'products',
    schema: [
      {
        name: 'name',
        type: 'text',
        required: true,
      },
      {
        name: 'description',
        type: 'text',
        required: true,
      },
      {
        name: 'price',
        type: 'number',
        required: true,
      },
      {
        name: 'images',
        type: 'file',
        required: false,
        options: {
          maxSelect: 5,
          maxSize: 5242880, // 5MB
          mimeTypes: ['image/jpg', 'image/jpeg', 'image/png', 'image/webp']
        }
      },
      {
        name: 'category',
        type: 'text',
        required: true,
      },
      {
        name: 'seller',
        type: 'relation',
        required: true,
        options: {
          collectionId: '_pb_users_auth_',
          cascadeDelete: false,
        }
      },
      {
        name: 'location',
        type: 'text',
        required: false,
      },
      {
        name: 'stock',
        type: 'number',
        required: true,
      },
      {
        name: 'isActive',
        type: 'bool',
        required: true,
        options: {
          default: true
        }
      }
    ]
  },
  
  // Orders collection
  {
    name: 'orders',
    schema: [
      {
        name: 'user',
        type: 'relation',
        required: true,
        options: {
          collectionId: '_pb_users_auth_',
          cascadeDelete: false,
        }
      },
      {
        name: 'items',
        type: 'json',
        required: true,
      },
      {
        name: 'totalAmount',
        type: 'number',
        required: true,
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        options: {
          values: ['pending', 'processing', 'completed', 'cancelled', 'refunded']
        }
      },
      {
        name: 'paymentMethod',
        type: 'text',
        required: true,
      },
      {
        name: 'shippingAddress',
        type: 'json',
        required: true,
      }
    ]
  },
  
  // Posts collection (for community)
  {
    name: 'posts',
    schema: [
      {
        name: 'author',
        type: 'relation',
        required: true,
        options: {
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
        }
      },
      {
        name: 'content',
        type: 'text',
        required: true,
      },
      {
        name: 'imageUrl',
        type: 'file',
        required: false,
        options: {
          maxSelect: 1,
          maxSize: 5242880, // 5MB
          mimeTypes: ['image/jpg', 'image/jpeg', 'image/png', 'image/webp']
        }
      },
      {
        name: 'postType',
        type: 'select',
        required: true,
        options: {
          values: ['general', 'question', 'marketplace']
        }
      },
      {
        name: 'likes',
        type: 'number',
        required: false,
        options: {
          default: 0
        }
      },
      {
        name: 'comments',
        type: 'number',
        required: false,
        options: {
          default: 0
        }
      }
    ]
  },
  
  // Comments collection
  {
    name: 'comments',
    schema: [
      {
        name: 'post',
        type: 'relation',
        required: true,
        options: {
          collectionId: 'posts',
          cascadeDelete: true,
        }
      },
      {
        name: 'author',
        type: 'relation',
        required: true,
        options: {
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
        }
      },
      {
        name: 'content',
        type: 'text',
        required: true,
      }
    ]
  },
  
  // Likes collection
  {
    name: 'likes',
    schema: [
      {
        name: 'post',
        type: 'relation',
        required: true,
        options: {
          collectionId: 'posts',
          cascadeDelete: true,
        }
      },
      {
        name: 'user',
        type: 'relation',
        required: true,
        options: {
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
        }
      }
    ]
  },
  
  // Notifications collection
  {
    name: 'notifications',
    schema: [
      {
        name: 'user',
        type: 'relation',
        required: true,
        options: {
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
        }
      },
      {
        name: 'type',
        type: 'select',
        required: true,
        options: {
          values: ['post_like', 'post_comment', 'order_update', 'new_post', 'system']
        }
      },
      {
        name: 'message',
        type: 'text',
        required: true,
      },
      {
        name: 'relatedId',
        type: 'text',
        required: false,
      },
      {
        name: 'isRead',
        type: 'bool',
        required: true,
        options: {
          default: false
        }
      }
    ]
  },
  
  // Categories collection
  {
    name: 'categories',
    schema: [
      {
        name: 'name',
        type: 'text',
        required: true,
      },
      {
        name: 'description',
        type: 'text',
        required: false,
      },
      {
        name: 'icon',
        type: 'text',
        required: false,
      }
    ]
  },
  
  // Settings collection
  {
    name: 'settings',
    schema: [
      {
        name: 'key',
        type: 'text',
        required: true,
      },
      {
        name: 'value',
        type: 'json',
        required: true,
      },
      {
        name: 'description',
        type: 'text',
        required: false,
      }
    ]
  }
];

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

// Function to create a collection
async function createCollection(token, collection) {
  try {
    // Check if collection already exists
    const checkResponse = await fetch(`${POCKETBASE_URL}/api/collections/${collection.name}`, {
      headers: {
        'Authorization': token,
      },
    });

    // If collection exists, skip creation
    if (checkResponse.ok) {
      console.log(`Collection ${collection.name} already exists. Skipping.`);
      return;
    }

    // Create collection
    const response = await fetch(`${POCKETBASE_URL}/api/collections`, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: collection.name,
        type: collection.type || 'base',
        schema: collection.schema,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to create collection ${collection.name}: ${JSON.stringify(errorData)}`);
    }

    console.log(`Collection ${collection.name} created successfully.`);
  } catch (error) {
    console.error(`Error creating collection ${collection.name}:`, error);
    throw error;
  }
}

// Main function to set up all collections
async function setupCollections() {
  try {
    console.log('Starting PocketBase schema setup...');
    
    // Authenticate
    const token = await authenticate();
    console.log('Authentication successful.');
    
    // Create collections
    for (const collection of collections) {
      await createCollection(token, collection);
    }
    
    console.log('PocketBase schema setup completed successfully!');
  } catch (error) {
    console.error('Schema setup failed:', error);
  }
}

// Run the setup
setupCollections();
