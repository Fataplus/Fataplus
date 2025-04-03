// Script to automatically create collections in PocketBase using the REST API
import fetch from 'node-fetch';
import readline from 'readline';
import fs from 'fs';

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Configuration
const POCKETBASE_URL = 'https://backend.fata.plus';
const COLLECTIONS_CONFIG = [
  {
    name: 'products',
    type: 'base',
    schema: [
      { name: 'name', type: 'text', required: true },
      { name: 'price', type: 'number', required: true, min: 0 },
      { name: 'description', type: 'text' },
      { name: 'seller', type: 'relation', options: { collectionId: 'users', cascadeDelete: false }, required: true },
      { name: 'sellerName', type: 'text', required: true },
      { name: 'location', type: 'text', required: true },
      { name: 'imageUrl', type: 'file', options: { maxSelect: 1, mimeTypes: ['image/jpeg', 'image/png', 'image/svg+xml', 'image/gif', 'image/webp'] } },
      { name: 'category', type: 'text', required: true }
    ],
    listRule: '',
    viewRule: '',
    createRule: '@request.auth.id != ""',
    updateRule: '@request.auth.id != "" && seller = @request.auth.id',
    deleteRule: '@request.auth.id != "" && seller = @request.auth.id'
  },
  {
    name: 'courses',
    type: 'base',
    schema: [
      { name: 'title', type: 'text', required: true },
      { name: 'description', type: 'text', required: true },
      { name: 'lessons', type: 'number', required: true, min: 1 },
      { name: 'imageUrl', type: 'file', options: { maxSelect: 1, mimeTypes: ['image/jpeg', 'image/png', 'image/svg+xml', 'image/gif', 'image/webp'] } },
      { name: 'category', type: 'text', required: true }
    ],
    listRule: '',
    viewRule: '',
    createRule: '@request.auth.id != "" && @request.auth.userType = "admin"',
    updateRule: '@request.auth.id != "" && @request.auth.userType = "admin"',
    deleteRule: '@request.auth.id != "" && @request.auth.userType = "admin"'
  },
  {
    name: 'userCourses',
    type: 'base',
    schema: [
      { name: 'user', type: 'relation', options: { collectionId: 'users', cascadeDelete: false }, required: true },
      { name: 'course', type: 'relation', options: { collectionId: 'courses', cascadeDelete: false }, required: true },
      { name: 'completedLessons', type: 'number', required: true, min: 0, default: 0 }
    ],
    listRule: '@request.auth.id != "" && user = @request.auth.id',
    viewRule: '@request.auth.id != "" && user = @request.auth.id',
    createRule: '@request.auth.id != ""',
    updateRule: '@request.auth.id != "" && user = @request.auth.id',
    deleteRule: '@request.auth.id != "" && user = @request.auth.id'
  },
  {
    name: 'posts',
    type: 'base',
    schema: [
      { name: 'author', type: 'relation', options: { collectionId: 'users', cascadeDelete: false }, required: true },
      { name: 'content', type: 'text', required: true },
      { name: 'imageUrl', type: 'file', options: { maxSelect: 1, mimeTypes: ['image/jpeg', 'image/png', 'image/svg+xml', 'image/gif', 'image/webp'] } },
      { name: 'postType', type: 'select', options: { values: ['general', 'question', 'marketplace'] }, required: true, default: 'general' }
    ],
    listRule: '',
    viewRule: '',
    createRule: '@request.auth.id != ""',
    updateRule: '@request.auth.id != "" && author = @request.auth.id',
    deleteRule: '@request.auth.id != "" && (author = @request.auth.id || @request.auth.userType = "admin")'
  },
  {
    name: 'comments',
    type: 'base',
    schema: [
      { name: 'post', type: 'relation', options: { collectionId: 'posts', cascadeDelete: true }, required: true },
      { name: 'author', type: 'relation', options: { collectionId: 'users', cascadeDelete: false }, required: true },
      { name: 'content', type: 'text', required: true }
    ],
    listRule: '',
    viewRule: '',
    createRule: '@request.auth.id != ""',
    updateRule: '@request.auth.id != "" && author = @request.auth.id',
    deleteRule: '@request.auth.id != "" && (author = @request.auth.id || @request.auth.userType = "admin")'
  },
  {
    name: 'likes',
    type: 'base',
    schema: [
      { name: 'post', type: 'relation', options: { collectionId: 'posts', cascadeDelete: true }, required: true },
      { name: 'user', type: 'relation', options: { collectionId: 'users', cascadeDelete: false }, required: true }
    ],
    listRule: '',
    viewRule: '',
    createRule: '@request.auth.id != ""',
    updateRule: '@request.auth.id != "" && user = @request.auth.id',
    deleteRule: '@request.auth.id != "" && user = @request.auth.id'
  },
  {
    name: 'cartItems',
    type: 'base',
    schema: [
      { name: 'user', type: 'relation', options: { collectionId: 'users', cascadeDelete: false }, required: true },
      { name: 'product', type: 'relation', options: { collectionId: 'products', cascadeDelete: true }, required: true },
      { name: 'quantity', type: 'number', required: true, min: 1, default: 1 }
    ],
    listRule: '@request.auth.id != "" && user = @request.auth.id',
    viewRule: '@request.auth.id != "" && user = @request.auth.id',
    createRule: '@request.auth.id != ""',
    updateRule: '@request.auth.id != "" && user = @request.auth.id',
    deleteRule: '@request.auth.id != "" && user = @request.auth.id'
  }
];

// Function to authenticate with PocketBase
const authenticate = async (email, password) => {
  try {
    const response = await fetch(`${POCKETBASE_URL}/api/admins/auth-with-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Authentication failed: ${errorData.message}`);
    }
    
    const authData = await response.json();
    return authData.token;
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
};

// Function to get all collections
const getCollections = async (token) => {
  try {
    const response = await fetch(`${POCKETBASE_URL}/api/collections`, {
      headers: {
        'Authorization': token
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to get collections: ${errorData.message}`);
    }
    
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error getting collections:', error);
    throw error;
  }
};

// Function to create a collection
const createCollection = async (token, collectionConfig) => {
  try {
    const response = await fetch(`${POCKETBASE_URL}/api/collections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(collectionConfig)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to create collection: ${errorData.message}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error creating collection "${collectionConfig.name}":`, error);
    throw error;
  }
};

// Function to update users collection with custom fields
const updateUsersCollection = async (token) => {
  try {
    console.log('Updating users collection with custom fields...');
    
    // Get the users collection
    const response = await fetch(`${POCKETBASE_URL}/api/collections/users`, {
      headers: {
        'Authorization': token
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to get users collection: ${errorData.message}`);
    }
    
    const usersCollection = await response.json();
    
    // Define the custom fields to add
    const customFields = [
      { name: 'name', type: 'text', required: true },
      { name: 'avatar', type: 'file', options: { maxSelect: 1, mimeTypes: ['image/jpeg', 'image/png', 'image/svg+xml', 'image/gif', 'image/webp'] } },
      { name: 'location', type: 'text' },
      { name: 'userType', type: 'select', options: { values: ['farmer', 'seller', 'learner', 'admin'] }, required: true, default: 'farmer' },
      { name: 'plan', type: 'select', options: { values: ['free', 'premium'] }, required: true, default: 'free' }
    ];
    
    // Add custom fields to the schema
    const updatedSchema = [...usersCollection.schema];
    
    // Check if fields already exist
    for (const field of customFields) {
      const existingField = updatedSchema.find(f => f.name === field.name);
      if (!existingField) {
        updatedSchema.push(field);
      }
    }
    
    // Update the collection
    const updateResponse = await fetch(`${POCKETBASE_URL}/api/collections/users`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({
        schema: updatedSchema
      })
    });
    
    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      throw new Error(`Failed to update users collection: ${errorData.message}`);
    }
    
    console.log('Users collection updated successfully!');
  } catch (error) {
    console.error('Error updating users collection:', error);
    throw error;
  }
};

// Function to create a user
const createUser = async (email, password, name, userType, plan) => {
  try {
    const response = await fetch(`${POCKETBASE_URL}/api/collections/users/records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
        passwordConfirm: password,
        name,
        userType,
        plan
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to create user: ${errorData.message}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Main function to create collections
const createCollections = async () => {
  try {
    // Get admin credentials
    rl.question('Enter admin email: ', async (email) => {
      rl.question('Enter admin password: ', async (password) => {
        try {
          // Authenticate as admin
          console.log('Authenticating...');
          const token = await authenticate(email, password);
          console.log('Authentication successful!');
          
          // Update users collection with custom fields
          await updateUsersCollection(token);
          
          // Get existing collections
          const existingCollections = await getCollections(token);
          
          // Create collections
          console.log('Creating collections...');
          
          for (const collectionConfig of COLLECTIONS_CONFIG) {
            try {
              // Check if collection already exists
              const exists = existingCollections.some(c => c.name === collectionConfig.name);
              
              if (exists) {
                console.log(`Collection "${collectionConfig.name}" already exists. Skipping...`);
                continue;
              }
              
              // Create the collection
              console.log(`Creating collection "${collectionConfig.name}"...`);
              await createCollection(token, collectionConfig);
              console.log(`Collection "${collectionConfig.name}" created successfully!`);
            } catch (error) {
              console.error(`Error creating collection "${collectionConfig.name}":`, error);
            }
          }
          
          console.log('All collections created successfully!');
          
          // Create a test admin user if needed
          rl.question('Do you want to create a test admin user? (y/n): ', async (answer) => {
            if (answer.toLowerCase() === 'y') {
              rl.question('Enter user email: ', async (userEmail) => {
                rl.question('Enter user password: ', async (userPassword) => {
                  try {
                    // Create the user
                    const user = await createUser(
                      userEmail,
                      userPassword,
                      'Admin User',
                      'admin',
                      'premium'
                    );
                    
                    console.log('Admin user created successfully!');
                    console.log('Email:', userEmail);
                    console.log('Name:', user.name);
                    console.log('User Type:', user.userType);
                    
                    rl.close();
                  } catch (error) {
                    console.error('Error creating admin user:', error);
                    rl.close();
                  }
                });
              });
            } else {
              rl.close();
            }
          });
        } catch (error) {
          console.error('Error:', error);
          rl.close();
        }
      });
    });
  } catch (error) {
    console.error('Error:', error);
    rl.close();
  }
};

// Run the script
createCollections();
