import { JWT } from 'next-auth/jwt';
import { API } from '../axios';
import { Mutex } from 'async-mutex';


const refreshMutex = new Mutex();

export async function checkAccessToken(token: JWT): Promise<boolean> {
  return refreshMutex.runExclusive(async () => {
    try {
      const response = await API.auth.isValidRefreshToken(token.accessToken, token.refreshToken);
      
      if (response?.StatusCode === 401) return false;

      const isValid = response?.Result || false;

      return isValid;
    } catch {
      return false;
    }
  });
}
