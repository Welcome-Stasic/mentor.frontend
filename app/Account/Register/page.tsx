import { Typography } from '@mui/material';
import { SITE_BASE_NAME } from '@/app/constants';
import RegisterForm from '@/app/components/RegisterForm';
import CountdownTimer from '@/app/components/CountdownTimer';
import { redirect } from 'next/navigation';
import { use } from 'react';
import { getExpireToken } from '@/mentorApi';

type RegisterPageProps = {
  searchParams: {
    token: string;
  };
};

export default function RegisterPage({ searchParams }: RegisterPageProps) {
  const { token } = searchParams;

  const result = use(getExpireToken(token));
  const tokenBody = result?.Result ?? null;

  const isTokenValid =
    tokenBody?.token === token && tokenBody.expiresAt && new Date(tokenBody.expiresAt).getTime() > Date.now();

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

      {tokenBody?.expiresAt && <CountdownTimer expiresAt={tokenBody.expiresAt}/>}

      {/* Форма */}
      <RegisterForm />
    </>
  );
}
