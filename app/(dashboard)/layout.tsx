import DashboardContainer from '@/components/Dashboard/DashboardContainer';
import { CurrentUserStoreProvider } from '@/providers/current-user-provider';
import { QuizzesStoreProvider } from '@/providers/quizzes-provider';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <CurrentUserStoreProvider>
      <QuizzesStoreProvider>
        <DashboardContainer>{children}</DashboardContainer>
      </QuizzesStoreProvider>
    </CurrentUserStoreProvider>
  );
}
