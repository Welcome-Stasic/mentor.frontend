import { API } from '@/lib/axios';
import { ICancelApproveTimeDto } from '@/lib/axios/types/time';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export const useCancelApproveTime = () => {
  const queryClient = useQueryClient();
  const session = useSession();
  const accessToken = session.data?.user.accessToken || '';

  return useMutation({
    mutationFn: (dto: ICancelApproveTimeDto) => API.time.cancelApproveTime(dto, accessToken),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approveTimeInfo'] });
    },
  });
};
