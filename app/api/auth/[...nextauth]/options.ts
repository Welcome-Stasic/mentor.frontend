import { API } from '@/lib/axios';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { CRMProvider } from './providers/crm';
import { decodeToken } from '@/lib/utils/decodeToken';
import { refreshAccessToken } from '@/lib/utils/refreshAccessToken';
import { TokenProvider } from './providers/token';

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
          })

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
            roles
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
        token.refreshTokenExpires = user.refreshTokenExpires;
        return token;
      }

      if (Date.now() < (token.refreshTokenExpires as number)) {
        return token;
      }
      
      return await refreshAccessToken(token)
    },

    async session({ session, token }) {
      const decoded = decodeToken(token.accessToken);
      const roles = decoded.roles;

      session.user = {
        ...session.user,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        roles
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