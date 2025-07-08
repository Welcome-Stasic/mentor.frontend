'use client';

import { API } from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useQuery } from '@tanstack/react-query';

export const useQuizStatues = () => {
  const session = useSession();
  const accessToken = session.data?.user.accessToken || '';

  return useQuery({
    queryKey: ['quizStatues'],
    queryFn: () => API.quiz.getAllQuizStatues(accessToken),
    enabled: !!accessToken,
    select: (data) => data?.Result || [],
  });
};