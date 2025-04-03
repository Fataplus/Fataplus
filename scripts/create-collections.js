// Script to automatically create collections in PocketBase
import PocketBase from 'pocketbase';
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
      { name: 'seller', type: 'relation', options: { collectionId: 'users' }, required: true },
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
      { name: 'user', type: 'relation', options: { collectionId: 'users' }, required: true },
      { name: 'course', type: 'relation', options: { collectionId: 'courses' }, required: true },
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
      { name: 'author', type: 'relation', options: { collectionId: 'users' }, required: true },
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
      { name: 'author', type: 'relation', options: { collectionId: 'users' }, required: true },
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
      { name: 'user', type: 'relation', options: { collectionId: 'users' }, required: true }
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
      { name: 'user', type: 'relation', options: { collectionId: 'users' }, required: true },
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

// Function to update users collection with custom fields
const updateUsersCollection = async (pb, authData) => {
  try {
    console.log('Updating users collection with custom fields...');
    
    // Get the users collection
    const usersCollection = await pb.collections.getOne('users');
    
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
    await pb.collections.update('users', {
      schema: updatedSchema
    });
    
    console.log('Users collection updated successfully!');
  } catch (error) {
    console.error('Error updating users collection:', error);
  }
};

// Main function to create collections
const createCollections = async () => {
  try {
    // Get admin credentials
    rl.question('Enter admin email: ', async (email) => {
      rl.question('Enter admin password: ', async (password) => {
        try {
          // Initialize PocketBase
          const pb = new PocketBase(POCKETBASE_URL);
          
          // Authenticate as admin
          console.log('Authenticating...');
          const authData = await pb.admins.authWithPassword(email, password);
          console.log('Authentication successful!');
          
          // Update users collection with custom fields
          await updateUsersCollection(pb, authData);
          
          // Create collections
          console.log('Creating collections...');
          
          for (const collectionConfig of COLLECTIONS_CONFIG) {
            try {
              // Check if collection already exists
              const existingCollections = await pb.collections.getFullList();
              const exists = existingCollections.some(c => c.name === collectionConfig.name);
              
              if (exists) {
                console.log(`Collection "${collectionConfig.name}" already exists. Skipping...`);
                continue;
              }
              
              // Create the collection
              console.log(`Creating collection "${collectionConfig.name}"...`);
              await pb.collections.create(collectionConfig);
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
                    const user = await pb.collection('users').create({
                      email: userEmail,
                      password: userPassword,
                      passwordConfirm: userPassword,
                      name: 'Admin User',
                      userType: 'admin',
                      plan: 'premium'
                    });
                    
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
          console.error('Authentication failed:', error);
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
