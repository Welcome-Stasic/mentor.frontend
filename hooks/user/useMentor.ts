'use client';

import { API } from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useQuery } from '@tanstack/react-query';

export const useMentor = (id: string) => {
  const session = useSession();
  const accessToken = session.data?.user.accessToken || '';
  const enabled = !!accessToken && !!id;

  return useQuery({
    queryKey: ['mentor', id],
    queryFn: () => API.user.getMentor(id, accessToken),
    enabled,
    select: (data) => data?.Result ?? null,
  });
};