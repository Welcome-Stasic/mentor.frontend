
import { IProjectVm } from '@/lib/axios/types/project';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  FormLabel,
  TextField,
} from '@mui/material';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

interface ITimeDialog {
  project?: IProjectVm | null;
  type: 'update' | 'create';
  open: boolean;
  handleClose: () => void;
  handleMutate: (dto: IProjectDialogFormData) => void;
  isLoading: boolean;
}
export interface IProjectDialogFormData {
  name: string;
}

const ProjectDialog = ({
  type,
  open,
  handleClose,
  handleMutate,
  isLoading,
  project = null,
}: ITimeDialog) => {
  const title = type === 'create' ? 'Добавить проект' : 'Редактирование проекта';
  const btnName = type === 'create' ? 'Создать' : 'Изменить';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IProjectDialogFormData>();

  useEffect(() => {
    if (project) {
      reset({
        name: project.name ?? '',
      });
    }
  }, [project, reset]);

  const onSubmit: SubmitHandler<IProjectDialogFormData> = async (data) => {
    handleMutate(data);
    handleClose();
    reset();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box
          width={{ sm: 300 }}
          component="form"
          display="flex"
          flexDirection="column"
          gap={2}
          onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth error={!!errors.name}>
            <FormLabel sx={{ mb: 1 }}>Название проекта</FormLabel>
            <TextField
              multiline
              placeholder="Введите название проекта"
              minRows={2}
              {...register('name', { required: true })}
              error={!!errors.name}
            />
            <FormHelperText>{errors.name?.message}</FormHelperText>
          </FormControl>

          <DialogActions>
            <Button onClick={handleClose} variant="outlined" color="error">
              Отмена
            </Button>
            <Button
              type="submit"
              autoFocus
              variant="contained"
              color="success"
              disabled={isLoading}>
              {btnName}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDialog;
