'use client';

import { API } from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useQuery } from '@tanstack/react-query';

export const useCrmUsers = () => {
  const session = useSession();
  const accessToken = session.data?.user.accessToken || '';
  const enabled = !!accessToken;

  return useQuery({
    queryKey: ['crmUsers'],
    queryFn: () => API.user.getAllCrmUsers(accessToken),
    enabled,
    select: (data) => data?.Result ?? [],
  });
};