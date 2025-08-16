'use client';

import { API } from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IUpdateUserEmailDto } from "@/lib/axios/types/user";

export const useUpdateEmail = () => {
  const queryClient = useQueryClient();
  const session = useSession();
  const accessToken = session.data?.user.accessToken || '';

  return useMutation({
    mutationFn: (payload: IUpdateUserEmailDto) => API.user.updateEmail(payload, accessToken),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['userById'] });
    },
  });
};