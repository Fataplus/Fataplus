/**
 * PocketBase API Key Usage Example
 *
 * This script demonstrates how to use an API key to interact with PocketBase.
 * Run this script with Node.js after creating an API key.
 *
 * Usage:
 * API_KEY=your-api-key node use-api-key.js
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configuration
const POCKETBASE_URL = process.env.POCKETBASE_URL || 'https://backend.fata.plus';
const API_KEY = process.env.API_KEY;

// Validate required environment variables
if (!API_KEY) {
  console.error('Error: Missing required environment variables.');
  console.error('Required variables: API_KEY');
  process.exit(1);
}

// Function to list collections using API key
async function listCollections() {
  try {
    console.log('Listing collections using API key...');

    const response = await fetch(`${POCKETBASE_URL}/api/collections`, {
      method: 'GET',
      headers: {
        'Authorization': `Admin ${API_KEY}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response:', errorText);
      throw new Error(`Failed to list collections: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Collections:', data);
    return data;
  } catch (error) {
    console.error('Error listing collections:', error);
    throw error;
  }
}

// Function to create a record using API key
async function createRecord(collectionName, recordData) {
  try {
    console.log(`Creating record in ${collectionName} collection...`);

    const response = await fetch(`${POCKETBASE_URL}/api/collections/${collectionName}/records`, {
      method: 'POST',
      headers: {
        'Authorization': `Admin ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(recordData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response:', errorText);
      throw new Error(`Failed to create record: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Record created:', data);
    return data;
  } catch (error) {
    console.error('Error creating record:', error);
    throw error;
  }
}

// Main function
async function main() {
  try {
    console.log('Starting API key usage example...');

    // List collections
    await listCollections();

    // Create a sample record (uncomment and modify as needed)
    /*
    const sampleCategory = {
      name: 'Sample Category',
      description: 'A sample category created using API key',
      icon: 'sample'
    };
    await createRecord('categories', sampleCategory);
    */

    console.log('API key usage example completed successfully!');
  } catch (error) {
    console.error('API key usage example failed:', error);
  }
}

// Run the script
main();
