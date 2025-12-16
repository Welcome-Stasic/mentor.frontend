'use client';

import { API } from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IUpdateUserNumberDto } from "@/lib/axios/types/user";

export const useUpdateNumber = () => {
  const queryClient = useQueryClient();
  const session = useSession();
  const accessToken = session.data?.user.accessToken || '';

  return useMutation({
    mutationFn: (payload: IUpdateUserNumberDto) => API.user.updateNumber(payload, accessToken),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['userById'] });
    },
  });
};