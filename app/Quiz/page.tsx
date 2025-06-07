import { CurrentUserStoreProvider } from '@/providers/current-user-provider';

export default function QuizPage() {
  return <CurrentUserStoreProvider>Quiz</CurrentUserStoreProvider>;
}
