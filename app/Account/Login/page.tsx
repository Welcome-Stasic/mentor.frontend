import {
  Typography,
} from '@mui/material';

import { SITE_BASE_NAME } from '@/app/constants';
import LoginForm from '@/app/components/LoginForm';

export default function LoginPage() {
  return (
    <>
      {/* Заголовок */}
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {SITE_BASE_NAME}. Авторизация
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Войдите в систему
      </Typography>

      {/* Форма */}
      <LoginForm />
    </>
  );
}
