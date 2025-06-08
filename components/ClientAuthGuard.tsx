'use client';

import { useAutoLogout } from '@/hooks/useAutoLogout';
import useTokenRefresher from '@/hooks/useTokenRefresher';

export default function ClientAuthGuard({ children }: { children: React.ReactNode }) {
  useTokenRefresher();
  useAutoLogout();
  return <>{children}</>;
}
