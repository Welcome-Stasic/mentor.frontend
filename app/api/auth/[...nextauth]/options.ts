import { API } from '@/lib/axios';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { CRMProvider } from './crm-provider';
import { decodeToken } from '@/lib/utils/decodeToken';
import { refreshAccessToken } from '@/lib/utils/refreshAccessToken';

export const authOptions: NextAuthOptions = {
  debug: true,
  providers: [
    CRMProvider,
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
          })

          const accessToken = response?.Result || null;
          const refreshToken = accessToken;

          if (!accessToken || !refreshToken) return null;

          const decoded = decodeToken(accessToken);

          return {
            id: decoded.id,
            accessToken,
            refreshToken,
            accessTokenExpires: decoded.exp * 1000,
          };
        } catch (error) {
          console.error('Authorize error:', error);
          return null;
        }
      },
    }),
  ],

  pages: {
    signIn: '/Account/Login',
    newUser: '/Account/Register',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = user.accessTokenExpires;
        return token;
      }

      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.user = {
        ...session.user,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
      };
      return session;
    },
  },

  session: {
    strategy: 'jwt',
  },

  secret: process.env.NEXTAUTH_SECRET,
};