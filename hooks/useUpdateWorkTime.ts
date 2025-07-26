import { API } from '@/lib/axios';
import { IUpdateTimeDto } from '@/lib/axios/types/time';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export const useUpdateWorkTime = () => {
  const queryClient = useQueryClient();
  const session = useSession();
  const accessToken = session.data?.user.accessToken || '';

  return useMutation({
    mutationFn: (dto: IUpdateTimeDto) => API.time.updateTime(dto, accessToken),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workTime'] });
    },
  });
};
