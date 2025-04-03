
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Book, ShoppingCart, MessageSquare, User, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);

  const tabs = [
    { path: "/", label: "Home", icon: Home },
    { path: "/learn", label: "Learn", icon: Book },
    { path: "/shop", label: "Shop", icon: ShoppingCart },
    { path: "/community", label: "Community", icon: MessageSquare },
    { path: "/account", label: "Account", icon: User },
  ];

  const handleTabClick = (path: string) => {
    setActiveTab(path);
    navigate(path);
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
