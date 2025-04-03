import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSuperuser } from "@/contexts/SuperuserContext";
import { Loader2 } from "lucide-react";

interface SuperuserRouteProps {
  children: ReactNode;
}

const SuperuserRoute = ({ children }: SuperuserRouteProps) => {
  const { superuser, isLoading } = useSuperuser();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Checking superuser authorization...</span>
      </div>
    );
  }

  if (!superuser) {
    // Redirect to superuser login page if not authenticated
    return <Navigate to="/superuser/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default SuperuserRoute;
