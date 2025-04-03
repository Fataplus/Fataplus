import PocketBase from 'pocketbase';

// Use environment variables for PocketBase URL
const pocketbaseUrl = import.meta.env.VITE_POCKETBASE_URL || "http://127.0.0.1:8090";

// Create and export the PocketBase client
export const pb = new PocketBase(pocketbaseUrl);

// Helper to get the current authenticated user
export const getCurrentUser = () => {
  return pb.authStore.model;
};

// Helper to check if user is authenticated
export const isAuthenticated = () => {
  return pb.authStore.isValid;
};

// Helper to get the auth token
export const getToken = () => {
  return pb.authStore.token;
};

// Helper to clear authentication
export const clearAuth = () => {
  pb.authStore.clear();
};
