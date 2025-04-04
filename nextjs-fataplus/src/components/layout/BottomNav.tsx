'use client';

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Book, ShoppingCart, MessageSquare, User, Home, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const BottomNav = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState(pathname);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Update active tab when pathname changes
    setActiveTab(pathname);
  }, [pathname]);

  useEffect(() => {
    // Check if the user is an admin
    if (profile?.userType === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [profile]);

  const tabs = [
    { path: "/", label: "Home", icon: Home },
    { path: "/learn", label: "Learn", icon: Book },
    { path: "/shop", label: "Shop", icon: ShoppingCart },
    { path: "/community", label: "Community", icon: MessageSquare },
    { path: "/account", label: "Account", icon: User },
    // Only show admin tab for admin users
    ...(isAdmin ? [{ path: "/admin", label: "Admin", icon: Settings }] : []),
  ];

  const handleTabClick = (path: string) => {
    setActiveTab(path);
    router.push(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border h-16 flex items-center justify-around z-50">
      {tabs.map((tab) => (
        <button
          key={tab.path}
          onClick={() => handleTabClick(tab.path)}
          className={cn(
            "flex flex-col items-center justify-center w-full h-full",
            activeTab === tab.path
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          <tab.icon size={22} />
          <span className="text-xs mt-1">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default BottomNav;
