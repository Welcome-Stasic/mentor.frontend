'use client';

import { API } from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useQuery } from '@tanstack/react-query';

export const useUserPhoto = (userId: string, elmaPhotoUrl?: string) => {
  const session = useSession();
  const accessToken = session.data?.user.accessToken || '';
  const enabled = Boolean(accessToken && userId && !elmaPhotoUrl);

  return useQuery({
    queryKey: ['userPhoto', userId],
    queryFn: () => API.user.getUserPhoto(userId, accessToken),
    enabled,
    select: (data) => data?.Result ?? null,
  });
};