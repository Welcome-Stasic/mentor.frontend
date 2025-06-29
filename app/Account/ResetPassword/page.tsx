import { Typography } from '@mui/material';
import { SITE_BASE_NAME } from '@/constants';
import ResetPasswordForm from '@/components/ResetPassword/ResetPasswordForm';

export default async function ResetPasswordPage() {
  return (
    <>
      {/* Заголовок */}
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {SITE_BASE_NAME}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Смена пароля в системе
      </Typography>

      {/* Форма */}
      <ResetPasswordForm />
    </>
  );
}
