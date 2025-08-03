import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Link } from '@mui/material';
import OverlayMessage from '@/components/OverlayMessage';
import { API } from '@/lib/axios';
import { createLoader, parseAsString } from 'nuqs/server';
import type { SearchParams } from 'nuqs/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/options';
import { decodeToken } from '@/lib/utils/decodeToken';
import BackGroundImageWrapper from '@/components/BackGroundImageWrapper';
import { redirect } from 'next/navigation';
import { signInWithProvider } from '../api/auth/[...nextauth]/signInWithProvider';

interface IPageProps {
  searchParams: Promise<SearchParams>;
}

const pageSearchParams = {
  userId: parseAsString.withDefault(''),
  token: parseAsString.withDefault(''),
};

const loadSearchParams = createLoader(pageSearchParams);

export default async function EmailConfirmed({ searchParams }: IPageProps) {
  const { token } = await loadSearchParams(searchParams);

  const session = await getServerSession(authOptions);
  const accessToken = session?.user?.accessToken || token;

  const handleRedirect = () => redirect('/not-found');

  if (!accessToken) handleRedirect();

  const decoded = decodeToken(accessToken);

  if (!decoded?.email) handleRedirect();

  const response = await API.auth.isEmailConfirmed(decoded.email);

  const isEmailConfirmed = response?.Result || false;

  const title = isEmailConfirmed ? 'Почта подтверждена' : 'Ошибка подтверждения';
  const message = isEmailConfirmed
    ? 'Спасибо за регистрацию!'
    : 'Ваша электронная почта не подтверждена.';

  const icon = isEmailConfirmed ? (
    <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60 }} />
  ) : (
    <ErrorOutlineIcon color="error" sx={{ fontSize: 60 }} />
  );

  await signInWithProvider('token', {
    token: accessToken,
    redirect: false,
  });

  return (
    <BackGroundImageWrapper>
      <OverlayMessage title={title} message={message} blurBackground blurPercent={50} icon={icon}>
        <Link href="/" underline="always" sx={{ pt: 1, display: 'block' }}>
          На главную
        </Link>
      </OverlayMessage>
    </BackGroundImageWrapper>
  );
}
