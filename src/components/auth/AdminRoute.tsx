import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, profile, isLoading } = useAuth();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isLoading) {
      // Check if the user is an admin
      const checkAdmin = async () => {
        if (!user) {
          setIsAdmin(false);
          return;
        }

        // Check if the user has admin privileges
        if (profile?.userType === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      };

      checkAdmin();
    }
  }, [user, profile, isLoading]);

  if (isLoading || isAdmin === null) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Checking authorization...</span>
      </div>
    );
  }

  if (!isAdmin) {
    // Redirect to login page if not authenticated or not an admin
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
