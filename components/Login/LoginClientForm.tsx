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
import { handleSignIn } from '@/lib/utils/handleSignIn';
import { API } from '@/lib/axios';
import { useSearchParams } from 'next/navigation';
import { errorMessages } from '@/lib/utils/errorMessages';
import BackdropLoader from '../BackdropLoader';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import TokenSignInClient from '../TokenSignInClient';

interface IFormData {
  login: string;
  password: string;
  isElma: boolean;
  forgotPassword: boolean;
}

const validationRules = {
  login: {
    required: 'Логин обязателен',
    minLength: { value: 2, message: 'Некорректный логин' },
  },
  password: {
    required: 'Пароль обязателен',
    minLength: { value: 2, message: 'Пароль должен содержать минимум 2 символа' },
  },
};

export default function LoginClientForm() {
  const searchParams = useSearchParams();
  const queryError = searchParams.get('error');

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    queryError ? errorMessages[queryError] || errorMessages.default : '',
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<IFormData>({
    defaultValues: {
      login: '',
      password: '',
      isElma: false,
      forgotPassword: false,
    },
  });

  const isElma = watch('isElma');
  const isForgotPassword = watch('forgotPassword');

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const onSubmit: SubmitHandler<IFormData> = async (data) => {
    setIsLoading(true);
    setEmailSent(false);
    setErrorMessage('');

    try {
      if (!data.isElma && data.forgotPassword) {
        await API.auth.forgotPassword(data.login);
        setEmailSent(true);
        reset({ login: '', isElma: false, forgotPassword: false, password: '' });
        return;
      }

      await handleSignIn(data.login, data.password, data.isElma);
      reset(); // только после успешной авторизации
    } catch {
      setErrorMessage('Произошла ошибка авторизации');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      {/* <TokenSignInClient accessToken={token} /> */}

      <BackdropLoader open={isLoading} />
      <Grid
        component="form"
        container
        spacing={2}
        direction="column"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ width: '100%' }}>
        <TextField
          {...register('login', validationRules.login)}
          label={isElma ? 'Логин от ELMA' : 'Почта'}
          variant="outlined"
          fullWidth
          error={!!errors.login}
          helperText={errors.login?.message}
        />

        {!isForgotPassword && (
          <FormControl fullWidth variant="outlined" error={!!errors.password}>
            <InputLabel htmlFor="user-password">Пароль</InputLabel>
            <OutlinedInput
              id="user-password"
              type={showPassword ? 'text' : 'password'}
              label="Пароль"
              {...register('password', validationRules.password)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText>{errors.password?.message}</FormHelperText>
          </FormControl>
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
          <Typography color="success.main" variant="body2">
            Письмо для сброса пароля отправлено на почту
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
          disabled={isLoading}
          sx={{
            backgroundColor: '#1976d2',
            color: '#fff',
            textTransform: 'none',
            fontWeight: 'bold',
          }}>
          {isForgotPassword ? 'Сбросить пароль' : 'Войти'}
        </Button>

        <Typography variant="body2" color="text.secondary">
          Нет аккаунта?{' '}
          <Link
            href="/Account/Register"
            style={{
              color: '#1976d2',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'color 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#125ea5')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#1976d2')}>
            Зарегистрируйтесь
          </Link>
        </Typography>
      </Grid>
    </>
  );
}
