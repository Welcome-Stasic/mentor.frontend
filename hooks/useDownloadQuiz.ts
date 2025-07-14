import { API } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export const useDownloadQuiz = () => {
  const session = useSession();
  const accessToken = session.data?.user.accessToken || '';

  return useMutation({
    mutationFn: (quizId: string) => API.quiz.quizDownload(quizId, accessToken),
  });
};