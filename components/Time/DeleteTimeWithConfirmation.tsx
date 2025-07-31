import React, { useState } from 'react';
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { IWorkTime } from '@/lib/axios/types/time';
import { useDeleteWorkTime } from '@/hooks/useDeleteWorkTime';

interface Props {
  time: IWorkTime;
  disable?: boolean;
}

const DeleteTimeBtnWithConfirmation = ({ time, disable = false }: Props) => {
  const totalWorkMinutes = time.minutes ?? 0;

  const workHours = Math.floor(totalWorkMinutes / 60);
  const workMinutes = totalWorkMinutes % 60;
  const formattedWorkTime = `${workHours}:${workMinutes.toString().padStart(2, '0')}`;

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const deleteWorkTime = useDeleteWorkTime();

  const handleConfirm = async () => {
    await deleteWorkTime.mutateAsync({ entityId: time.entityId, type: time.type });
    handleClose();
  };

  return (
    <>
      <IconButton
        color="error"
        onClick={handleOpen}
        aria-label={`Удалить элемент ${time}`}
        disabled={disable}>
        <DeleteIcon />
      </IconButton>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите удалить задачу с трудозатратами{' '}
            <strong>{formattedWorkTime} ч</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            Отмена
          </Button>
          <Button
            onClick={handleConfirm}
            color="error"
            variant="contained"
            autoFocus
            loading={deleteWorkTime.isPending}>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteTimeBtnWithConfirmation;
