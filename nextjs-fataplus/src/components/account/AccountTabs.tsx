'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, BookOpen, ShoppingCart, CreditCard, Settings } from 'lucide-react';
import MyProducts from './MyProducts';
import MyCourses from './MyCourses';
import MyOrders from './MyOrders';
import AccountSettings from './AccountSettings';

interface AccountTabsProps {
  user: any;
}

export default function AccountTabs({ user }: AccountTabsProps) {
  const [activeTab, setActiveTab] = useState('products');

  // Only show products tab for sellers
  const showProductsTab = user.userType === 'seller' || user.userType === 'admin';
  
  // Default to courses tab if not a seller
  const defaultTab = showProductsTab ? 'products' : 'courses';

  return (
    <Tabs defaultValue={defaultTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-4">
        {showProductsTab && (
          <TabsTrigger value="products" className="flex items-center justify-center">
            <ShoppingBag className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">My Products</span>
          </TabsTrigger>
        )}
        <TabsTrigger value="courses" className="flex items-center justify-center">
          <BookOpen className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">My Courses</span>
        </TabsTrigger>
        <TabsTrigger value="orders" className="flex items-center justify-center">
          <ShoppingCart className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">My Orders</span>
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex items-center justify-center">
          <Settings className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Settings</span>
        </TabsTrigger>
      </TabsList>
      
      {showProductsTab && (
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>My Products</CardTitle>
              <CardDescription>
                Manage your product listings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MyProducts userId={user.id} />
            </CardContent>
          </Card>
        </TabsContent>
      )}
      
      <TabsContent value="courses">
        <Card>
          <CardHeader>
            <CardTitle>My Courses</CardTitle>
            <CardDescription>
              Track your learning progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MyCourses userId={user.id} />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="orders">
        <Card>
          <CardHeader>
            <CardTitle>My Orders</CardTitle>
            <CardDescription>
              View your order history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MyOrders userId={user.id} />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="settings">
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>
              Manage your account preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AccountSettings user={user} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
