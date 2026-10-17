'use client';

import { API } from '@/lib/axios';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { IGetAllJuniorsDto } from '@/lib/axios/types/user';

export const useAllJuniors = (params: IGetAllJuniorsDto, isEnabled: boolean) => {
  const { data: session } = useSession();
  const accessToken = session?.user?.accessToken ?? '';

  const paramsKey = JSON.stringify(params);

  return useQuery({
    queryKey: ['allJuniors', paramsKey, accessToken],
    queryFn: async () => {
      const data = await API.user.getAllJuniors(params, accessToken);
      return data?.Result ?? [];
    },
    enabled: Boolean(accessToken && isEnabled),
  });
};