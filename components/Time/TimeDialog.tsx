import { useUpdateWorkTime } from '@/hooks/useUpdateWorkTime';
import { IUpdateTimeDto, IWorkTime } from '@/lib/axios/types/time';
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
import { useEffect, useMemo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

interface ITimeDialog {
  time?: IWorkTime | null;
  type: 'update' | 'create';
  open: boolean;
  handleClose: () => void;
  handleMutate: (dto: ITimeDialogFormData) => void;
  isLoading: boolean;
}
export interface ITimeDialogFormData {
  task: string;
  description: string;
  minutes: number | null;
  project?: string;
}

const TimeDialog = ({
  type,
  open,
  handleClose,
  handleMutate,
  isLoading,
  time = null,
}: ITimeDialog) => {
  const isEditable = type === 'create' || time?.type === 2;

  const title = type === 'create' ? 'Добавить задачу' : 'Редактирование задачи';
  const btnName = type === 'create' ? 'Создать' : 'Изменить';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ITimeDialogFormData>({
    defaultValues: {
      minutes: time?.minutes ?? null,
      task: time?.task ?? '',
      description: time?.comment ?? '',
    },
  });

  useEffect(() => {
    if (time) {
      reset({
        minutes: time.minutes ?? null,
        task: time.task ?? '',
        description: time.comment ?? '',
      });
    }
  }, [time, reset]);

  const onSubmit: SubmitHandler<ITimeDialogFormData> = async (data) => {
    handleMutate(data);
    handleClose();
    reset();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box
          width={300}
          component="form"
          display="flex"
          flexDirection="column"
          gap={2}
          onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth error={!!errors.task}>
            <FormLabel sx={{ mb: 1 }}>{'Задача'}</FormLabel>
            <TextField
              multiline
              placeholder="Введите задачу"
              minRows={2}
              {...register('task', {
                validate: (value) => {
                  if (isEditable && !value) {
                    return 'Поле обязательно';
                  }

                  return true;
                },
              })}
              error={!!errors.task}
              disabled={!isEditable}
            />
            <FormHelperText>{errors.task?.message}</FormHelperText>
          </FormControl>
          <FormControl fullWidth error={!!errors.task}>
            <FormLabel sx={{ mb: 1 }}>{'Описание задачи'}</FormLabel>
            <TextField
              multiline
              placeholder="Введите описание задачи"
              minRows={2}
              {...register('description', {
                validate: (value) => {
                  if (isEditable && !value) {
                    return 'Поле обязательно';
                  }

                  return true;
                },
              })}
              error={!!errors.description}
              disabled={!isEditable}
            />
            <FormHelperText>{errors.description?.message}</FormHelperText>
          </FormControl>
          <TextField
            label="Затраченное время, мин"
            type="number"
            {...register('minutes', { required: 'Поле обязательно' })}
            error={!!errors.minutes}
            helperText={errors.minutes?.message}
          />
          <DialogActions>
            <Button onClick={handleClose} variant="outlined" color="error">
              Отмена
            </Button>
            <Button type="submit" autoFocus variant="contained" color="success" loading={isLoading}>
              {btnName}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default TimeDialog;
