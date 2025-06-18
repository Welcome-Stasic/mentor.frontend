'use client';

import OverlayMessage from '@/components/OverlayMessage';
import { API } from '@/lib/axios';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Link } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useTokenSignIn } from '@/hooks/useTokenSignIn';
import { useSession } from 'next-auth/react';
import { useEffect, useState, Suspense } from 'react';

function EmailConfirmedInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  useTokenSignIn(token);

  const session = useSession();
  const [isEmailConfirmed, setIsEmailConfirmed] = useState<boolean>(false);

  useEffect(() => {
    const checkEmailConfirmation = async () => {
      const email = session.data?.user.email;

      if (email) {
        try {
          const confirmed = await API.auth.isEmailConfirmed(email);
          setIsEmailConfirmed(confirmed?.Result || false);
        } catch {
          setIsEmailConfirmed(false);
        }
      }
    };

    checkEmailConfirmation();
  }, [session]);

  if (isEmailConfirmed === null) return null;

  return (
    <OverlayMessage
      title={isEmailConfirmed ? 'Почта подтверждена' : 'Ошибка подтверждения'}
      message={
        isEmailConfirmed
          ? 'Спасибо! Ваша электронная почта успешно подтверждена.'
          : 'Ваша электронная почта не подтверждена.'
      }
      blurBackground
      blurPercent={50}
      icon={
        isEmailConfirmed ? (
          <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60 }} />
        ) : (
          <ErrorOutlineIcon color="error" sx={{ fontSize: 60 }} />
        )
      }>
      <Link href="/" underline="always" sx={{ pt: 1, display: 'block' }}>
        На главную
      </Link>
    </OverlayMessage>
  );
}

export default function EmailConfirmed() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <EmailConfirmedInner />
    </Suspense>
  );
}
