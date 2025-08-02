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
import { IProjectVm } from '@/lib/axios/types/project';
import { useDeleteProject } from '@/hooks/project/useDeleteProject';

interface Props {
  project: IProjectVm;
}

const DeleteProjectWithConfirmationBtn = ({ project }: Props) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const deleteProject = useDeleteProject();

  const handleConfirm = async () => {
    await deleteProject.mutateAsync(project.id);
    handleClose();
  };

  return (
    <>
      <IconButton color="error" onClick={handleOpen} aria-label={`Удалить элемент ${project.name}`}>
        <DeleteIcon />
      </IconButton>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите удалить проект{' '}
            <strong>{project.name}</strong>?
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
            loading={deleteProject.isPending}>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteProjectWithConfirmationBtn;
