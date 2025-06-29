'use client';

import { API } from '@/lib/axios';
import { IRegisterDto } from '@/lib/axios/types/auth';
import { Button, TextField, Grid, Typography } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useState } from 'react';
import BackdropLoader from '../BackdropLoader';

interface IFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterClientForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<IFormData>();

  const passwordValue = watch('password');

  const onSubmit: SubmitHandler<IFormData> = async (data) => {
    setIsLoading(true);
    setEmailSent(false);
    setErrorMessage('');

    const body: IRegisterDto = {
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    };

    try {
      const registerResult = await API.auth.register(body);

      if (registerResult?.Result) {
        setEmailSent(true);
        reset();
      } else {
      }
    } catch {
      setErrorMessage('Ошибка регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <BackdropLoader open={isLoading} />
      <Grid
        container
        component="form"
        spacing={2}
        direction="column"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ width: '100%' }}>
        <TextField
          {...register('email', {
            required: 'Почта обязательна',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Некорректная почта',
            },
          })}
          label="Почта"
          variant="outlined"
          fullWidth
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          {...register('password', {
            required: 'Пароль обязателен',
            minLength: {
              value: 6,
              message: 'Пароль должен содержать минимум 6 символов',
            },
          })}
          label="Пароль"
          type="password"
          variant="outlined"
          fullWidth
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <TextField
          {...register('confirmPassword', {
            required: 'Подтверждение пароля обязательно',
            validate: (value) => value === passwordValue || 'Пароли не совпадают',
          })}
          label="Подтверждение пароля"
          type="password"
          variant="outlined"
          fullWidth
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
        />

        {emailSent && (
          <Typography color="success.main" variant="body2">
            Мы отправили письмо со ссылкой для подтверждения на указанный вами email. Если вы не
            получили письмо, проверьте папку Спам.
          </Typography>
        )}

        {errorMessage && (
          <Typography color="error" variant="body2">
            {errorMessage}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: '#1976d2',
            color: '#fff',
            textTransform: 'none',
            fontWeight: 'bold',
            ':hover': {
              backgroundColor: '#1565c0',
            },
          }}>
          Регистрация
        </Button>
      </Grid>
    </>
  );
}
