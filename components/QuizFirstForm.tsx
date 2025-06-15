'use client';

import {
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Box,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { PhoneNumberMaskCustom } from './PhoneNumberMaskCustom';
import { useState, DragEvent, ChangeEvent } from 'react';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 МБ
const ALLOWED_FORMATS = ['image/jpeg', 'image/png'];

type FormData = {
  lastName: string;
  firstName: string;
  middleName: string;
  place: string;
  phoneNumber: string;
  birthDate: Date;
  photo: File;
  isAccepted: boolean;
};

export default function QuizFirstForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const [dragActive, setDragActive] = useState(false);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log('Submitted data:', data);
    reset();
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files.length === 0) return;

    const file = files[0];
  };

  const handleContactChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked, files } = e.target;

    if (name === 'photo' && files) {
      const file = files[0];
      if (!file) return;
    }
  };

  return (
    <Box
      component="form"
      display="flex"
      flexDirection="column"
      gap={2}
      onSubmit={handleSubmit(onSubmit)}>
      <TextField
        {...register('lastName', {
          required: 'Поле обязателено для заполнения',
        })}
        label="Фамилия"
        fullWidth
        error={!!errors.lastName}
        helperText={errors.lastName ? errors.lastName.message : ''}
      />
      <TextField
        {...register('firstName', {
          required: 'Поле обязателено для заполнения',
        })}
        label="Имя"
        fullWidth
        error={!!errors.firstName}
        helperText={errors.firstName ? errors.firstName.message : ''}
      />
      <TextField
        {...register('middleName')}
        label="Отчество"
        fullWidth
        error={!!errors.middleName}
        helperText={errors.middleName ? errors.middleName.message : ''}
      />
      <TextField
        {...register('place', {
          required: 'Поле обязателено для заполнения',
        })}
        label="Место проживания"
        fullWidth
        error={!!errors.place}
        helperText={errors.place ? errors.place.message : ''}
      />
      <FormControl
        {...register('phoneNumber', {
          required: 'Поле обязателено для заполнения',
        })}
        fullWidth
        error={!!errors.phoneNumber}>
        <InputLabel htmlFor="component-outlined">Номер телефона</InputLabel>
        <OutlinedInput
          id="component-outlined"
          label="Номер телефона"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          inputComponent={PhoneNumberMaskCustom as any}
        />
      </FormControl>

      <TextField
        {...register('birthDate', {
          required: 'Поле обязателено для заполнения',
        })}
        label="Дата рождения"
        slotProps={{ inputLabel: { shrink: true } }}
        fullWidth
        error={!!errors.birthDate}
        helperText={errors.birthDate ? errors.birthDate.message : ''}
        type="date"
      />
      <Box
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          border: '2px dashed',
          borderColor: dragActive ? 'primary.main' : 'grey.400',
          borderRadius: 1,
          height: 120,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: dragActive ? 'action.hover' : 'transparent',
          transition: 'background-color 0.3s',
          color: 'text.secondary',
          userSelect: 'none',
          position: 'relative',
        }}>
        {false ? (
          <Typography>Файл загружен: </Typography>
        ) : (
          <Typography>
            Перетащите фото сюда или нажмите ниже, чтобы выбрать файл (JPG, PNG, до 2 МБ)
          </Typography>
        )}
      </Box>

      {/* Кнопка выбора файла */}
      <Button variant="outlined" component="label" sx={{ mt: 1 }}>
        Выбрать файл
        <input
          hidden
          accept="image/jpeg,image/png"
          type="file"
          name="photo"
          onChange={handleContactChange}
        />
      </Button>

      <FormControlLabel
        control={
          <Checkbox
            {...register('isAccepted', {
              required: 'Поле обязателено для заполнения',
            })}
          />
        }
        label="Я согласен(на) на обработку персональных данных"
      />
      <Button variant="contained" type="submit">
        Далее
      </Button>
    </Box>
  );
}
