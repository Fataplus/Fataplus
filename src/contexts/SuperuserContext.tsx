import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  superuserSignIn, 
  superuserSignOut, 
  validateSuperuserToken,
  SuperuserAuthResponse
} from "@/services/superuserApi";

interface SuperuserContextType {
  superuser: SuperuserAuthResponse | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const SuperuserContext = createContext<SuperuserContextType | undefined>(undefined);

export const useSuperuser = () => {
  const context = useContext(SuperuserContext);
  if (context === undefined) {
    throw new Error("useSuperuser must be used within a SuperuserProvider");
  }
  return context;
};

interface SuperuserProviderProps {
  children: ReactNode;
}

export const SuperuserProvider: React.FC<SuperuserProviderProps> = ({ children }) => {
  const [superuser, setSuperuser] = useState<SuperuserAuthResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSuperuserAuth = async () => {
      try {
        setIsLoading(true);
        const isValid = await validateSuperuserToken();
        
        if (!isValid) {
          setSuperuser(null);
        } else {
          // If token is valid, we should get the superuser data
          // For now, we'll just set a placeholder
          const token = localStorage.getItem("pocketbase_superuser_token") || "";
          setSuperuser({
            token,
            admin: {
              id: "authenticated",
              avatar: "",
              email: "admin@example.com", // This will be updated when we implement proper profile fetching
            },
          });
        }
      } catch (err) {
        console.error("Error checking superuser auth:", err);
        setSuperuser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSuperuserAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await superuserSignIn(email, password);
      setSuperuser(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in as superuser");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    superuserSignOut();
    setSuperuser(null);
  };

  const value = {
    superuser,
    isLoading,
    error,
    signIn,
    signOut,
  };

  return <SuperuserContext.Provider value={value}>{children}</SuperuserContext.Provider>;
};
