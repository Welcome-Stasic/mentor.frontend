'use client';

import {
  Button,
  TextField,
  Grid,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
} from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useState } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { authCrmLogin, loginDto } from '@/mentorApi';
import { redirect } from 'next/navigation';

type FormData = {
  login: string;
  password: string;
  isElma: boolean;
};

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const body = {
      login: data.login,
      password: data.password,
    } as loginDto;

    reset();

    if (data.isElma) {
      const authResult = await authCrmLogin(body);

      if (authResult?.Result && authResult?.Result === 'CRM login successful') redirect('/');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
      <Grid container spacing={2} direction="column">
        <TextField
          {...register('login', {
            required: 'Логин обязателен',
            minLength: {
              value: 6,
              message: 'Некорректный логин',
            },
          })}
          label="Логин или почта"
          variant="outlined"
          fullWidth
          error={!!errors.login}
          helperText={errors.login ? errors.login.message : ''}
        />
        <Grid>
          <FormControl fullWidth variant="outlined" error={!!errors.password} sx={{ mb: 2 }}>
            <InputLabel htmlFor="outlined-adornment-password">Пароль</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? 'text' : 'password'}
              label="Пароль"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    edge="end"
                    aria-label="toggle password visibility">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              {...register('password', {
                required: 'Пароль обязателен',
                minLength: {
                  value: 6,
                  message: 'Пароль должен содержать минимум 6 символов',
                },
              })}
            />
            {errors.password && <FormHelperText>{errors.password.message}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid>
          <FormControlLabel
            control={<Checkbox {...register('isElma')} />}
            label="Вход через BPM ELMA?"
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
            Войти
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
