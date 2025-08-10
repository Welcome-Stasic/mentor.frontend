import { API } from '@/lib/axios';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { CRMProvider } from './providers/crm';
import { decodeToken } from '@/lib/utils/decodeToken';
import { refreshAccessToken } from '@/lib/utils/refreshAccessToken';
import { TokenProvider } from './providers/token';
import { checkAccessToken } from '@/lib/utils/checkAccessToken';
import { CustomYandexProvider } from './providers/yandex';
import { handleYandexLogin } from '@/lib/auth/yandex';
import { handleDefaultLogin } from '@/lib/auth/default';

const ONE_MINUTE_MS = 60 * 1000;
const CHECK_INTERVAL = 30 * 1000; // 30 секунд

export const authOptions: NextAuthOptions = {
  debug: true,
  providers: [
    CRMProvider,
    TokenProvider,
    CustomYandexProvider,
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
          const roles = decoded?.roles;

          return {
            id: decoded?.id ?? '',
            email: decoded?.email ?? '',
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
    async signIn({ account }) {
      if (account?.provider === 'yandex') {
        // Если нет access_token от Яндекс — запрещаем вход
        if (!account.access_token || !account.access_token.trim()) {
          return false;
        }
      }

      return true; // Разрешаем вход для всех остальных
    },
    async jwt({ token, user, account }) {
      const now = Date.now();

      if (account && user) {
        switch (account.provider) {
          case 'yandex':
            return handleYandexLogin(token, account?.access_token ?? '');
          default:
            return handleDefaultLogin(token, user, now);
        }
      }

      // проверка accessToken
      if (now - (token.lastChecked ?? 0) > CHECK_INTERVAL) {
        const stillValid = await checkAccessToken(token);

        if (!stillValid) {
          return {
            ...token,
            refreshTokenValid: false,
            error: 'RefreshTokenInvalid',
          };
        }
      }

      if (!token.refreshToken || !token.refreshTokenExpires) {
        return {
          ...token,
          refreshTokenValid: false,
          error: 'MissingRefreshToken',
        };
      }

      // Если refreshToken скоро истекает — обновляем
      const timeLeft = token.refreshTokenExpires - now;

      if (timeLeft < ONE_MINUTE_MS) {
        return await refreshAccessToken(token);
      }

      return {
        ...token,
        lastChecked: now,
      };
    },

    async session({ session, token }) {
      // Безопасно проверяем accessToken
      let roles: string[] = [];

      if (typeof token.accessToken === 'string' && token.accessToken.trim()) {
        const decoded = decodeToken(token.accessToken);
        roles = decoded?.roles ?? [];
        session.user = {
          ...session.user,
          accessToken: token.accessToken,
          refreshToken: token.refreshToken ?? null,
          roles,
        };
      } else {
        session.user = {
          ...session.user,
          accessToken: '',
          refreshToken: token.refreshToken ?? null,
          roles: [],
        };
      }

      if (token?.error) {
        session.error = token.error;
      }

      session.refreshTokenValid = token.refreshTokenValid;

      if (token?.picture) {
        session.user.picture = token?.picture;
      }

      return session;
    },
  },

  session: {
    strategy: 'jwt',
  },

  secret: process.env.NEXTAUTH_SECRET,
};
