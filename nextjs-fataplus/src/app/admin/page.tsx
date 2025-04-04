'use client';

import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import AdminRoute from "@/components/auth/AdminRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  ShoppingBag,
  BookOpen,
  MessageSquare,
  TrendingUp,
  Activity,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboardPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Mock data for the dashboard
  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      icon: Users,
      change: "+12%",
      trend: "up",
    },
    {
      title: "Products",
      value: "456",
      icon: ShoppingBag,
      change: "+5%",
      trend: "up",
    },
    {
      title: "Courses",
      value: "32",
      icon: BookOpen,
      change: "+2%",
      trend: "up",
    },
    {
      title: "Community Posts",
      value: "789",
      icon: MessageSquare,
      change: "+18%",
      trend: "up",
    },
  ];

  const activityData = [
    { name: "Jan", users: 400, products: 240, courses: 100 },
    { name: "Feb", users: 300, products: 139, courses: 80 },
    { name: "Mar", users: 200, products: 980, courses: 90 },
    { name: "Apr", users: 278, products: 390, courses: 120 },
    { name: "May", users: 189, products: 480, courses: 150 },
    { name: "Jun", users: 239, products: 380, courses: 110 },
    { name: "Jul", users: 349, products: 430, courses: 140 },
  ];

  return (
    <AdminRoute>
      <AdminLayout title="Dashboard">
        <div className="grid gap-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                    </div>
                    <div className="bg-primary/10 p-2 rounded-full">
                      <stat.icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-red-500 mr-1 transform rotate-180" />
                    )}
                    <span
                      className={
                        stat.trend === "up" ? "text-green-500" : "text-red-500"
                      }
                    >
                      {stat.change}
                    </span>
                    <span className="text-muted-foreground ml-1">
                      from last month
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Activity Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Platform Activity</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isClient && (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="users" fill="#3b82f6" name="Users" />
                      <Bar dataKey="products" fill="#10b981" name="Products" />
                      <Bar dataKey="courses" fill="#8b5cf6" name="Courses" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                      <div>
                        <p className="font-medium">User {i}</p>
                        <p className="text-sm text-muted-foreground">
                          Joined {i} day{i !== 1 ? "s" : ""} ago
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-10 h-10 rounded bg-gray-200 mr-3"></div>
                      <div className="flex-1">
                        <p className="font-medium">Product {i}</p>
                        <p className="text-sm text-muted-foreground">
                          Added {i} day{i !== 1 ? "s" : ""} ago
                        </p>
                      </div>
                      <div className="font-medium">
                        {(Math.random() * 50000).toFixed(0)} Ar
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}
