'use client';

import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { SessionProvider } from 'next-auth/react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ConsentProvider } from '@/context/ConsentContext';
import ConsentBanner from './ConsentBanner';
import YandexMetrika from './YandexMetrika';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <SessionProvider>
          <AppRouterCacheProvider>
            <ConsentProvider>
              {children}
              <ConsentBanner />
              <YandexMetrika />
            </ConsentProvider>
          </AppRouterCacheProvider>
        </SessionProvider>
      </NuqsAdapter>
    </QueryClientProvider>
  );
}
