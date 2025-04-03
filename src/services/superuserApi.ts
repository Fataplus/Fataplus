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
    const response = await fetch(`${pb.baseUrl}/api/admins/auth-with-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to authenticate as superuser");
    }

    const data = await response.json();
    
    // Store the admin token in localStorage
    localStorage.setItem("pocketbase_superuser_token", data.token);
    
    return data;
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
    const response = await fetch(`${pb.baseUrl}/api/admins/auth-refresh`, {
      method: "POST",
      headers: {
        "Authorization": token,
      },
    });
    
    if (!response.ok) {
      localStorage.removeItem("pocketbase_superuser_token");
      return false;
    }
    
    const data = await response.json();
    localStorage.setItem("pocketbase_superuser_token", data.token);
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
 * @param endpoint API endpoint (without base URL)
 * @param method HTTP method
 * @param data Request data
 * @returns Response data
 */
export const superuserApiRequest = async (
  endpoint: string,
  method: string = "GET",
  data?: any
): Promise<any> => {
  const token = getSuperuserToken();
  
  if (!token) {
    throw new Error("Not authenticated as superuser");
  }
  
  try {
    const response = await fetch(`${pb.baseUrl}/api/${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "API request failed");
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error in superuser API request to ${endpoint}:`, error);
    throw error;
  }
};
