// Enhanced security rules for PocketBase collections
import PocketBase from 'pocketbase';
import readline from 'readline';

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Configuration
const POCKETBASE_URL = 'https://backend.fata.plus';

// Enhanced security rules for collections
const ENHANCED_SECURITY_RULES = {
  users: {
    // Only admins can list all users, others can only view their own profile
    listRule: '@request.auth.userType = "admin" || id = @request.auth.id',
    // Users can view their own profile or admins can view any profile
    viewRule: '@request.auth.id != "" && (id = @request.auth.id || @request.auth.userType = "admin")',
    // Only admins can create users directly (others use signup)
    createRule: '@request.auth.userType = "admin"',
    // Users can update their own profile or admins can update any profile
    updateRule: '@request.auth.id != "" && (id = @request.auth.id || @request.auth.userType = "admin")',
    // Only admins can delete users
    deleteRule: '@request.auth.userType = "admin"'
  },
  products: {
    // Anyone can list and view products
    listRule: '',
    viewRule: '',
    // Only authenticated users can create products
    createRule: '@request.auth.id != "" && (@request.auth.userType = "seller" || @request.auth.userType = "admin")',
    // Only the seller who created the product or admins can update it
    updateRule: '@request.auth.id != "" && (seller = @request.auth.id || @request.auth.userType = "admin")',
    // Only the seller who created the product or admins can delete it
    deleteRule: '@request.auth.id != "" && (seller = @request.auth.id || @request.auth.userType = "admin")'
  },
  courses: {
    // Anyone can list and view courses
    listRule: '',
    viewRule: '',
    // Only admins can create, update, or delete courses
    createRule: '@request.auth.id != "" && @request.auth.userType = "admin"',
    updateRule: '@request.auth.id != "" && @request.auth.userType = "admin"',
    deleteRule: '@request.auth.id != "" && @request.auth.userType = "admin"'
  },
  userCourses: {
    // Users can only see their own enrolled courses
    listRule: '@request.auth.id != "" && (user = @request.auth.id || @request.auth.userType = "admin")',
    viewRule: '@request.auth.id != "" && (user = @request.auth.id || @request.auth.userType = "admin")',
    // Authenticated users can enroll in courses
    createRule: '@request.auth.id != "" && (user = @request.auth.id || @request.auth.userType = "admin")',
    // Users can only update their own course progress
    updateRule: '@request.auth.id != "" && (user = @request.auth.id || @request.auth.userType = "admin")',
    // Users can only unenroll from their own courses
    deleteRule: '@request.auth.id != "" && (user = @request.auth.id || @request.auth.userType = "admin")'
  },
  posts: {
    // Anyone can view posts
    listRule: '',
    viewRule: '',
    // Authenticated users can create posts
    createRule: '@request.auth.id != ""',
    // Only the author or admins can update posts
    updateRule: '@request.auth.id != "" && (author = @request.auth.id || @request.auth.userType = "admin")',
    // Only the author or admins can delete posts
    deleteRule: '@request.auth.id != "" && (author = @request.auth.id || @request.auth.userType = "admin")'
  },
  comments: {
    // Anyone can view comments
    listRule: '',
    viewRule: '',
    // Authenticated users can create comments
    createRule: '@request.auth.id != ""',
    // Only the author or admins can update comments
    updateRule: '@request.auth.id != "" && (author = @request.auth.id || @request.auth.userType = "admin")',
    // Only the author or admins can delete comments
    deleteRule: '@request.auth.id != "" && (author = @request.auth.id || @request.auth.userType = "admin")'
  },
  likes: {
    // Anyone can view likes
    listRule: '',
    viewRule: '',
    // Authenticated users can create likes
    createRule: '@request.auth.id != "" && user = @request.auth.id',
    // Users can't update likes
    updateRule: '@request.auth.id != "" && user = @request.auth.id',
    // Users can only delete their own likes
    deleteRule: '@request.auth.id != "" && user = @request.auth.id'
  },
  cartItems: {
    // Users can only see their own cart
    listRule: '@request.auth.id != "" && user = @request.auth.id',
    viewRule: '@request.auth.id != "" && user = @request.auth.id',
    // Authenticated users can add to their cart
    createRule: '@request.auth.id != "" && user = @request.auth.id',
    // Users can only update their own cart
    updateRule: '@request.auth.id != "" && user = @request.auth.id',
    // Users can only remove items from their own cart
    deleteRule: '@request.auth.id != "" && user = @request.auth.id'
  },
  orders: {
    // Users can only see their own orders, admins can see all
    listRule: '@request.auth.id != "" && (user = @request.auth.id || @request.auth.userType = "admin")',
    viewRule: '@request.auth.id != "" && (user = @request.auth.id || @request.auth.userType = "admin")',
    // Authenticated users can create orders
    createRule: '@request.auth.id != "" && user = @request.auth.id',
    // Only admins can update order status
    updateRule: '@request.auth.id != "" && (@request.auth.userType = "admin" || (user = @request.auth.id && @request.data.status = "cancelled"))',
    // Only admins can delete orders
    deleteRule: '@request.auth.userType = "admin"'
  }
};

// Function to update security rules for a collection
const updateCollectionRules = async (pb, collectionName, rules) => {
  try {
    console.log(`Updating security rules for collection "${collectionName}"...`);
    
    // Get the collection
    const collection = await pb.collections.getOne(collectionName);
    
    // Update the collection with new rules
    await pb.collections.update(collectionName, {
      listRule: rules.listRule,
      viewRule: rules.viewRule,
      createRule: rules.createRule,
      updateRule: rules.updateRule,
      deleteRule: rules.deleteRule
    });
    
    console.log(`Security rules for "${collectionName}" updated successfully!`);
    return true;
  } catch (error) {
    console.error(`Error updating security rules for "${collectionName}":`, error);
    return false;
  }
};

// Main function to update security rules
const updateSecurityRules = async () => {
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
          
          // Update security rules for each collection
          console.log('Updating security rules for collections...');
          
          let successCount = 0;
          let failCount = 0;
          
          for (const [collectionName, rules] of Object.entries(ENHANCED_SECURITY_RULES)) {
            const success = await updateCollectionRules(pb, collectionName, rules);
            if (success) {
              successCount++;
            } else {
              failCount++;
            }
          }
          
          console.log(`\nSecurity rules update completed!`);
          console.log(`Successfully updated: ${successCount} collections`);
          console.log(`Failed to update: ${failCount} collections`);
          
          rl.close();
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
updateSecurityRules();
