// Check if collections exist in PocketBase
import fetch from 'node-fetch';

// Configuration
const POCKETBASE_URL = 'https://backend.fata.plus';

async function checkCollections() {
  try {
    console.log(`Checking collections at ${POCKETBASE_URL}...`);
    
    // Get collections (public endpoint, no auth required)
    const response = await fetch(`${POCKETBASE_URL}/api/collections`);
    
    if (!response.ok) {
      throw new Error(`Failed to get collections: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.items || !Array.isArray(data.items)) {
      throw new Error('Invalid response format');
    }
    
    console.log(`Found ${data.items.length} collections:`);
    
    // List all collections
    data.items.forEach(collection => {
      console.log(`- ${collection.name} (${collection.type})`);
    });
    
    // Check for required collections
    const requiredCollections = [
      'users',
      'products',
      'courses',
      'userCourses',
      'posts',
      'comments',
      'likes',
      'cartItems'
    ];
    
    const missingCollections = requiredCollections.filter(
      name => !data.items.some(c => c.name === name)
    );
    
    if (missingCollections.length > 0) {
      console.log('\nMissing collections:');
      missingCollections.forEach(name => {
        console.log(`- ${name}`);
      });
    } else {
      console.log('\nAll required collections exist!');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the check
checkCollections();
