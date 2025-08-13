'use client';

import { API } from '@/lib/axios';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { IGetAllJuniorsDto } from '@/lib/axios/types/user';
import { useMemo } from 'react';

export const useAllJuniors = (params: IGetAllJuniorsDto, isEnabled: boolean) => {
  const { data: session } = useSession();
  const accessToken = session?.user?.accessToken ?? '';

  const stableParams = useMemo(() => params, [JSON.stringify(params)]);

  return useQuery({
    queryKey: ['allJuniors', stableParams],
    queryFn: async () => {
      const data = await API.user.getAllJuniors(stableParams, accessToken);
      return data?.Result ?? [];
    },
    enabled: Boolean(accessToken && isEnabled),
  });
};