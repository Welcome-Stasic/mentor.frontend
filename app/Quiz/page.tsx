'use client';

import { useState, ChangeEvent } from 'react';
import {
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
  Paper,
} from '@mui/material';
import QuizFirstForm from '@/components/QuizFirstForm';


export default function QuizPage() {
  const [tab, setTab] = useState(0);
 
  const [answers, setAnswers] = useState({ q1: '', q2: '' });

  const handleAnswerChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAnswers({ ...answers, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    alert('Ответы отправлены!');
  };

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
        <Tab label="Контактные данные" />
        <Tab
          label="Вопросы"
          disabled={true}
        />
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
            onChange={handleAnswerChange}
            fullWidth
          />
          <TextField
            label="Вопрос 2: Что вы ожидаете от продукта?"
            name="q2"
            value={answers.q2}
            onChange={handleAnswerChange}
            fullWidth
          />
          <Button variant="contained" onClick={handleSubmit}>
            Отправить
          </Button>
        </Box>
      )}
    </Paper>
  );
}
