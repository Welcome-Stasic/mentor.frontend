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
        const response = await API.user.getUserPhoto(
          userId!,
          accessToken!
        );
        return response?.Result ?? null;
      } catch (error) {
        console.error('Failed to load user photo', error);
        return null;
      }
    },
    // Не делать повторные запросы при ошибке
    retry: false,
    // Не рефетчить при фокусе окна
    refetchOnWindowFocus: false,
    // Кэшируем результат
    staleTime: 1000 * 60 * 60, // 1 час
    // Храним в кеше
    gcTime: 1000 * 60 * 60 * 24, // 24 часа
  });
};