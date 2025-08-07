'use client';

import { API } from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useMutation } from '@tanstack/react-query';

export const useLogOutUser = () => {
  const session = useSession();
  const accessToken = session.data?.user.accessToken || '';

  return useMutation({
    mutationFn: (id: string) => API.admin.allLogOutUser(id, accessToken),
  });
};