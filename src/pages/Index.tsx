
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, BookOpen, Calendar, ShoppingCart, MessageSquare } from "lucide-react";

const Index = () => {
  return (
    <MainLayout>
      <div className="fataplus-container py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">FataPlus</h1>
            <p className="text-muted-foreground">Your agricultural companion</p>
          </div>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
        </div>

        {/* Weather Card */}
        <Card className="mb-6 bg-primary/10">
          <CardContent className="p-4">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today</p>
                <p className="text-lg font-medium">Antananarivo, MG</p>
                <p className="text-2xl font-bold mt-1">24°C</p>
              </div>
              <div className="flex items-center justify-center">
                <div className="rounded-full bg-yellow-300 h-12 w-12 flex items-center justify-center">
                  <span className="text-yellow-700 text-lg">☀️</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <div className="bg-background rounded-md p-2 text-center flex-1">
                <p className="text-xs text-muted-foreground">Humidity</p>
                <p className="font-medium">65%</p>
              </div>
              <div className="bg-background rounded-md p-2 text-center flex-1">
                <p className="text-xs text-muted-foreground">Wind</p>
                <p className="font-medium">8 km/h</p>
              </div>
              <div className="bg-background rounded-md p-2 text-center flex-1">
                <p className="text-xs text-muted-foreground">Rain</p>
                <p className="font-medium">10%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-md">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Learn</p>
                <p className="text-xs text-muted-foreground">Continue courses</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="bg-secondary/10 p-2 rounded-md">
                <ShoppingCart className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="font-medium">Shop</p>
                <p className="text-xs text-muted-foreground">Marketplace</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="bg-accent/10 p-2 rounded-md">
                <MessageSquare className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-medium">Community</p>
                <p className="text-xs text-muted-foreground">Join discussions</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-md">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Tasks</p>
                <p className="text-xs text-muted-foreground">Manage tasks</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Tasks */}
        <h2 className="text-lg font-semibold mb-3">Upcoming Tasks</h2>
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="rounded-full h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Apply fertilizer</p>
                    <p className="text-xs text-muted-foreground">Rice field - North</p>
                  </div>
                </div>
                <span className="text-xs bg-primary/10 text-primary py-1 px-2 rounded-md">Today</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="rounded-full h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Check irrigation</p>
                    <p className="text-xs text-muted-foreground">All fields</p>
                  </div>
                </div>
                <span className="text-xs bg-muted text-muted-foreground py-1 px-2 rounded-md">Tomorrow</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="rounded-full h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Harvest maize</p>
                    <p className="text-xs text-muted-foreground">South field</p>
                  </div>
                </div>
                <span className="text-xs bg-muted text-muted-foreground py-1 px-2 rounded-md">In 3 days</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-3">
              View all tasks
            </Button>
          </CardContent>
        </Card>

        {/* Latest Community Posts */}
        <h2 className="text-lg font-semibold mb-3">Latest Community Posts</h2>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-muted h-8 w-8 rounded-full"></div>
                  <div>
                    <p className="font-medium">Jean Baptiste</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <p className="text-sm">Has anyone tried the new drought-resistant rice variety? How well does it perform in our region?</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-muted h-8 w-8 rounded-full"></div>
                  <div>
                    <p className="font-medium">Marie Andriamahefa</p>
                    <p className="text-xs text-muted-foreground">5 hours ago</p>
                  </div>
                </div>
                <p className="text-sm">I'm selling freshly harvested avocados at the Antsirabe market this weekend. Come visit!</p>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-3">
              View all posts
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Index;
