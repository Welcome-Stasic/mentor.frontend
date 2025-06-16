'use client';

import { resetPasswordDto } from '@/mentorApi';
import { resetPassword } from '@/mentorApi/request/resetPassword';
import { Button, TextField, Grid, Typography } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

interface ResetPasswordFormProps {
  email: string;
  token: string;
}

export default function ResetPasswordForm({ email, token }: ResetPasswordFormProps) {
    const [isSuccessReset, setIsSuccessReset] = useState(false);
      
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const body = {
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      token: token,
    } as resetPasswordDto;
    
    const result = await resetPassword(body);
    
    reset();

    const isSuccess = result?.Result ?? false;

    setIsSuccessReset(isSuccess);  
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
      <Grid container spacing={2} direction="column">
        <TextField
          {...register('email', {
            required: 'Почта обязателена',
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
        />
        <Grid>
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
        </Grid>
        <Grid>
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
        </Grid>
        {isSuccessReset && (
          <Grid>
            <Typography color="success.main" variant="body2">
              Пароль успешно изменен. Вы можете <Link href="/">войти в систему</Link> с новым паролем.
            </Typography>
          </Grid>
        )}
        <Grid>
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
      </Grid>
    </form>
  );
}
