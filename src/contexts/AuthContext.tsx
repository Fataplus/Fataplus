import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { pb, getCurrentUser } from '@/integrations/pocketbase/client';
import { getUserProfile } from '@/services/api';
import type { User } from '@/integrations/pocketbase/types';

interface AuthContextType {
  user: any | null;
  profile: User | null;
  isLoading: boolean;
  error: Error | null;
  updateUserProfile: (updatedUser: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Initial session check
    const checkUser = async () => {
      try {
        setIsLoading(true);
        const currentUser = getCurrentUser();

        if (currentUser) {
          setUser(currentUser);

          // Fetch user profile
          try {
            const userProfile = await getUserProfile(currentUser.id);
            setProfile(userProfile);
          } catch (profileErr) {
            console.error('Error fetching user profile:', profileErr);
          }
        }
      } catch (err) {
        console.error('Error checking auth status:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    // Set up auth state listener
    pb.authStore.onChange((token, model) => {
      if (model) {
        setUser(model);

        // Fetch user profile
        getUserProfile(model.id)
          .then(userProfile => {
            setProfile(userProfile);
          })
          .catch(err => {
            console.error('Error fetching user profile:', err);
          });
      } else {
        setUser(null);
        setProfile(null);
      }

      setIsLoading(false);
    });

    // No cleanup needed for PocketBase auth change listener
  }, []);

  // Function to update user profile
  const updateUserProfile = (updatedUser: any) => {
    setUser(updatedUser);

    // Also update profile if it exists
    if (profile && updatedUser) {
      setProfile({
        ...profile,
        ...updatedUser
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, error, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
