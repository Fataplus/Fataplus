import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShoppingBag, BookOpen, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { pb } from "@/integrations/pocketbase/client";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    courses: 0,
    posts: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch counts from PocketBase
        const usersCount = await pb.collection('users').getList(1, 1, { countOnly: true });
        const productsCount = await pb.collection('products').getList(1, 1, { countOnly: true });
        const coursesCount = await pb.collection('courses').getList(1, 1, { countOnly: true });
        const postsCount = await pb.collection('posts').getList(1, 1, { countOnly: true });
        
        setStats({
          users: usersCount.totalItems,
          products: productsCount.totalItems,
          courses: coursesCount.totalItems,
          posts: postsCount.totalItems,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard statistics",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [toast]);

  const statCards = [
    {
      title: "Total Users",
      value: stats.users,
      icon: <Users className="h-8 w-8 text-blue-500" />,
      color: "bg-blue-50",
    },
    {
      title: "Products",
      value: stats.products,
      icon: <ShoppingBag className="h-8 w-8 text-green-500" />,
      color: "bg-green-50",
    },
    {
      title: "Courses",
      value: stats.courses,
      icon: <BookOpen className="h-8 w-8 text-purple-500" />,
      color: "bg-purple-50",
    },
    {
      title: "Community Posts",
      value: stats.posts,
      icon: <MessageSquare className="h-8 w-8 text-orange-500" />,
      color: "bg-orange-50",
    },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Overview</h2>
        
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Loading...</CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-gray-200"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-7 w-16 rounded bg-gray-200"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statCards.map((card) => (
              <Card key={card.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  <div className={`rounded-lg p-2 ${card.color}`}>{card.icon}</div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This feature will display recent activities across the platform.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Common administrative tasks will be available here.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
