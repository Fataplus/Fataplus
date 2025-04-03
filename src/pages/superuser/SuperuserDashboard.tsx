import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSuperuser } from "@/contexts/SuperuserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { superuserApiRequest } from "@/services/superuserApi";
import { 
  Database, 
  Users, 
  Settings, 
  LogOut, 
  Server, 
  Shield, 
  AlertTriangle,
  Loader2
} from "lucide-react";

const SuperuserDashboard = () => {
  const { superuser, signOut } = useSuperuser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [systemInfo, setSystemInfo] = useState<any>(null);
  const [collections, setCollections] = useState<any[]>([]);

  useEffect(() => {
    const fetchSystemInfo = async () => {
      try {
        setLoading(true);
        
        // Fetch system info
        const info = await superuserApiRequest("health");
        setSystemInfo(info);
        
        // Fetch collections
        const collectionsData = await superuserApiRequest("collections");
        setCollections(collectionsData.items || []);
        
      } catch (error) {
        console.error("Error fetching superuser data:", error);
        toast({
          title: "Error",
          description: "Failed to load system information",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSystemInfo();
  }, [toast]);

  const handleSignOut = () => {
    signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out of superuser mode",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="mr-2 h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold">Superuser Dashboard</h1>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Warning Banner */}
        <div className="mb-6 rounded-md bg-yellow-50 p-4 border border-yellow-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Superuser Mode Active</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  You are currently operating with full administrative privileges. 
                  Any changes made here will directly affect the PocketBase database.
                  Use caution when making changes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">
              <Server className="mr-2 h-4 w-4" />
              System Overview
            </TabsTrigger>
            <TabsTrigger value="collections">
              <Database className="mr-2 h-4 w-4" />
              Collections
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="mr-2 h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
                <CardDescription>
                  Current status of your PocketBase instance
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex h-40 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-md border p-4">
                      <h3 className="font-medium">System Health</h3>
                      <div className="mt-2 flex items-center">
                        <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                        <span>API is healthy</span>
                      </div>
                    </div>
                    <div className="rounded-md border p-4">
                      <h3 className="font-medium">Database</h3>
                      <div className="mt-2">
                        <p>Collections: {collections.length}</p>
                        <p>System Collections: {collections.filter(c => c.system).length}</p>
                        <p>Custom Collections: {collections.filter(c => !c.system).length}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => window.open("https://backend.fata.plus/_/", "_blank")}>
                  Open PocketBase Admin UI
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="collections">
            <Card>
              <CardHeader>
                <CardTitle>Collections</CardTitle>
                <CardDescription>
                  Manage your PocketBase collections
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex h-40 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="rounded-md border">
                      <div className="bg-muted px-4 py-2 font-medium">
                        System Collections
                      </div>
                      <div className="divide-y">
                        {collections
                          .filter(c => c.system)
                          .map((collection) => (
                            <div key={collection.id} className="flex items-center justify-between p-4">
                              <div>
                                <div className="font-medium">{collection.name}</div>
                                <div className="text-sm text-muted-foreground">ID: {collection.id}</div>
                              </div>
                              <Button variant="outline" size="sm">View</Button>
                            </div>
                          ))}
                      </div>
                    </div>
                    
                    <div className="rounded-md border">
                      <div className="bg-muted px-4 py-2 font-medium">
                        Custom Collections
                      </div>
                      <div className="divide-y">
                        {collections
                          .filter(c => !c.system)
                          .map((collection) => (
                            <div key={collection.id} className="flex items-center justify-between p-4">
                              <div>
                                <div className="font-medium">{collection.name}</div>
                                <div className="text-sm text-muted-foreground">ID: {collection.id}</div>
                              </div>
                              <Button variant="outline" size="sm">View</Button>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Users Management</CardTitle>
                <CardDescription>
                  Manage users in your PocketBase instance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    User management functionality will be implemented in a future update.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure your PocketBase instance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Settings management functionality will be implemented in a future update.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SuperuserDashboard;
