import { NextResponse } from 'next/server';
import { type Middleware } from './types';
import { getToken } from 'next-auth/jwt';

export const useAuth: Middleware = async (req) => {
  const { pathname } = req.nextUrl;
  
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if(token?.error === 'RefreshTokenError') {
    return NextResponse.redirect(new URL('/Account/Login', req.url));
  }

  const accessToken = token?.accessToken || '';

  if(pathname.startsWith('/Expired')) return;

  const isAuthPage = pathname.startsWith('/Account');

  // Если пользователь уже авторизован и идёт на страницу входа/регистрации — редиректим обратно
  if (isAuthPage && accessToken) {
    const referer = req.headers.get('referer') || '/';
    return NextResponse.redirect(new URL(referer, req.url));
  }

  //Если пользователь не авторизован и идёт на защищённую страницу — редирект на логин
  if (!accessToken && !isAuthPage) {
    return NextResponse.redirect(new URL('/Account/Login', req.url));
  }
};
