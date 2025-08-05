'use client';

import { API } from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IAssignRoleDto } from "@/lib/axios/types/user";

export const useRemoveUserRole = () => {
  const queryClient = useQueryClient();
  const session = useSession();
  const accessToken = session.data?.user.accessToken || '';

  return useMutation({
    mutationFn: (payload: IAssignRoleDto) => API.user.removeUserRole(payload, accessToken),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userById'] });
      queryClient.invalidateQueries({ queryKey: ['crmUser'] });
      queryClient.invalidateQueries({ queryKey: ['userRoles'] });
    },
  });
};