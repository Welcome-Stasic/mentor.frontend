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
  Typography,
} from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useState } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { appLoginDto, authCrmLogin, authLogin, crmLoginDto, forgotPassword } from '@/mentorApi';
import { redirect } from 'next/navigation';
import { setCookie } from 'cookies-next';
import { jwtDecode } from 'jwt-decode';

type FormData = {
  login: string;
  password: string;
  isElma: boolean;
  forgotPassword: boolean;
};

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>();

  const isElma = watch('isElma');
  const isForgotPassword = watch('forgotPassword');

  const setTokenAndRedirect = (token: string) => {
    const decoded = jwtDecode(token);

    setCookie('token', token, {
      maxAge: decoded.exp,
      path: '/',
      sameSite: 'none',
      secure: true,
    });

    redirect('/');
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {

    if (!data.isElma && data.forgotPassword) {
      await forgotPassword(data.login);
      setEmailSent(true);
      reset();
      return;
    }

    if (data.isElma) {
      const body: crmLoginDto = {
        login: data.login,
        password: data.password,
      };

      const authResult = await authCrmLogin(body);

      if (authResult?.Result) {
        setTokenAndRedirect(authResult.Result);
      }
    } else {
      const body: appLoginDto = {
        email: data.login,
        password: data.password,
      };

      const authResult = await authLogin(body);

      if (authResult?.Result) {
        setTokenAndRedirect(authResult.Result);
      }
    }
    
    reset();
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
          label={isElma ? 'Логин от ELMA' : 'Почта'}
          variant="outlined"
          fullWidth
          error={!!errors.login}
          helperText={errors.login ? errors.login.message : ''}
        />
        {!isForgotPassword && (
          <Grid>
            <FormControl fullWidth variant="outlined" error={!!errors.password}>
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
        )}
        
        {!isForgotPassword && (
          <FormControlLabel
            control={<Checkbox {...register('isElma')} />}
            label="Вход через BPM ELMA?"
          />
        )}
        {!isElma && (
          <FormControlLabel
            control={<Checkbox {...register('forgotPassword')} />}
            label="Забыли пароль?"
          />
        )}
        {emailSent && (
          <Grid>
            <Typography color="success.main" variant="body2">
              На почту было отправлено письмо для восстановления пароля
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
            {isForgotPassword ? 'Сбросить пароль' : 'Войти'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
