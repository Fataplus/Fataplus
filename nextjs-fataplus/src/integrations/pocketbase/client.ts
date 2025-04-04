import PocketBase from 'pocketbase';

// Create a singleton PocketBase client
let pb: PocketBase | null = null;

// Initialize PocketBase client
export const initPocketBase = () => {
  // Use environment variables for PocketBase URL
  const pocketbaseUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090";
  
  // Create a new PocketBase instance if it doesn't exist
  if (!pb) {
    pb = new PocketBase(pocketbaseUrl);
  }
  
  return pb;
};

// Get the PocketBase client (initializing if necessary)
export const getPocketBase = () => {
  // Check if we're on the client side
  if (typeof window !== 'undefined') {
    return initPocketBase();
  }
  
  // For server-side, always create a new instance to avoid sharing state
  const pocketbaseUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090";
  return new PocketBase(pocketbaseUrl);
};

// Helper to get the current authenticated user (client-side only)
export const getCurrentUser = () => {
  if (typeof window === 'undefined') {
    return null; // Not available on server-side
  }
  
  const client = getPocketBase();
  return client.authStore.model;
};

// Helper to check if user is authenticated (client-side only)
export const isAuthenticated = () => {
  if (typeof window === 'undefined') {
    return false; // Not available on server-side
  }
  
  const client = getPocketBase();
  return client.authStore.isValid;
};

// Helper to get the auth token (client-side only)
export const getToken = () => {
  if (typeof window === 'undefined') {
    return null; // Not available on server-side
  }
  
  const client = getPocketBase();
  return client.authStore.token;
};

// Helper to clear authentication (client-side only)
export const clearAuth = () => {
  if (typeof window === 'undefined') {
    return; // Not available on server-side
  }
  
  const client = getPocketBase();
  client.authStore.clear();
};
