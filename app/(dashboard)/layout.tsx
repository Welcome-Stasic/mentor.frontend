import DashboardContainer from '@/components/Dashboard/DashboardContainer';
import { CurrentUserStoreProvider } from '@/providers/current-user-provider';
import { QuizzesStoreProvider } from '@/providers/quizzes-provider';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/options';
import { API } from '@/lib/axios';
import { redirect } from 'next/navigation';
import { decodeToken } from '@/lib/utils/decodeToken';

export const getCurrentUser = async (token: string) => {
  const response = await API.user.me(token);
  return response?.Result ?? null;
};

const getQuiz = async (quizId: string, token: string) => {
  const response = await API.quiz.getById(quizId, token);
  return response?.Result ?? null;
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const accessToken = session?.user?.accessToken;

  if (!accessToken) redirect('/Information');

  const decoded = decodeToken(accessToken);
  const isWithoutQuiz = decoded?.isWithOutQuiz === 'True';

  const currentUser = await getCurrentUser(accessToken);

  if (!currentUser) {
    redirect('/Information');
  }

  if (!isWithoutQuiz && currentUser.quizId) {
    const quiz = await getQuiz(currentUser.quizId, accessToken);

    if (!quiz || !quiz.isCompleted) {
      redirect('/Quiz');
    }
  }

  if (!currentUser.elmaUserId) {
    redirect('/Information');
  }

  return (
    <CurrentUserStoreProvider>
      <QuizzesStoreProvider>
        <DashboardContainer>{children}</DashboardContainer>
      </QuizzesStoreProvider>
    </CurrentUserStoreProvider>
  );
}
