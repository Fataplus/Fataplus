import fetch from 'node-fetch';

const POCKETBASE_URL = 'https://backend.fata.plus';

async function setupAdmin() {
  try {
    console.log('Setting up admin account...');
    
    // Check if we can access the setup endpoint
    const setupCheckResponse = await fetch(`${POCKETBASE_URL}/api/admins/auth-with-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'password'
      })
    });
    
    if (setupCheckResponse.status === 400) {
      console.log('PocketBase is already set up with an admin account.');
      console.log('Please use the existing admin credentials to import the schema.');
      return;
    }
    
    // Create the first admin
    const setupResponse = await fetch(`${POCKETBASE_URL}/api/admins`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@fata.plus',
        password: 'Admin123!',
        passwordConfirm: 'Admin123!'
      })
    });
    
    if (!setupResponse.ok) {
      const errorData = await setupResponse.json();
      throw new Error(`Admin setup failed: ${JSON.stringify(errorData)}`);
    }
    
    console.log('Admin account created successfully!');
    console.log('Email: admin@fata.plus');
    console.log('Password: Admin123!');
    
    console.log('\nNow you can run the import-schema.js script with these credentials.');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

setupAdmin();
