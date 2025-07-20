'use client';

import { API } from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useQuery } from '@tanstack/react-query';

export const useInstitutions = () => {
  const session = useSession();
  const accessToken = session.data?.user.accessToken || '';

  return useQuery({
    queryKey: ['institutions'],
    queryFn: () => API.institution.getAllInstitution(accessToken),
    enabled: !!accessToken,
    select: (data) => data?.Result || [],
  });
};

export const useInstitution = (id: number | undefined) => {
  const session = useSession();
  const accessToken = session.data?.user.accessToken || '';

  return useQuery({
    queryKey: ['institutions'],
    queryFn: () => API.institution.getByIdInstitution(id ?? 0, accessToken),
    enabled: !!accessToken || !!id,
    select: (data) => data?.Result || null,
  });
};