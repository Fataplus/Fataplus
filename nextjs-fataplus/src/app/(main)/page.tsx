'use client';

import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, BookOpen, Calendar, ShoppingCart, MessageSquare } from "lucide-react";

export default function HomePage() {
  return (
    <MainLayout>
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">FataPlus</h1>
            <p className="text-muted-foreground">Your agricultural companion</p>
          </div>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
        </div>

        {/* Featured Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-green-500 to-green-700 text-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold mb-2">Learn Farming</h2>
                  <p className="text-sm opacity-90">Access courses and tutorials</p>
                </div>
                <BookOpen className="h-8 w-8 opacity-80" />
              </div>
              <Button className="mt-4 bg-white text-green-700 hover:bg-green-100">
                Start Learning
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold mb-2">Shop Products</h2>
                  <p className="text-sm opacity-90">Buy and sell agricultural goods</p>
                </div>
                <ShoppingCart className="h-8 w-8 opacity-80" />
              </div>
              <Button className="mt-4 bg-white text-blue-700 hover:bg-blue-100">
                Browse Shop
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-700 text-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold mb-2">Community</h2>
                  <p className="text-sm opacity-90">Connect with other farmers</p>
                </div>
                <MessageSquare className="h-8 w-8 opacity-80" />
              </div>
              <Button className="mt-4 bg-white text-purple-700 hover:bg-purple-100">
                Join Discussions
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Upcoming Events</h2>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4 flex items-center">
                <div className="bg-primary/10 p-3 rounded-lg mr-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Seasonal Planting Workshop</h3>
                  <p className="text-sm text-muted-foreground">Tomorrow, 10:00 AM</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center">
                <div className="bg-primary/10 p-3 rounded-lg mr-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Market Day in Antananarivo</h3>
                  <p className="text-sm text-muted-foreground">Saturday, 8:00 AM</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto py-4 flex flex-col">
              <ShoppingCart className="h-6 w-6 mb-2" />
              <span>Sell Products</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col">
              <MessageSquare className="h-6 w-6 mb-2" />
              <span>Ask Question</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col">
              <BookOpen className="h-6 w-6 mb-2" />
              <span>My Courses</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col">
              <Bell className="h-6 w-6 mb-2" />
              <span>Notifications</span>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
