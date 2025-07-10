import { JWT } from 'next-auth/jwt';
import { API } from '../axios';
import { Mutex } from 'async-mutex';

export const GRACE_SEC = 30;

const refreshMutex = new Mutex();

export async function refreshAccessToken(token: JWT): Promise<JWT> {
  return refreshMutex.runExclusive(async () => {
    try {
      const response = await API.auth.refreshToken(token.accessToken, token.refreshToken);

      const accessToken = response?.Result?.accessToken || null;
      const refreshToken = response?.Result?.refreshToken || null;
      const refreshTokenExpires = response?.Result?.refreshTokenExpires || null;

      if (!accessToken || !refreshToken || !refreshTokenExpires) {
        return { ...token, error: 'RefreshTokenError' };
      }

      return {
        ...token,
        accessToken,
        refreshToken,
        refreshTokenExpires: new Date(refreshTokenExpires).getTime(),
      };
    } catch {
      return { ...token, error: 'RefreshTokenError' };
    }
  });
}