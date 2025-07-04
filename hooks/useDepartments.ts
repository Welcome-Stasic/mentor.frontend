'use client';

import { API } from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useQuery } from '@tanstack/react-query';

export const useDepartments = () => {
  const session = useSession();
  const accessToken = session.data?.user.accessToken || '';

  return useQuery({
    queryKey: ['departments'],
    queryFn: () => API.department.getAll(accessToken),
    enabled: !!accessToken,
    select: (data) => data?.Result || [],
  });
};