'use client';

import { API } from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useQuery } from '@tanstack/react-query';

export const userUserById = (Id: string) => {
  const session = useSession();
  const accessToken = session.data?.user.accessToken || '';
  const enabled = Boolean(Id);

  return useQuery({
    queryKey: ['userById', Id],
    queryFn: () => API.user.getUserById(Id, accessToken),
    enabled,
    select: (data) => data?.Result ?? null,
  });
};