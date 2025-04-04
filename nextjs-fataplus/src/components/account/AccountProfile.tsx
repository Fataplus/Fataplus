'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { LogOut, Upload, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { logout } from '@/actions/auth';
import { toast } from 'sonner';
import { getInitials } from '@/lib/utils';

interface AccountProfileProps {
  user: any;
}

export default function AccountProfile({ user }: AccountProfileProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      // The server action will handle the redirect
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
      setIsLoggingOut(false);
    }
  };

  const userTypeColors = {
    farmer: 'bg-green-500',
    seller: 'bg-blue-500',
    learner: 'bg-purple-500',
    admin: 'bg-red-500',
  };

  const userTypeColor = userTypeColors[user.userType as keyof typeof userTypeColors] || 'bg-gray-500';

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-lg">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
          </div>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          
          <div className="mt-2 flex items-center space-x-2">
            <Badge variant="outline" className={`${userTypeColor} text-white`}>
              {user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}
            </Badge>
            <Badge variant="outline">
              {user.plan === 'premium' ? 'Premium' : 'Free'}
            </Badge>
          </div>
          
          <div className="mt-6 w-full space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Upload className="mr-2 h-4 w-4" />
              Update Profile Picture
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <User className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
            <Button
              variant="destructive"
              className="w-full justify-start"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {isLoggingOut ? 'Logging out...' : 'Log Out'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
