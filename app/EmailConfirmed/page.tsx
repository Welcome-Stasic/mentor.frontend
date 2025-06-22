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

type PageProps = {
  searchParams: Promise<SearchParams>;
};

const pageSearchParams = {
  userId: parseAsString.withDefault(''),
  token: parseAsString.withDefault(''),
};

const loadSearchParams = createLoader(pageSearchParams);

export default async function EmailConfirmed({ searchParams }: PageProps) {
  const { token } = await loadSearchParams(searchParams);

  const session = await getServerSession(authOptions);
  const accessToken = session?.user.accessToken ?? token;

  const { email } = decodeToken(accessToken);

  const response = await API.auth.isEmailConfirmed(email);

  const isEmailConfirmed = response?.Result || false;

  return (
    <BackGroundImageWrapper>
      <OverlayMessage
        title={isEmailConfirmed ? 'Почта подтверждена' : 'Ошибка подтверждения'}
        message={
          isEmailConfirmed ? 'Спасибо за регистрацию!' : 'Ваша электронная почта не подтверждена.'
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
    </BackGroundImageWrapper>
  );
}
