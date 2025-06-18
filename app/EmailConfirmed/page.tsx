import OverlayMessage from '@/components/OverlayMessage';
import { API } from '@/lib/axios';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/options';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Link } from '@mui/material';

export default async function EmailConfirmed() {
  const session = await getServerSession(authOptions);
  const email = session?.user.email || '';
  const isEmailConfirmed = email ? await API.auth.isEmailConfirmed(email) : false;

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
      }
    >
      <Link href="/" underline="always" sx={{ pt: 1, display: 'block' }}>На главную</Link>
    </OverlayMessage>
  );
}
