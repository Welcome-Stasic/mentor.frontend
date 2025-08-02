import { API } from '@/lib/axios';
import { ICreateProjectDto, IUpdateProjectCommand } from '@/lib/axios/types/project';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  const session = useSession();
  const accessToken = session.data?.user.accessToken || '';

  return useMutation({
    mutationFn: (dto: IUpdateProjectCommand) => API.project.getUpdateProject(dto, accessToken),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};
