import CredentialsProvider from 'next-auth/providers/credentials';
import { decodeToken } from '@/lib/utils/decodeToken';
import { API } from '@/lib/axios';

export const TokenProvider = CredentialsProvider({
  id: 'token',
  name: 'Token Provider',
  credentials: {
    token: { label: 'Token', type: 'text' },
  },
  async authorize(credentials) {
    const accessToken = credentials?.token;
    if (!accessToken) return null;

    try {
      const decoded = decodeToken(accessToken);
      const roles = decoded.roles;
      
      if (!decoded?.id) return null;
      
      const response = await API.auth.getRefreshToken(accessToken);

      const refreshToken = response?.Result?.token || null;
      const refreshTokenExpires = response?.Result?.expires || null;

      if (!accessToken || !refreshToken || !refreshTokenExpires) return null;

      return {
        id: decoded.id,
        email: decoded.email,
        accessToken,
        refreshToken,
        refreshTokenExpires: new Date(refreshTokenExpires).getTime(),
        roles
      };
    } catch (error) {
      return null;
    }
  },
});
