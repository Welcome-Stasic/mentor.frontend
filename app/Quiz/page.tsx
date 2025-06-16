'use client';

import { Tabs, Tab,  Paper } from '@mui/material';
import QuizFirstForm from '@/components/QuizFirstForm';
import { useCurrentUserStore } from '@/providers/current-user-provider';
import QuizSecondForm from '@/components/QuizSecondForm';

const tabLabels = ['Контактные данные', 'Вопросы'];

export default function QuizPage() {
  const currentQuiz = useCurrentUserStore((i) => i.quiz);

  const tab = currentQuiz?.stage ?? 0;
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        maxWidth: 800,
        mx: 'auto',
        overflow: 'visible', // <-- важно
      }}>
      <Tabs value={tab} sx={{ mb: 2 }}>
        {tabLabels.map((label, index) => (
          <Tab key={index} label={label} disabled={index > tab} />
        ))}
      </Tabs>

      {tab === 0 && <QuizFirstForm />}

      {tab === 1 && <QuizSecondForm />}
    </Paper>
  );
}
