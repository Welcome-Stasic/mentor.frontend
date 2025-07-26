'use client';

import { API } from '@/lib/axios';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';

export const useReportTime = (id: string, dateIn?: string, dateOut?: string) => {
  const session = useSession();
  const accessToken = session.data?.user.accessToken || '';
  const enabled = !!accessToken && !!id;

  return useQuery({
    queryKey: ['reportTime', id, dateIn, dateOut],
    queryFn: () => API.user.getReportTime(id, accessToken, dateIn, dateOut),
    enabled,
    select: (data) => data?.Result ?? null,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};
