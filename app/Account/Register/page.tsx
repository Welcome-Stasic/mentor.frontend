import { Typography } from '@mui/material';
import { SITE_BASE_NAME } from '@/constants';
import RegisterForm from '@/components/RegisterForm';

export default async function RegisterPage()  {
  return (
    <>
      {/* Заголовок */}
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {SITE_BASE_NAME}. Регистрация
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Зарегистрироваться в системе
      </Typography>
      
      {/* Форма */}
      <RegisterForm />
    </>
  );
}
