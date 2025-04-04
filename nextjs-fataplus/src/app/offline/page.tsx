import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { WifiOff, RefreshCw } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Offline | FataPlus',
  description: 'You are currently offline',
};

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="flex items-center space-x-2">
            <div className="relative h-12 w-12 overflow-hidden rounded-full">
              <Image
                src="/logo.png"
                alt="FataPlus Logo"
                fill
                sizes="48px"
                className="object-cover"
                priority
              />
            </div>
            <span className="text-2xl font-bold">FataPlus</span>
          </div>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <div className="flex justify-center">
              <WifiOff className="h-16 w-16 text-muted-foreground" />
            </div>
            <CardTitle className="text-center text-2xl font-bold">You're Offline</CardTitle>
            <CardDescription className="text-center">
              It looks like you've lost your internet connection. Some features may be unavailable until you're back online.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              FataPlus works offline for many features. You can still access your cached data and continue using the app.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full" onClick={() => window.location.reload()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full">
                Go to Homepage
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
