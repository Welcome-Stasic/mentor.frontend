import { useDeleteUser } from '@/hooks/user/useDeleteUser';
import { IQuiz } from '@/lib/axios/types/quiz';
import { Delete } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

interface IDeleteRequestBtnProps {
  quiz: IQuiz;
  disable?: boolean;
}

export const DeleteRequestBtn = ({ quiz, disable = false }: IDeleteRequestBtnProps) => {
  const deleteUser = useDeleteUser();

  const handleDelete = async () => {
    const confirmed = confirm(`Удалить анкету?`);
    if (confirmed) {
      await deleteUser.mutateAsync(quiz.applicationUserId);
    }
  };

  return (
    <Tooltip title="Удалить анкету">
      <IconButton
        color="error"
        onClick={handleDelete}
        loading={deleteUser.isPending}
        disabled={disable}>
        <Delete />
      </IconButton>
    </Tooltip>
  );
};
