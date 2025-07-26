import { API } from '@/lib/axios';
import { IDeleteTimeDto } from '@/lib/axios/types/time';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export const useDeleteWorkTime = () => {
  const queryClient = useQueryClient();
  const session = useSession();
  const accessToken = session.data?.user.accessToken || '';

  return useMutation({
    mutationFn: (dto: IDeleteTimeDto) => API.time.deleteTime(dto, accessToken),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workTime'] });
    },
  });
};
