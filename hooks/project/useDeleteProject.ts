import { API } from '@/lib/axios';
import { ICreateProjectDto, IUpdateProjectCommand } from '@/lib/axios/types/project';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  const session = useSession();
  const accessToken = session.data?.user.accessToken || '';

  return useMutation({
    mutationFn: (projectId: string) => API.project.deleteProject(projectId, accessToken),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};
