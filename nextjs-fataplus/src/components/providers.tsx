'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { SuperuserProvider } from '@/contexts/SuperuserContext';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import ServiceWorkerRegistration from '@/components/pwa/ServiceWorkerRegistration';

// Create a client
const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <SuperuserProvider>
            <Toaster />
            <SonnerToaster />
            <ServiceWorkerRegistration />
            {children}
          </SuperuserProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
