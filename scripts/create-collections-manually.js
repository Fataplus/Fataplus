// Create PocketBase collections manually one by one
import fetch from 'node-fetch';
import readline from 'readline';
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

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function createCollections() {
  try {
    // Authenticate as admin
    console.log('Authenticating as admin...');
    const authResponse = await fetch(`${POCKETBASE_URL}/api/admins/auth-with-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD
      })
    });

    if (!authResponse.ok) {
      throw new Error(`Authentication failed: ${authResponse.status} ${authResponse.statusText}`);
    }

    const authData = await authResponse.json();
    const token = authData.token;

    console.log('Authentication successful!');

    // Create products collection
    console.log('Creating products collection...');
    const productsCollection = {
      name: "products",
      type: "base",
      schema: [
        {
          name: "name",
          type: "text",
          required: true
        },
        {
          name: "price",
          type: "number",
          required: true,
          options: {
            min: 0
          }
        },
        {
          name: "description",
          type: "text",
          required: false
        },
        {
          name: "seller",
          type: "relation",
          required: true,
          options: {
            collectionId: "_pb_users_auth_",
            cascadeDelete: false,
            maxSelect: 1
          }
        },
        {
          name: "sellerName",
          type: "text",
          required: true
        },
        {
          name: "location",
          type: "text",
          required: true
        },
        {
          name: "imageUrl",
          type: "file",
          required: false,
          options: {
            maxSelect: 1,
            mimeTypes: [
              "image/jpeg",
              "image/png",
              "image/svg+xml",
              "image/gif",
              "image/webp"
            ]
          }
        },
        {
          name: "category",
          type: "text",
          required: true
        }
      ]
    };

    const productsResponse = await fetch(`${POCKETBASE_URL}/api/collections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(productsCollection)
    });

    if (!productsResponse.ok) {
      const errorText = await productsResponse.text();
      throw new Error(`Failed to create products collection: ${errorText}`);
    }

    console.log('Products collection created successfully!');

    // Create courses collection
    console.log('Creating courses collection...');
    const coursesCollection = {
      name: "courses",
      type: "base",
      schema: [
        {
          name: "title",
          type: "text",
          required: true
        },
        {
          name: "description",
          type: "text",
          required: true
        },
        {
          name: "lessons",
          type: "number",
          required: true,
          options: {
            min: 1
          }
        },
        {
          name: "imageUrl",
          type: "file",
          required: false,
          options: {
            maxSelect: 1,
            mimeTypes: [
              "image/jpeg",
              "image/png",
              "image/svg+xml",
              "image/gif",
              "image/webp"
            ]
          }
        },
        {
          name: "category",
          type: "text",
          required: true
        }
      ]
    };

    const coursesResponse = await fetch(`${POCKETBASE_URL}/api/collections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(coursesCollection)
    });

    if (!coursesResponse.ok) {
      const errorText = await coursesResponse.text();
      throw new Error(`Failed to create courses collection: ${errorText}`);
    }

    console.log('Courses collection created successfully!');

    // Get the IDs of the created collections
    const collectionsResponse = await fetch(`${POCKETBASE_URL}/api/collections`, {
      headers: {
        'Authorization': token
      }
    });

    const collections = await collectionsResponse.json();
    const productsId = collections.items.find(c => c.name === 'products').id;
    const coursesId = collections.items.find(c => c.name === 'courses').id;

    // Create userCourses collection
    console.log('Creating userCourses collection...');
    const userCoursesCollection = {
      name: "userCourses",
      type: "base",
      schema: [
        {
          name: "user",
          type: "relation",
          required: true,
          options: {
            collectionId: "_pb_users_auth_",
            cascadeDelete: true,
            maxSelect: 1
          }
        },
        {
          name: "course",
          type: "relation",
          required: true,
          options: {
            collectionId: coursesId,
            cascadeDelete: true,
            maxSelect: 1
          }
        },
        {
          name: "completedLessons",
          type: "number",
          required: true,
          options: {
            min: 0,
            default: 0
          }
        }
      ]
    };

    const userCoursesResponse = await fetch(`${POCKETBASE_URL}/api/collections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(userCoursesCollection)
    });

    if (!userCoursesResponse.ok) {
      const errorText = await userCoursesResponse.text();
      throw new Error(`Failed to create userCourses collection: ${errorText}`);
    }

    console.log('UserCourses collection created successfully!');

    // Create posts collection
    console.log('Creating posts collection...');
    const postsCollection = {
      name: "posts",
      type: "base",
      schema: [
        {
          name: "author",
          type: "relation",
          required: true,
          options: {
            collectionId: "_pb_users_auth_",
            cascadeDelete: true,
            maxSelect: 1
          }
        },
        {
          name: "content",
          type: "text",
          required: true
        },
        {
          name: "imageUrl",
          type: "file",
          required: false,
          options: {
            maxSelect: 1,
            mimeTypes: [
              "image/jpeg",
              "image/png",
              "image/svg+xml",
              "image/gif",
              "image/webp"
            ]
          }
        },
        {
          name: "postType",
          type: "select",
          required: true,
          options: {
            values: ["general", "question", "marketplace"],
            maxSelect: 1
          }
        }
      ]
    };

    const postsResponse = await fetch(`${POCKETBASE_URL}/api/collections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(postsCollection)
    });

    if (!postsResponse.ok) {
      const errorText = await postsResponse.text();
      throw new Error(`Failed to create posts collection: ${errorText}`);
    }

    console.log('Posts collection created successfully!');

    // Get the ID of the posts collection
    const updatedCollectionsResponse = await fetch(`${POCKETBASE_URL}/api/collections`, {
      headers: {
        'Authorization': token
      }
    });

    const updatedCollections = await updatedCollectionsResponse.json();
    const postsId = updatedCollections.items.find(c => c.name === 'posts').id;

    // Create comments collection
    console.log('Creating comments collection...');
    const commentsCollection = {
      name: "comments",
      type: "base",
      schema: [
        {
          name: "post",
          type: "relation",
          required: true,
          options: {
            collectionId: postsId,
            cascadeDelete: true,
            maxSelect: 1
          }
        },
        {
          name: "author",
          type: "relation",
          required: true,
          options: {
            collectionId: "_pb_users_auth_",
            cascadeDelete: true,
            maxSelect: 1
          }
        },
        {
          name: "content",
          type: "text",
          required: true
        }
      ]
    };

    const commentsResponse = await fetch(`${POCKETBASE_URL}/api/collections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(commentsCollection)
    });

    if (!commentsResponse.ok) {
      const errorText = await commentsResponse.text();
      throw new Error(`Failed to create comments collection: ${errorText}`);
    }

    console.log('Comments collection created successfully!');

    // Create likes collection
    console.log('Creating likes collection...');
    const likesCollection = {
      name: "likes",
      type: "base",
      schema: [
        {
          name: "post",
          type: "relation",
          required: true,
          options: {
            collectionId: postsId,
            cascadeDelete: true,
            maxSelect: 1
          }
        },
        {
          name: "user",
          type: "relation",
          required: true,
          options: {
            collectionId: "_pb_users_auth_",
            cascadeDelete: true,
            maxSelect: 1
          }
        }
      ]
    };

    const likesResponse = await fetch(`${POCKETBASE_URL}/api/collections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(likesCollection)
    });

    if (!likesResponse.ok) {
      const errorText = await likesResponse.text();
      throw new Error(`Failed to create likes collection: ${errorText}`);
    }

    console.log('Likes collection created successfully!');

    // Create cartItems collection
    console.log('Creating cartItems collection...');
    const cartItemsCollection = {
      name: "cartItems",
      type: "base",
      schema: [
        {
          name: "user",
          type: "relation",
          required: true,
          options: {
            collectionId: "_pb_users_auth_",
            cascadeDelete: true,
            maxSelect: 1
          }
        },
        {
          name: "product",
          type: "relation",
          required: true,
          options: {
            collectionId: productsId,
            cascadeDelete: true,
            maxSelect: 1
          }
        },
        {
          name: "quantity",
          type: "number",
          required: true,
          options: {
            min: 1,
            default: 1
          }
        }
      ]
    };

    const cartItemsResponse = await fetch(`${POCKETBASE_URL}/api/collections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(cartItemsCollection)
    });

    if (!cartItemsResponse.ok) {
      const errorText = await cartItemsResponse.text();
      throw new Error(`Failed to create cartItems collection: ${errorText}`);
    }

    console.log('CartItems collection created successfully!');

    console.log('All collections created successfully!');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    rl.close();
  }
}

// Run the function
createCollections();
