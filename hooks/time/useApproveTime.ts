import { API } from '@/lib/axios';
import { IApproveTimeDto } from '@/lib/axios/types/time';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export const useApproveTime = () => {
  const queryClient = useQueryClient();
  const session = useSession();
  const accessToken = session.data?.user.accessToken || '';

  return useMutation({
    mutationFn: (dto: IApproveTimeDto) => API.time.approveTime(dto, accessToken),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approveTimeInfo'] });
    },
  });
};
