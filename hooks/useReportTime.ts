'use client';

import { API } from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useQuery } from '@tanstack/react-query';

export const useReportTime = (id: string, dateIn: Date, dateOut: Date) => {
  const session = useSession();
  const accessToken = session.data?.user.accessToken || '';
  const enabled = Boolean(id);

  return useQuery({
    queryKey: ['workTime', id, dateIn, dateOut],
    queryFn: () => API.user.getReportTime(id, dateIn, dateOut, accessToken),
    enabled,
    select: (data) => data?.Result ?? null,
  });
};