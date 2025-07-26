import { API } from '@/lib/axios';
import { ICreateTimeDto } from '@/lib/axios/types/time';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export const useCreateWorkTime = () => {
  const queryClient = useQueryClient();
  const session = useSession();
  const accessToken = session.data?.user.accessToken || '';

  return useMutation({
    mutationFn: (dto: ICreateTimeDto) => API.time.createTime(dto, accessToken),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workTime'] });
    },
  });
};
