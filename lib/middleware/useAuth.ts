import { NextResponse } from 'next/server';
import { type Middleware } from './types';
import { isTokenExpired } from '../auth';

export const useAuth: Middleware = (req) => {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('token')?.value;

  const isAuthPage =
    pathname.startsWith('/Account/Login') || pathname.startsWith('/Account/Register');

  const isLoggedIn = token && !isTokenExpired(token);

  // Если пользователь уже авторизован и идёт на страницу входа/регистрации — редиректим обратно
  if (isAuthPage && isLoggedIn) {
    const referer = req.headers.get('referer') || '/';
    return NextResponse.redirect(new URL(referer, req.url));
  }

  //Если пользователь не авторизован и идёт на защищённую страницу — редирект на логин
  if (!isLoggedIn && !isAuthPage) {
    const redirect = NextResponse.redirect(new URL('/Account/Login', req.url));
    redirect.cookies.delete('token');
    return redirect;
  }
};
