'use client';

import { API } from '@/lib/axios';
import { IResetPasswordDto } from '@/lib/axios/types/auth';
import { Button, TextField, Grid, Typography } from '@mui/material';
import Link from 'next/link';
import { parseAsString } from 'nuqs/server';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useQueryState } from 'nuqs';
import { useTrafficSource } from '@/hooks/useTrafficSource';

interface IFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordClientForm() {
  const [email, setEmail] = useQueryState('email', parseAsString.withDefault(''));
  const [token, setToken] = useQueryState('token', parseAsString.withDefault(''));

  const [isSuccessReset, setIsSuccessReset] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const traffic = useTrafficSource();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormData>();

  const onSubmit: SubmitHandler<IFormData> = async (data) => {
    setErrorMessage('');
    setIsSuccessReset(false);

    const body = {
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      token: token,
    } as IResetPasswordDto;

    const result = await API.auth.resetPassword(body);

    const isSuccess = result?.Result ?? false;

    setIsSuccessReset(isSuccess);

    if (result?.Errors) {
      setErrorMessage(`${result.Message} (${result.Errors.join(', ')})`);
    }

    if (isSuccess) {
      reset();
      setEmail('');
      setToken('');
    }
  };

  return (
    <Grid
      container
      component="form"
      sx={{ width: '100%' }}
      spacing={2}
      direction="column"
      onSubmit={handleSubmit(onSubmit)}>
      <TextField
        {...register('email', {
          required: 'Почта обязательна',
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: 'Некорректный email',
          },
        })}
        label="Почта"
        variant="outlined"
        fullWidth
        error={!!errors.email}
        helperText={errors.email?.message}
        value={email}
        disabled
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
        variant="outlined"
        fullWidth
        type="password"
        error={!!errors.password}
        helperText={errors.password ? errors.password.message : ''}
      />
      <TextField
        {...register('confirmPassword', {
          required: 'Пароль обязателен',
          minLength: {
            value: 6,
            message: 'Пароль должен содержать минимум 6 символов',
          },
        })}
        label="Подтверждение пароля"
        variant="outlined"
        fullWidth
        type="password"
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword ? errors.confirmPassword.message : ''}
      />
      {isSuccessReset && (
        <Typography color="success.main" variant="body2">
          Пароль успешно изменен. Вы можете{' '}
          <Link href="/Account/Login" style={{ color: '#1976d2', textDecoration: 'underline' }}>
            войти в систему
          </Link>{' '}
          с новым паролем.
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
        }}>
        Сменить пароль
      </Button>
    </Grid>
  );
}
