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

      const accessToken = response?.Result || null;
      const refreshToken = accessToken;

      if (!accessToken || !refreshToken) return null;

      const decoded = decodeToken(accessToken);

      return {
        id: decoded.id,
        email: decoded.email,
        accessToken,
        refreshToken,
        accessTokenExpires: decoded.exp * 1000,
      };
    } catch (error) {
      console.error('CRM Authorize Error:', error);
      return null;
    }
  },
});

