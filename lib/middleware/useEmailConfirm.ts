import { type Middleware } from './types';
import { NextResponse } from 'next/server';
import { jwtDecode, JwtPayload } from 'jwt-decode';

export const useEmailConfirm: Middleware = (req) => {
  const { pathname, searchParams } = req.nextUrl;

  if (pathname === '/email-confirmed') {
    const tokenInParams = searchParams.get('token');
    const tokenInCookie = req.cookies.get('token')?.value

    if (!tokenInParams || tokenInCookie) {
      return NextResponse.redirect(new URL('/Account/Login', req.url));
    }
    
    const response = NextResponse.redirect(new URL('/', req.url))

    try {
      const decoded = jwtDecode<JwtPayload>(tokenInParams)

      response.cookies.set({
        name: 'token',
        value: tokenInParams,
        maxAge: decoded.exp,
        path: '/',
        sameSite: 'none',
        secure: true,
      })

      return response
    } catch (err) {
      console.error('Invalid token format', err)
      return NextResponse.redirect(new URL('/Account/Login', req.url))
    }
  }
};
