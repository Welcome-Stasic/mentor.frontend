'use client';

import { useSession } from "next-auth/react";
import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from "@/app/(dashboard)/layout";


export const useCurrentUser = () => {
  const session = useSession();
  const accessToken = session.data?.user.accessToken || '';
  const enabled = !!accessToken;

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => getCurrentUser(accessToken),
    enabled,
    select: (data) => data ?? null,
  });
};