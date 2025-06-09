import { getAllQuiz } from '@/mentorApi/request/getAllQuiz';
import { getCookie } from 'cookies-next';
import { jwtDecode } from 'jwt-decode';
import { redirect } from 'next/navigation';

export async function useCheckQuiz() {
  const token = await getCookie('token');

  if (!token) return;

  let decoded: Record<string, unknown>;
  try {
    decoded = jwtDecode(token);
  } catch (error) {
    console.error('Invalid token:', error);
    return;
  }

  const applicationUserId = decoded['id'] as string | undefined;

  if (!applicationUserId) return;

  try {
    const result = await getAllQuiz(applicationUserId);
    const quiz = result?.Result?.data?.[0];
    
    
    if (!quiz?.isCompleted) {
      redirect('/Quiz');
    }
  } catch (error) {
    console.error('Failed to fetch quiz:', error);
  }
}
