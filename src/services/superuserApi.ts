import { pb } from "@/integrations/pocketbase/client";

export interface SuperuserAuthResponse {
  token: string;
  admin: {
    id: string;
    avatar: string;
    email: string;
  };
}

/**
 * Authenticate as a superuser (PocketBase admin)
 * @param email Admin email
 * @param password Admin password
 * @returns Authentication response with token and admin data
 */
export const superuserSignIn = async (
  email: string,
  password: string
): Promise<SuperuserAuthResponse> => {
  try {
    // For security and CORS reasons, we can't directly access the admin API from the client
    // Instead, we'll use PocketBase's regular authentication and check if the user has admin privileges
    const authData = await pb.collection('users').authWithPassword(email, password);

    // Check if the authenticated user has admin privileges
    if (authData.record?.userType !== 'admin') {
      throw new Error('You do not have superuser privileges');
    }

    // Create a superuser token (this is a client-side representation, not a real admin token)
    const superuserToken = btoa(JSON.stringify({
      id: authData.record.id,
      email: authData.record.email,
      userType: authData.record.userType,
      tokenExpiry: Date.now() + 3600000, // 1 hour expiry
    }));

    // Store the superuser token in localStorage
    localStorage.setItem("pocketbase_superuser_token", superuserToken);

    // Return a formatted response that matches the expected structure
    return {
      token: superuserToken,
      admin: {
        id: authData.record.id,
        avatar: authData.record.avatar || '',
        email: authData.record.email,
      }
    };
  } catch (error) {
    console.error("Superuser authentication error:", error);
    throw error;
  }
};

/**
 * Check if the current superuser token is valid
 * @returns True if the token is valid
 */
export const validateSuperuserToken = async (): Promise<boolean> => {
  const token = localStorage.getItem("pocketbase_superuser_token");

  if (!token) {
    return false;
  }

  try {
    // Decode the token to check if it's still valid
    const tokenData = JSON.parse(atob(token));

    // Check if token has expired
    if (tokenData.tokenExpiry < Date.now()) {
      localStorage.removeItem("pocketbase_superuser_token");
      return false;
    }

    // Check if the user is still authenticated with PocketBase
    if (!pb.authStore.isValid) {
      localStorage.removeItem("pocketbase_superuser_token");
      return false;
    }

    // Check if the authenticated user still has admin privileges
    const currentUser = pb.authStore.model;
    if (currentUser?.userType !== 'admin') {
      localStorage.removeItem("pocketbase_superuser_token");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error validating superuser token:", error);
    localStorage.removeItem("pocketbase_superuser_token");
    return false;
  }
};

/**
 * Sign out the superuser
 */
export const superuserSignOut = (): void => {
  localStorage.removeItem("pocketbase_superuser_token");
};

/**
 * Get the current superuser token
 * @returns The superuser token or null if not authenticated
 */
export const getSuperuserToken = (): string | null => {
  return localStorage.getItem("pocketbase_superuser_token");
};

/**
 * Make an authenticated superuser API request
 * This uses the regular PocketBase SDK but verifies the user has admin privileges
 * @param collection Collection name
 * @param method Method to call on the collection
 * @param args Arguments to pass to the method
 * @returns Response data
 */
export const superuserApiRequest = async (
  collection: string,
  method: string,
  ...args: any[]
): Promise<any> => {
  // Validate superuser token
  const isValid = await validateSuperuserToken();

  if (!isValid) {
    throw new Error("Not authenticated as superuser");
  }

  try {
    // Use the PocketBase SDK to make the request
    // @ts-ignore - Dynamic method call
    const result = await pb.collection(collection)[method](...args);
    return result;
  } catch (error) {
    console.error(`Error in superuser API request to ${collection}.${method}:`, error);
    throw error;
  }
};
