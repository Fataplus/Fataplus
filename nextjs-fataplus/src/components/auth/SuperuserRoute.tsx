'use client';

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSuperuser } from "@/contexts/SuperuserContext";
import { Loader2 } from "lucide-react";

interface SuperuserRouteProps {
  children: ReactNode;
}

const SuperuserRoute = ({ children }: SuperuserRouteProps) => {
  const { superuser, isLoading } = useSuperuser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !superuser) {
      router.push('/superuser/login');
    }
  }, [superuser, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Checking superuser authorization...</span>
      </div>
    );
  }

  if (!superuser) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
};

export default SuperuserRoute;
