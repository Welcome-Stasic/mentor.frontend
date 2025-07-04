'use client';

import { useCurrentUserStore } from '@/providers/current-user-provider';
import { Tab, Tabs } from '@mui/material';
import QuizFirstForm from './QuizFirstForm';
import QuizSecondForm from './QuizSecondForm';
import OverlayMessage from '../OverlayMessage';
import SearchIcon from '@mui/icons-material/Search';
import { redirect } from 'next/navigation';

const tabLabels = ['Контактные данные', 'Вопросы'];

const QuizContainer = () => {
  const tab = useCurrentUserStore((i) => i.quiz?.stage);
  const isCompleted = useCurrentUserStore((i) => i.quiz?.isCompleted ?? false);

  if(isCompleted) redirect('/');

  if (tab === undefined || tab === null)
    return (
      <OverlayMessage
        title="Ожидайте"
        message="Идет поиск ваших данны..."
        blurBackground
        blurPercent={80}
        icon={<SearchIcon color="info" sx={{ fontSize: 80 }} />}
      />
    );

  return (
    <>
      <Tabs value={tab} sx={{ mb: 2 }}>
        {tabLabels.map((label, index) => (
          <Tab key={index} label={label} disabled={index > tab} />
        ))}
      </Tabs>

      {tab === 0 && <QuizFirstForm />}

      {tab === 1 && <QuizSecondForm />}
    </>
  );
};

export default QuizContainer;
