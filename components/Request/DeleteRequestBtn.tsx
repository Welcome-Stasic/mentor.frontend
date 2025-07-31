import { useDeleteQuiz } from '@/hooks/useDeleteQuiz';
import { IQuiz } from '@/lib/axios/types/quiz';
import { Delete } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

interface IDeleteRequestBtnProps {
  quiz: IQuiz;
  disable?: boolean;
}

export const DeleteRequestBtn = ({ quiz, disable = false }: IDeleteRequestBtnProps) => {
  const deleteQuiz = useDeleteQuiz();

  const handleDelete = async () => {
    const confirmed = confirm(`Удалить анкету?`);
    if (confirmed) {
      await deleteQuiz.mutateAsync(quiz.id);
    }
  };

  return (
    <Tooltip title="Удалить анкету">
      <IconButton
        color="error"
        onClick={handleDelete}
        loading={deleteQuiz.isPending}
        disabled={disable}>
        <Delete />
      </IconButton>
    </Tooltip>
  );
};
