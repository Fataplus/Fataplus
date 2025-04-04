// Migration: Add User Preferences
// Created: 2023-01-01T00:00:00.000Z

/**
 * Apply the migration
 * @param {PocketBase} pb - PocketBase instance
 * @returns {Promise<void>}
 */
export async function up(pb) {
  console.log('Applying migration: Add User Preferences');
  
  try {
    // Get the users collection
    const usersCollection = await pb.collections.getOne('users');
    
    // Check if preferences field already exists
    const hasPreferences = usersCollection.schema.some(field => field.name === 'preferences');
    
    if (!hasPreferences) {
      // Add preferences field to users collection
      usersCollection.schema.push({
        name: 'preferences',
        type: 'json',
        required: false
      });
      
      // Update the collection
      await pb.collections.update(usersCollection.id, usersCollection);
      console.log('Added preferences field to users collection');
      
      // Initialize preferences for existing users
      const users = await pb.collection('users').getFullList();
      console.log(`Initializing preferences for ${users.length} users...`);
      
      for (const user of users) {
        // Set default preferences
        const defaultPreferences = {
          notifications: true,
          darkMode: false,
          language: 'en',
          emailFrequency: 'daily'
        };
        
        // Update user
        await pb.collection('users').update(user.id, {
          preferences: JSON.stringify(defaultPreferences)
        });
      }
      
      console.log('Initialized preferences for all users');
    } else {
      console.log('Preferences field already exists, skipping');
    }
  } catch (error) {
    console.error('Error applying migration:', error);
    throw error;
  }
}

/**
 * Rollback the migration
 * @param {PocketBase} pb - PocketBase instance
 * @returns {Promise<void>}
 */
export async function down(pb) {
  console.log('Rolling back migration: Add User Preferences');
  
  try {
    // Get the users collection
    const usersCollection = await pb.collections.getOne('users');
    
    // Remove preferences field from schema
    usersCollection.schema = usersCollection.schema.filter(field => field.name !== 'preferences');
    
    // Update the collection
    await pb.collections.update(usersCollection.id, usersCollection);
    
    console.log('Removed preferences field from users collection');
  } catch (error) {
    console.error('Error rolling back migration:', error);
    throw error;
  }
}
