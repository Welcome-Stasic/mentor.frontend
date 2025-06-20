'use client';

import { API } from '@/lib/axios';
import { IRegisterDto } from '@/lib/axios/types/auth';
import { Button, TextField, Grid } from '@mui/material';
import { redirect } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterForm() {
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
    } as IRegisterDto;
    
    const result = await API.auth.register(body);

    if(result?.Result){
      reset();
      redirect('/Account/Login');
    }
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
            Регистрация
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
