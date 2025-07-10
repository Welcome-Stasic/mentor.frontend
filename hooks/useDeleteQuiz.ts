import { API } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export const useDeleteQuiz = () => {
  const queryClient = useQueryClient();
  const session = useSession();
  const accessToken = session.data?.user.accessToken || '';

  return useMutation({
    mutationFn: (quizId: string) => API.quiz.quizDelete(quizId, accessToken),

    // ❶ Инвалидация
    onSuccess: (_data, id, _ctx) => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
    },
  });
};