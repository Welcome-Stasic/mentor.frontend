 
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email?: string;
      roles?: string[];
      accessToken: string | undefined;
      refreshToken: string;
      picture?: string;
    };
  }

  interface User {
    id: string;
    email?: string;
    roles?: string[];
    accessToken: string;
    refreshToken: string;
    refreshTokenExpires: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    refreshTokenExpires: number;
    error?: string;
    justLoggedIn: bool;
    refreshTokenValid: bool;
    lastChecked: number;
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
      accessToken: string;
      refreshToken: string;
      picture?: string;
    };
    error?: string;
    refreshTokenValid: bool;
  }
}
