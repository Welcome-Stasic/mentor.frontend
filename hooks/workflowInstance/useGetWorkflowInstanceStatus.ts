'use client';

import { API } from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useQuery } from '@tanstack/react-query';

export const useGetWorkflowInstanceStatus = (id: number) => {
  const session = useSession();
  const accessToken = session.data?.user.accessToken || '';
  const enabled = !!accessToken && !!id && id !== 0;

  return useQuery({
    queryKey: ['workflowInstanceStatus', id],
    queryFn: () => API.workflowInstance.getWorkflowInstanceStatus(id, accessToken),
    enabled,
    select: (data) => data?.Result ?? null,
  });
};