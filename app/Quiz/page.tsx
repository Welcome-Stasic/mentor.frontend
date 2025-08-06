import { Paper } from '@mui/material';
import QuizContainer from '@/components/Quiz/QuizContainer';

export default function QuizPage() {
  return (
    <Paper
      elevation={3}
      sx={{
        position: 'relative',
        p: 3,
        maxWidth: 800,
        mx: 'auto',
        overflow: 'visible', // <-- важно
      }}>
      <QuizContainer />
    </Paper>
  );
}
