import { useDeleteUser } from '@/hooks/user/useDeleteUser';
import { IApplicationUser } from '@/lib/axios/types/user';
import { useCurrentUserStore } from '@/providers/current-user-provider';
import { Delete } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

interface IDeleteUserBtnProps {
  user: IApplicationUser;
}

export const DeleteUserBtn = ({ user }: IDeleteUserBtnProps) => {
  const isAdmin = useCurrentUserStore((i) => i.isAdmin);

  const deleteUser = useDeleteUser();

  const handleDelete = async () => {
    const confirmed = confirm(`Удалить анкету?`);
    if (confirmed) {
      await deleteUser.mutateAsync(user.id);
    }
  };

  if (!isAdmin) return;

  return (
    <Tooltip title="Удалить пользователя">
      <IconButton
        color="error"
        onClick={handleDelete}
        loading={deleteUser.isPending}
        disabled={!isAdmin}>
        <Delete />
      </IconButton>
    </Tooltip>
  );
};
