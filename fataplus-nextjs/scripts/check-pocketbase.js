import fetch from 'node-fetch';

const POCKETBASE_URL = 'https://backend.fata.plus';

async function checkPocketBase() {
  try {
    console.log(`Checking PocketBase at ${POCKETBASE_URL}...`);
    
    // Check health endpoint
    console.log('\nChecking health endpoint...');
    try {
      const healthResponse = await fetch(`${POCKETBASE_URL}/api/health`);
      const healthData = await healthResponse.json();
      console.log('Health endpoint response:', healthData);
    } catch (error) {
      console.error('Error checking health endpoint:', error.message);
    }
    
    // Try to access collections endpoint
    console.log('\nChecking collections endpoint...');
    try {
      const collectionsResponse = await fetch(`${POCKETBASE_URL}/api/collections`);
      const collectionsStatus = collectionsResponse.status;
      console.log('Collections endpoint status:', collectionsStatus);
      
      if (collectionsResponse.ok) {
        const collectionsData = await collectionsResponse.json();
        console.log('Collections:', collectionsData);
      } else {
        const errorData = await collectionsResponse.json();
        console.log('Collections endpoint error:', errorData);
      }
    } catch (error) {
      console.error('Error checking collections endpoint:', error.message);
    }
    
    // Try to access setup endpoint
    console.log('\nChecking if setup is needed...');
    try {
      const setupResponse = await fetch(`${POCKETBASE_URL}/api/settings/test`);
      const setupStatus = setupResponse.status;
      console.log('Setup test endpoint status:', setupStatus);
      
      if (setupResponse.ok) {
        const setupData = await setupResponse.json();
        console.log('Setup test response:', setupData);
      } else {
        const errorData = await setupResponse.json();
        console.log('Setup test error:', errorData);
      }
    } catch (error) {
      console.error('Error checking setup endpoint:', error.message);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkPocketBase();
