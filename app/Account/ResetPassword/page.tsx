import { Typography } from '@mui/material';
import { SITE_BASE_NAME } from '@/constants';
import ResetPasswordForm from '@/components/ResetPasswordForm';

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
})  {
  const rawToken = (await searchParams).token;
  const token = Array.isArray(rawToken) ? rawToken[0] : rawToken ?? '';
  
  const rawEmail = (await searchParams).email;
  const email  = Array.isArray(rawEmail) ? rawEmail[0] : rawEmail ?? '';


  return (
    <>
      {/* Заголовок */}
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {SITE_BASE_NAME}. Смена пароля
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Cмена пароля в системе
      </Typography>

      {/* Форма */}
      <ResetPasswordForm  email={email} token={token}/>
    </>
  );
}
