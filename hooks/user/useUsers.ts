import { API } from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export const useUsers = ({
  pageNumber = 1,
  pageSize = 10,
  sortColumn,
  sortDirection,
}: {
  pageNumber?: number;
  pageSize?: number;
  sortColumn?: string;
  sortDirection?: string;
}) => {
  const session = useSession();
  const accessToken = session.data?.user.accessToken || '';

  return useQuery({
    queryKey: [
      'users',
      pageNumber,
      pageSize,
      sortColumn,
      sortDirection,
    ],
    queryFn: () =>
      API.user.getAllUsers(accessToken, {
        pageNumber,
        pageSize,
        sortColumn,
        sortDirection,
      }),
    enabled: !!accessToken,
    select: (data) => data?.Result || null,
  });
};
