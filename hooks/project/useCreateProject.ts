import { API } from '@/lib/axios';
import { ICreateProjectDto } from '@/lib/axios/types/project';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const session = useSession();
  const accessToken = session.data?.user.accessToken || '';

  return useMutation({
    mutationFn: (dto: ICreateProjectDto) => API.project.getCreateProject(dto, accessToken),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};
