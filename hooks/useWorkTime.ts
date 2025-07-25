'use client';

import { API } from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useQuery } from '@tanstack/react-query';

export const useWorkTime = (id: string, dateIn?: string, dateOut?: string) => {
  const session = useSession();
  const accessToken = session.data?.user.accessToken || '';
  const enabled = Boolean(id);

  return useQuery({
    queryKey: ['workTime', id, dateIn, dateOut],
    queryFn: () => API.user.getWorkTime(id, accessToken, dateIn, dateOut),
    enabled,
    select: (data) => data?.Result ?? [],
  });
};