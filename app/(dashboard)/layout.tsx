import DashboardContainerNew from '@/components/Dashboard/DashboardContainer';
import { CurrentUserStoreProvider } from '@/providers/current-user-provider';
import { QuizzesStoreProvider } from '@/providers/quizzes-provider';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <CurrentUserStoreProvider>
      <QuizzesStoreProvider>
        <DashboardContainerNew>{children}</DashboardContainerNew>
      </QuizzesStoreProvider>
    </CurrentUserStoreProvider>
  );
}
