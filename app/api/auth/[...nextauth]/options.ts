import { API } from '@/lib/axios';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { CRMProvider } from './providers/crm';
import { decodeToken } from '@/lib/utils/decodeToken';
import { GRACE_SEC, refreshAccessToken } from '@/lib/utils/refreshAccessToken';
import { TokenProvider } from './providers/token';
import { checkAccessToken } from '@/lib/utils/checkAccessToken';

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
      } catch (error) {console.error("logOut failed:", error)}
    },
  },

  pages: {
    signIn: '/Account/Login',
    newUser: '/Account/Register',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.refreshTokenExpires = user.refreshTokenExpires;
        return token;
      }
      
      // Ещё валиден → просто вернуть
      if (await checkAccessToken(token)) return token;

      // Иначе пробуем обновить
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

      return session;
    },
  },

  session: {
    strategy: 'jwt',
  },

  secret: process.env.NEXTAUTH_SECRET,
};
