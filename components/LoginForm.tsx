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
import BackdropLoader from './BackdropLoader';

type FormData = {
  login: string;
  password: string;
  isElma: boolean;
  forgotPassword: boolean;
};

export default function LoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const displayError = error ? errorMessages[error] || errorMessages.default : null;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>();

  const isElma = watch('isElma');
  const isForgotPassword = watch('forgotPassword');

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    if (!data.isElma && data.forgotPassword) {
      await API.auth.forgotPassword(data.login);
      setEmailSent(true);
      reset();
      setIsLoading(false);

      return;
    }

    await handleSignIn(data.login, data.password, data.isElma);

    setIsLoading(false);

    reset();
  };

  return (
    <>
      <BackdropLoader open={isLoading} />
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
          {displayError && (
            <Typography color="error" variant="body2">
              {displayError}
            </Typography>
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
    </>
  );
}
