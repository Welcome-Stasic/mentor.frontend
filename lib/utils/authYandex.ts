import { JWT } from 'next-auth/jwt';
import { API } from '../axios';
import { Mutex } from 'async-mutex';
import { IYandexLoginDto } from '../axios/types/auth';

const refreshMutex = new Mutex();

export async function authYandex(token: JWT, payload: IYandexLoginDto): Promise<JWT> {
  return refreshMutex.runExclusive(async () => {
    try {
      const response = await API.auth.yandexLogin(payload);
      console.log(response);
      const accessToken = response?.Result?.accessToken || null;
      const refreshToken = response?.Result?.refreshToken || null;
      const refreshTokenExpires = response?.Result?.refreshTokenExpires || null;

      if (response?.StatusCode === 401 || !accessToken || !refreshToken || !refreshTokenExpires) {
        return { ...token, error: 'RefreshTokenInvalid', refreshTokenValid: false };
      }

      return {
        ...token,
        accessToken,
        refreshToken,
        refreshTokenExpires: new Date(refreshTokenExpires).getTime(),
        lastChecked: Date.now(),
        refreshTokenValid: true,
      };
    } catch {
      return { ...token, error: 'RefreshTokenError', refreshTokenValid: false };
    }
  });
}