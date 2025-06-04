import { Typography } from '@mui/material';
import { redirect } from 'next/navigation';
import { getExpireToken } from '@/mentorApi';
import CountdownTimer from '@/components/CountdownTimer';
import { SITE_BASE_NAME } from '@/constants';
import RegisterForm from '@/components/RegisterForm';

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
})  {
  const rawToken = (await searchParams).token;
  const token = Array.isArray(rawToken) ? rawToken[0] : rawToken ?? '';

  const result = await getExpireToken(token);
  const tokenBody = result?.Result ?? null;

  const isTokenValid =
    tokenBody?.token === token &&
    tokenBody.expiresAt &&
    new Date(tokenBody.expiresAt).getTime() > Date.now();

  if (!isTokenValid) {
    redirect('/Expired');
  }

  return (
    <>
      {/* Заголовок */}
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {SITE_BASE_NAME}. Регистрация
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Зарегистрироваться в системе
      </Typography>

      {tokenBody?.expiresAt && <CountdownTimer expiresAt={tokenBody.expiresAt} />}

      {/* Форма */}
      <RegisterForm />
    </>
  );
}
