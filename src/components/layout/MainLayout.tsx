
import { ReactNode } from "react";
import BottomNav from "./BottomNav";
import { NotificationsProvider } from "@/components/realtime/NotificationsProvider";
import NotificationsDropdown from "@/components/realtime/NotificationsDropdown";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
}

const MainLayout = ({ children, title }: MainLayoutProps) => {
  const { user, logout } = useAuth();

  return (
    <NotificationsProvider>
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <div className="mr-4 flex">
              <Link to="/" className="flex items-center space-x-2">
                <span className="font-bold">FataPlus</span>
              </Link>
            </div>

            {title && (
              <div className="flex-1 items-center justify-center hidden md:flex">
                <h1 className="text-lg font-semibold">{title}</h1>
              </div>
            )}

            <div className="flex flex-1 items-center justify-end space-x-2">
              {user ? (
                <>
                  <NotificationsDropdown />
                  <Link to="/account">
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </Link>
                  {/* Only show logout button for authenticated users (not guest users) */}
                  {user.email && (
                    <Button variant="ghost" size="icon" onClick={logout}>
                      <LogOut className="h-5 w-5" />
                    </Button>
                  )}
                </>
              ) : (
                <Link to="/login">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 pb-16">
          {children}
        </main>

        <BottomNav />
      </div>
    </NotificationsProvider>
  );
};

export default MainLayout;
