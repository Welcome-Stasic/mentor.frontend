'use client';

import { API } from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IBindingToCrmDto } from "@/lib/axios/types/user";

export const useBindingToCrm = () => {
  const queryClient = useQueryClient();
  const session = useSession();
  const accessToken = session.data?.user.accessToken || '';

  return useMutation({
    mutationFn: (payload: IBindingToCrmDto) => API.user.bindingToCrm(payload, accessToken),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};