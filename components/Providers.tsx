'use client';

import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { SessionProvider } from 'next-auth/react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ConsentProvider } from '@/context/ConsentContext';
import ConsentBanner from './ConsentBanner';
import YandexMetrika from './YandexMetrika';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
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
  );
}
