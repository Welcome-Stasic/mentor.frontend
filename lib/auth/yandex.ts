import { JWT } from 'next-auth/jwt';
import { authYandex } from '../utils/authYandex';

export async function handleYandexLogin(token: JWT, accessToken: string) {
  if (!accessToken || !accessToken.trim()) {
    return {
      ...token,
      accessToken: '',
      refreshTokenValid: false,
      error: 'MissingAccessToken',
    };
  }
  return await authYandex(token, { authCode: accessToken });
}
