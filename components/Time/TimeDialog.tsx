import { useProjects } from '@/hooks/project/useProjects';
import { useUpdateWorkTime } from '@/hooks/useUpdateWorkTime';
import { IProjectVm } from '@/lib/axios/types/project';
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
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

interface ITimeDialog {
  time?: IWorkTime | null;
  type: 'update' | 'create';
  open: boolean;
  handleClose: () => void;
  handleMutate: (dto: ITimeDialogFormData) => void;
  isLoading: boolean;
  projects: IProjectVm[];
}
export interface ITimeDialogFormData {
  task: string;
  description?: string;
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
  projects,
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
      project: time?.project ?? '',
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
        project: time?.project ?? '',
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
          width={{ sm: 300 }}
          component="form"
          display="flex"
          flexDirection="column"
          gap={2}
          onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth error={!!errors.task}>
            <FormLabel sx={{ mb: 1 }}>Задача</FormLabel>
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

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>Проект</FormLabel>
            <Select defaultValue="" {...register('project')} disabled={!isEditable} displayEmpty>
              <MenuItem value="">
                <em>Без проекта</em>
              </MenuItem>
              {projects?.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.project?.message}</FormHelperText>
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>Описание задачи</FormLabel>
            <TextField
              multiline
              placeholder="Введите описание задачи"
              minRows={2}
              {...register('description')}
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

export default TimeDialog;
