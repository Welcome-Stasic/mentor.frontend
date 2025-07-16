import { API } from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export const useQuizzes = ({
  pageNumber = 1,
  pageSize = 10,
  sortColumn,
  sortDirection,
  applicationUserId,
  dateIn,
  dateOut,
  dateTimeColumn,
  statusId,
}: {
  pageNumber?: number;
  pageSize?: number;
  sortColumn?: string;
  sortDirection?: string;
  applicationUserId?: string | null;
  dateIn?: string;
  dateOut?: string;
  dateTimeColumn?: string;
  statusId?: string;
}) => {
  const session = useSession();
  const accessToken = session.data?.user.accessToken || '';

  return useQuery({
    queryKey: [
      'quizzes',
      pageNumber,
      pageSize,
      sortColumn,
      sortDirection,
      applicationUserId,
      dateIn,
      dateOut,
      dateTimeColumn,
      statusId,
    ],
    queryFn: () =>
      API.quiz.getAll(accessToken, {
        pageNumber,
        pageSize,
        sortColumn,
        sortDirection,
        applicationUserId,
        dateIn,
        dateOut,
        dateTimeColumn,
        statusId,
      }),
    enabled: !!accessToken,
    select: (data) => data?.Result || null,
  });
};
