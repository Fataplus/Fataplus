import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { pb } from "@/integrations/pocketbase/client";
import { Loader2 } from "lucide-react";

const SettingsPage = () => {
  const [loading, setLoading] = useState(false);
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "FataPlus",
    siteDescription: "Agricultural super app for farmers, sellers, and learners in Madagascar",
    contactEmail: "contact@fata.plus",
    supportPhone: "+261 34 00 000 00",
  });
  const [featureFlags, setFeatureFlags] = useState({
    enableMarketplace: true,
    enableLearning: true,
    enableCommunity: true,
    enableUserRegistration: true,
    maintenanceMode: false,
  });
  const [notificationSettings, setNotificationSettings] = useState({
    enableEmailNotifications: true,
    enablePushNotifications: false,
    adminEmailRecipients: "admin@fata.plus",
    notificationFrequency: "instant",
  });
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, you would fetch settings from the database
    // For now, we'll use the default values
  }, []);

  const handleSaveGeneralSettings = async () => {
    try {
      setLoading(true);
      
      // In a real app, you would save settings to the database
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "General settings saved successfully",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFeatureFlags = async () => {
    try {
      setLoading(true);
      
      // In a real app, you would save feature flags to the database
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Feature flags saved successfully",
      });
    } catch (error) {
      console.error("Error saving feature flags:", error);
      toast({
        title: "Error",
        description: "Failed to save feature flags",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotificationSettings = async () => {
    try {
      setLoading(true);
      
      // In a real app, you would save notification settings to the database
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Notification settings saved successfully",
      });
    } catch (error) {
      console.error("Error saving notification settings:", error);
      toast({
        title: "Error",
        description: "Failed to save notification settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Settings">
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic information about your application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={generalSettings.siteName}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={generalSettings.siteDescription}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, siteDescription: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={generalSettings.contactEmail}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportPhone">Support Phone</Label>
                <Input
                  id="supportPhone"
                  value={generalSettings.supportPhone}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, supportPhone: e.target.value })}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveGeneralSettings} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Feature Flags</CardTitle>
              <CardDescription>
                Enable or disable features in your application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableMarketplace">Marketplace</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable the marketplace feature for buying and selling products.
                  </p>
                </div>
                <Switch
                  id="enableMarketplace"
                  checked={featureFlags.enableMarketplace}
                  onCheckedChange={(checked) => setFeatureFlags({ ...featureFlags, enableMarketplace: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableLearning">Learning Platform</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable the learning platform for courses and educational content.
                  </p>
                </div>
                <Switch
                  id="enableLearning"
                  checked={featureFlags.enableLearning}
                  onCheckedChange={(checked) => setFeatureFlags({ ...featureFlags, enableLearning: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableCommunity">Community</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable the community feature for posts and discussions.
                  </p>
                </div>
                <Switch
                  id="enableCommunity"
                  checked={featureFlags.enableCommunity}
                  onCheckedChange={(checked) => setFeatureFlags({ ...featureFlags, enableCommunity: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableUserRegistration">User Registration</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow new users to register for accounts.
                  </p>
                </div>
                <Switch
                  id="enableUserRegistration"
                  checked={featureFlags.enableUserRegistration}
                  onCheckedChange={(checked) => setFeatureFlags({ ...featureFlags, enableUserRegistration: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenanceMode" className="text-red-500">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Put the site in maintenance mode. Only admins can access.
                  </p>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={featureFlags.maintenanceMode}
                  onCheckedChange={(checked) => setFeatureFlags({ ...featureFlags, maintenanceMode: checked })}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveFeatureFlags} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how notifications are sent to users and admins.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableEmailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send notifications via email.
                  </p>
                </div>
                <Switch
                  id="enableEmailNotifications"
                  checked={notificationSettings.enableEmailNotifications}
                  onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, enableEmailNotifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enablePushNotifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send push notifications to mobile devices.
                  </p>
                </div>
                <Switch
                  id="enablePushNotifications"
                  checked={notificationSettings.enablePushNotifications}
                  onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, enablePushNotifications: checked })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminEmailRecipients">Admin Email Recipients</Label>
                <Input
                  id="adminEmailRecipients"
                  value={notificationSettings.adminEmailRecipients}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, adminEmailRecipients: e.target.value })}
                  placeholder="Comma-separated list of admin emails"
                />
                <p className="text-xs text-muted-foreground">
                  Separate multiple email addresses with commas.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notificationFrequency">Notification Frequency</Label>
                <select
                  id="notificationFrequency"
                  value={notificationSettings.notificationFrequency}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, notificationFrequency: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="instant">Instant</option>
                  <option value="hourly">Hourly Digest</option>
                  <option value="daily">Daily Digest</option>
                  <option value="weekly">Weekly Digest</option>
                </select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotificationSettings} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default SettingsPage;
