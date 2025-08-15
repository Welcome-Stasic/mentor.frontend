'use client';

import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  
  useEffect(() => {
    if (session && session.refreshTokenValid === false) {
      signOut({ callbackUrl: '/Account/Login' });
    }
  }, [session]);

  return <>{children}</>;
}
