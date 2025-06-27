import LoginForm from '@/components/Login/LoginForm';
import { SITE_BASE_NAME } from '@/constants';
import { Typography } from '@mui/material';

export default function LoginPage() {
  return (
    <>
      {/* Заголовок */}
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {SITE_BASE_NAME}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Войдите в систему
      </Typography>

      {/* Форма */}
      <LoginForm />
    </>
  );
}
