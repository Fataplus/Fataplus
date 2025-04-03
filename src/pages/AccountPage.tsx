
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  User, 
  Settings, 
  ShoppingCart, 
  BookOpen, 
  MessageSquare, 
  Calendar,
  LogOut,
  Download,
  ChevronRight,
  Bell
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

const AccountPage = () => {
  return (
    <MainLayout>
      <div className="fataplus-container py-6">
        <h1 className="text-2xl font-bold mb-6">Account</h1>
        
        {/* User profile card */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="bg-muted h-16 w-16 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Jean Rakoto</h2>
                <p className="text-muted-foreground">Farmer • Antananarivo</p>
                <div className="flex items-center mt-1">
                  <span className="text-xs bg-primary/10 text-primary py-1 px-2 rounded-full">Free Plan</span>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">Edit Profile</Button>
          </CardContent>
        </Card>
        
        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-primary">3</p>
              <p className="text-xs text-muted-foreground">Courses</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-primary">12</p>
              <p className="text-xs text-muted-foreground">Tasks</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-primary">5</p>
              <p className="text-xs text-muted-foreground">Posts</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Main menu */}
        <h2 className="text-lg font-semibold mb-3">My Activities</h2>
        <Card className="mb-6">
          <CardContent className="p-0">
            <div className="divide-y">
              <button className="flex items-center justify-between w-full p-4 hover:bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <span>My Courses</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
              <button className="flex items-center justify-between w-full p-4 hover:bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="bg-secondary/10 p-2 rounded-full">
                    <ShoppingCart className="h-5 w-5 text-secondary" />
                  </div>
                  <span>Purchase History</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
              <button className="flex items-center justify-between w-full p-4 hover:bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="bg-accent/10 p-2 rounded-full">
                    <MessageSquare className="h-5 w-5 text-accent" />
                  </div>
                  <span>My Posts</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
              <button className="flex items-center justify-between w-full p-4 hover:bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <span>My Tasks</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
          </CardContent>
        </Card>
        
        {/* Settings */}
        <h2 className="text-lg font-semibold mb-3">Settings</h2>
        <Card className="mb-6">
          <CardContent className="p-0">
            <div className="divide-y">
              <button className="flex items-center justify-between w-full p-4 hover:bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="bg-muted p-2 rounded-full">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <span>Notifications</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
              <button className="flex items-center justify-between w-full p-4 hover:bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="bg-muted p-2 rounded-full">
                    <Download className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <span>Offline Content</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
              <div className="flex items-center justify-between w-full p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-muted p-2 rounded-full">
                    <Settings className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <span>Dark Mode</span>
                </div>
                <Switch id="dark-mode" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Subscription */}
        <Card className="mb-6 bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Free Plan</h3>
              <span className="text-xs bg-primary/10 text-primary py-1 px-2 rounded-md">Current</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">Upgrade to Premium for unlimited AI assistance, offline courses, and advanced features.</p>
            <Button className="w-full">Upgrade to Premium</Button>
          </CardContent>
        </Card>
        
        {/* Logout button */}
        <Button variant="outline" className="w-full flex items-center justify-center gap-2">
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </MainLayout>
  );
};

export default AccountPage;
