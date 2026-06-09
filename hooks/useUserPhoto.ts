'use client';

import { API } from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useQuery } from '@tanstack/react-query';

export const useUserPhoto = (
  userId?: string,
  elmaPhotoUrl?: string
) => {
  const { data: session } = useSession();
  const accessToken = session?.user?.accessToken;

  return useQuery({
    queryKey: ['userPhoto', userId],
    enabled: !!accessToken && !!userId && !elmaPhotoUrl,
    queryFn: async () => {
      try {
        const result = await API.user.getUserPhoto(
          userId!,
          accessToken!,
        )
        return result?.Result ?? null;
      } catch {
        return null;
      }
    },
    placeholderData: null,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
    retry: false,
    refetchOnWindowFocus: false,
  });
};