'use client';

import { API } from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useQuery } from '@tanstack/react-query';

export const useUserById = (id: string) => {
  const session = useSession();
  const accessToken = session.data?.user.accessToken || '';
  const enabled = !!accessToken && !!id && id !== '';

  return useQuery({
    queryKey: ['userById', id],
    queryFn: () => API.user.getUserById(id, accessToken),
    enabled,
    select: (data) => data?.Result ?? null,
  });
};