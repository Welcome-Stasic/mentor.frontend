'use client';

import { signInWithProvider } from '@/app/api/auth/[...nextauth]/signInWithProvider';
import { useEffect } from 'react';

interface TokenSignInClientProps {
  accessToken: string;
}

export default function TokenSignInClient({ accessToken }: TokenSignInClientProps) {
  useEffect(() => {
    if (!accessToken) return;

    signInWithProvider('token', {
      token: accessToken,
      redirect: false,
    });
  }, [accessToken]);

  return null;
}
