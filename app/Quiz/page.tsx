'use client';

import { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
  Paper,
} from '@mui/material';
import QuizFirstForm from '@/components/QuizFirstForm';
import { useCurrentUserStore } from '@/providers/current-user-provider';

const tabLabels = ['Контактные данные', 'Вопросы'];

export default function QuizPage() {
  const currentQuiz = useCurrentUserStore(i => i.quiz);

  const tab = currentQuiz?.stage ?? 0;
 
  const [answers] = useState({ q1: '', q2: '' });

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        maxWidth: 600,
        mx: 'auto',
        overflow: 'visible', // <-- важно
      }}>
        
      <Tabs value={tab} sx={{ mb: 2 }}>
        {tabLabels.map((label, index) => <Tab key={index} label={label} disabled={index > tab} />)}
      </Tabs>

      {tab === 0 && (
        <QuizFirstForm />
      )}

      {tab === 1 && (
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Вопрос 1: Как вы узнали о нас?"
            name="q1"
            value={answers.q1}
            fullWidth
          />
          <TextField
            label="Вопрос 2: Что вы ожидаете от продукта?"
            name="q2"
            value={answers.q2}
            fullWidth
          />
          <Button variant="contained">
            Отправить
          </Button>
        </Box>
      )}
    </Paper>
  );
}
