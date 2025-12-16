'use client';

import { API } from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useQuery } from '@tanstack/react-query';

export const useUserJuniorsOld = (id: string) => {
  const session = useSession();
  const accessToken = session.data?.user.accessToken || '';
  const enabled = !!accessToken && !!id;

  return useQuery({
    queryKey: ['userJuniorsOld', id],
    queryFn: () => API.user.getJuniorsOld(id, accessToken),
    enabled,
    select: (data) => data?.Result ?? [],
  });
};