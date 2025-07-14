import { API } from '@/lib/axios';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { CRMProvider } from './providers/crm';
import { decodeToken } from '@/lib/utils/decodeToken';
import { refreshAccessToken } from '@/lib/utils/refreshAccessToken';
import { TokenProvider } from './providers/token';
import { checkAccessToken } from '@/lib/utils/checkAccessToken';

const TOKEN_VALIDITY_CACHE_MS = 5000;

export const authOptions: NextAuthOptions = {
  debug: true,
  providers: [
    CRMProvider,
    TokenProvider,
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          const response = await API.auth.login({
            email: credentials.email,
            password: credentials.password,
          });

          const accessToken = response?.Result?.accessToken || null;
          const refreshToken = response?.Result?.refreshToken || null;
          const refreshTokenExpires = response?.Result?.refreshTokenExpires || null;

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
    }),
  ],
  events: {
    async signOut({ token }) {
      const refreshToken = token.refreshToken;
      const accessToken = token.accessToken;

      try {
        await API.auth.logOut(accessToken, refreshToken);
      } catch (error) {
        console.error('logOut failed:', error);
      }
    },
  },

  pages: {
    signIn: '/Account/Login',
    newUser: '/Account/Register',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          refreshTokenExpires: user.refreshTokenExpires,
          justLoggedIn: true,
          refreshTokenValid: true, // кэш результата проверки
          lastChecked: Date.now(), // когда последний раз проверяли
        };
      }

      // Пропускаем проверку токена сразу после логина
      if (token.justLoggedIn) {
        token.justLoggedIn = false;
        return token;
      }

      // Если недавно уже проверяли → пропускаем проверку
      const now = Date.now();
      const timeSinceLastCheck = now - (token.lastChecked || 0);

      if (timeSinceLastCheck < TOKEN_VALIDITY_CACHE_MS) return token;
      
      // Проверка валидности accessToken через бекенд
      const isValid = await checkAccessToken(token);
      
      if (isValid) {
        token.refreshTokenValid = true;
        token.lastChecked = now;
        return token;
      }

      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      const decoded = decodeToken(token.accessToken);
      const roles = decoded.roles;

      session.user = {
        ...session.user,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        roles,
      };

      if (token?.error) {
        session.error = token.error;
      }

      session.refreshTokenValid = token.refreshTokenValid;

      return session;
    },
  },

  session: {
    strategy: 'jwt',
  },

  secret: process.env.NEXTAUTH_SECRET,
};
