import { useQuizStatues } from '@/hooks/useQuizStatues';
import { useUpdateQuiz } from '@/hooks/useUpdateQuiz';
import { IQuiz, IQuizStatus } from '@/lib/axios/types/quiz';
import { useCurrentUserStore } from '@/providers/current-user-provider';
import { Box, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';

interface IUpdateStatusRequestProps {
  quiz: IQuiz;
  statues: IQuizStatus[];
}

const UpdateStatusRequest = ({ quiz, statues }: IUpdateStatusRequestProps) => {
  const isAdmin = useCurrentUserStore((store) => store.isAdmin);

  const updateQuiz = useUpdateQuiz();

  const handleOnChange = async (event: SelectChangeEvent) => {
    const statusId = event.target.value;
    await updateQuiz.mutateAsync({ quizId: quiz.id, statusId: statusId });
  };

  if (!isAdmin) return;

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 0.5 }}>
        <strong>Статус:</strong>
      </Typography>
      <Select
        value={quiz.statusId || ''}
        onChange={handleOnChange}
        size="small"
        fullWidth
        disabled={!isAdmin || updateQuiz.isPending}>
        {statues?.map((status) => (
          <MenuItem key={status.id} value={status.id}>
            {status.name}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default UpdateStatusRequest;
