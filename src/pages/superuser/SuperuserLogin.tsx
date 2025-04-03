import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSuperuser } from "@/contexts/SuperuserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShieldAlert } from "lucide-react";

const SuperuserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { superuser, signIn } = useSuperuser();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Get the redirect path from location state or default to superuser dashboard
  const from = (location.state as any)?.from?.pathname || "/superuser";

  // Redirect if already logged in
  if (superuser) {
    navigate(from, { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      await signIn(email, password);
      
      toast({
        title: "Success",
        description: "You have been logged in as superuser",
      });
      
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Superuser login error:", error);
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Failed to login as superuser. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <ShieldAlert className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Superuser Login</CardTitle>
          <CardDescription className="text-center">
            Enter your PocketBase admin credentials to access superuser features.
            This area is restricted to system administrators only.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Admin Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login as Superuser"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-muted-foreground text-center">
            This login is for PocketBase administrators only.
            Regular users should use the standard login.
          </div>
          <Button variant="link" className="w-full" onClick={() => navigate("/")}>
            Return to main site
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SuperuserLogin;
