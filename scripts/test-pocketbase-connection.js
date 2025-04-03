// Test script to verify connection to PocketBase
import PocketBase from 'pocketbase';

// Use the production URL
const pocketbaseUrl = "https://backend.fata.plus";
const pb = new PocketBase(pocketbaseUrl);

async function testConnection() {
  try {
    console.log(`Testing connection to PocketBase at ${pocketbaseUrl}...`);

    // Try to get the health status
    const health = await pb.health.check();
    console.log("Connection successful!");
    console.log("Health status:", health);

    // Try to get collections (this will work even without authentication)
    const collections = await pb.collections.getFullList();
    console.log(`Found ${collections.length} collections:`);
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });

    console.log("\nPocketBase connection test completed successfully!");
  } catch (error) {
    console.error("Error connecting to PocketBase:", error);
  }
}

testConnection();
