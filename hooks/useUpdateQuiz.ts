import { API } from '@/lib/axios';
import { IApiResponse, IPaginationResponse } from '@/lib/axios/types/base';
import { IQuiz, IUpdateQuizDto } from '@/lib/axios/types/quiz';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export const useUpdateQuiz = () => {
  const queryClient = useQueryClient();
  const session = useSession();
  const accessToken = session.data?.user.accessToken || '';

  return useMutation({
    mutationFn: (dto: IUpdateQuizDto) => API.quiz.update(dto, accessToken),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
    },
  });
};
