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
import { SubmitHandler, useForm } from 'react-hook-form';

interface ITimeDialog {
  time: IWorkTime;
  type: 'update' | 'create';
  open: boolean;
  handleClose: () => void;
}

interface IFormData {
  task: string;
  description: string;
  minutes: number | null;
  project?: string;
}

const TimeDialog = ({ time, type, open, handleClose }: ITimeDialog) => {
  const appTimeType = time.type === 2;

  const title = type === 'create' ? 'Добавить задачу' : 'Редактирование задачи';
  const btnName = type === 'create' ? 'Создать' : 'Изменить';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormData>({
    defaultValues: {
      minutes: time.minutes,
      task: time.task,
      description: time.comment,
    },
  });

  const updateWorkTime = useUpdateWorkTime();

  const onSubmit: SubmitHandler<IFormData> = async (data) => {
    const body: IUpdateTimeDto = {
      entityId: time.entityId,
      type: time.type,
      minutes: data.minutes ?? null,
      comment: data.description,
      task: data.task,
    };

    await updateWorkTime.mutateAsync(body);
    handleClose();
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
                  if (appTimeType && !value) {
                    return 'Поле обязательно';
                  }

                  return true;
                },
              })}
              error={!!errors.task}
              disabled={!appTimeType}
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
                  if (appTimeType && !value) {
                    return 'Поле обязательно';
                  }

                  return true;
                },
              })}
              error={!!errors.description}
              disabled={!appTimeType}
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
            <Button type="submit" autoFocus variant="contained" color="success">
              {btnName}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default TimeDialog;
