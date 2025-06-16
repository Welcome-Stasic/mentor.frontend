/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  Box,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { PhoneNumberMaskCustom } from './PhoneNumberMaskCustom';
import { PhotoDropzone } from './PhotoDropzone'; // ⬅️ импортируем компонент

type FormData = {
  lastName: string;
  firstName: string;
  middleName?: string;
  place: string;
  phoneNumber: string;
  birthDate: string;
  photo: File | null;
  isAccepted: boolean;
};

export default function QuizFirstForm() {
  const {
    register,
    handleSubmit,
    control,
    setError,
    clearErrors,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      photo: null,
    },
  });


  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log('Submitted:', data);

    reset();
  };

  return (
    <Box
      component="form"
      display="flex"
      flexDirection="column"
      gap={2}
      onSubmit={handleSubmit(onSubmit)}>
      <TextField
        {...register('lastName', { required: 'Поле обязательно' })}
        label="Фамилия"
        fullWidth
        error={!!errors.lastName}
        helperText={errors.lastName?.message}
      />
      <TextField
        {...register('firstName', { required: 'Поле обязательно' })}
        label="Имя"
        fullWidth
        error={!!errors.firstName}
        helperText={errors.firstName?.message}
      />
      <TextField {...register('middleName')} label="Отчество" fullWidth />
      <TextField
        {...register('place', { required: 'Поле обязательно', minLength: { value: 3, message: 'Минимум 3 символа' } })}
        label="Место проживания"
        fullWidth
        error={!!errors.place}
        helperText={errors.place?.message}
      />
      <Controller
        name="phoneNumber"
        control={control}
        rules={{ required: 'Поле обязательно' }}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.phoneNumber}>
            <InputLabel htmlFor="phone-input">Номер телефона</InputLabel>
            <OutlinedInput
              id="phone-input"
              label="Номер телефона"
              inputComponent={PhoneNumberMaskCustom as any}
              {...field}
            />
          </FormControl>
        )}
      />
      <TextField
        {...register('birthDate', { required: 'Поле обязательно' })}
        label="Дата рождения"
        type="date"
        fullWidth
        slotProps={{ inputLabel: { shrink: true } }}
        error={!!errors.birthDate}
        helperText={errors.birthDate?.message}
      />

      {/* Фото через кастомный компонент */}
      <Controller
        name="photo"
        control={control}
        rules={{ required: 'Загрузите свою фотографию' }}
        render={({ field, fieldState }) => (
          <PhotoDropzone
            field={field}
            error={fieldState.error}
            onFileError={(message) => {
              if (message) {
                setError('photo', { message });
                field.onChange(null); // сброс файла
              } else {
                clearErrors('photo');
              }
            }}
          />
        )}
      />

      <FormControlLabel
        control={
          <Checkbox
            {...register('isAccepted', {
              required: 'Поле обязательно',
            })}
          />
        }
        label="Я согласен(на) на обработку персональных данных"
      />
      {errors.isAccepted && <Typography color="error">{errors.isAccepted.message}</Typography>}
      <Button variant="contained" type="submit">
        Далее
      </Button>
    </Box>
  );
}
