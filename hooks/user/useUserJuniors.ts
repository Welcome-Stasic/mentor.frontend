'use client';

import { API } from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useQuery } from '@tanstack/react-query';

export const useUserJuniors = (id: string) => {
  const session = useSession();
  const accessToken = session.data?.user.accessToken || '';
  const enabled = !!accessToken && !!id;

  return useQuery({
    queryKey: ['userJuniors', id],
    queryFn: () => API.user.getJuniors(id, accessToken),
    enabled,
    select: (data) => data?.Result ?? [],
  });
};