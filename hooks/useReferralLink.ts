'use client';

import { API } from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useQuery } from '@tanstack/react-query';

export const useReferralLink = (userId: string) => {
  const session = useSession();
  const accessToken = session.data?.user.accessToken || '';

  return useQuery({
    queryKey: ['referralLink', userId],
    queryFn: () => API.user.getReferralLink(userId, accessToken),
    enabled: !!accessToken || !!userId,
    select: (data) => data?.Result || null,
  });
};