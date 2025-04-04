'use client';

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, profile, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || (profile?.userType !== 'admin'))) {
      router.push('/admin/login');
    }
  }, [user, profile, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Checking admin authorization...</span>
      </div>
    );
  }

  if (!user || (profile?.userType !== 'admin')) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
};

export default AdminRoute;
