'use client';

import { API } from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const session = useSession();
  const accessToken = session.data?.user.accessToken || '';

  return useMutation({
    mutationFn: (id: string) => API.admin.deleteUser(id, accessToken),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};