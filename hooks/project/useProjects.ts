import { API } from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export const useProjects = (userId: string) => {
  const session = useSession();
  const accessToken = session.data?.user.accessToken || '';

  return useQuery({
    queryKey: ['projects', userId],

    queryFn: () => API.project.getAllProjects(userId, accessToken),
    enabled: !!accessToken && !!userId,
    select: (data) => data?.Result || [],
  });
};
