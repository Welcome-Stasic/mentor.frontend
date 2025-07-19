import { useDeleteQuiz } from '@/hooks/useDeleteQuiz';
import { Delete } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

interface IDeleteRequestBtnProps {
  quizId: string;
}

export const DeleteRequestBtn = ({ quizId }: IDeleteRequestBtnProps) => {
  const deleteQuiz = useDeleteQuiz();

  const handleDelete = async () => {
    const confirmed = confirm(`Удалить анкету?`);
    if (confirmed) {
      await deleteQuiz.mutateAsync(quizId);
    }
  };

  return (
    <Tooltip title="Удалить анкету">
      <IconButton color="error" onClick={handleDelete} loading={deleteQuiz.isPending}>
        <Delete />
      </IconButton>
    </Tooltip>
  );
};
