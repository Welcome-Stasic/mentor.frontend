import CredentialsProvider from 'next-auth/providers/credentials';
import { API } from '@/lib/axios'; // импорт своей CRM API
import { decodeToken } from '@/lib/utils/decodeToken';


export const CRMProvider = CredentialsProvider({
  id: 'crm', // 👈 ID провайдера, по которому его можно различать
  name: 'CRM Provider',
  credentials: {
    login: { label: "Login", type: "text" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    if (!credentials) return null;

    try {
      const response = await API.auth.crmLogin({
        login: credentials.login,
        password: credentials.password,
      });
      const accessToken = response?.Result?.accessToken || null;
      const refreshToken = response?.Result?.refreshToken || null;
      const refreshTokenExpires = response?.Result?.refreshTokenExpires || null;;

      if (!accessToken || !refreshToken || !refreshTokenExpires) return null;

      const decoded = decodeToken(accessToken);
      const roles = decoded.roles;

      return {
        id: decoded.id,
        email: decoded.email,
        accessToken,
        refreshToken,
        refreshTokenExpires: new Date(refreshTokenExpires).getTime(),
        roles,
      };
    } catch {
      return null;
    }
  },
});

