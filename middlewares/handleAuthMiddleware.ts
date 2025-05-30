import { isTokenExpired } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function handleAuthMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('token')?.value

  const isAuthPage =
    pathname.startsWith('/Account/Login') ||
    pathname.startsWith('/Account/Register')

  const isLoggedIn = token && !isTokenExpired(token)

  // Если пользователь уже авторизован и идёт на страницу входа/регистрации — редиректим обратно
  if (isAuthPage && isLoggedIn) {
    const referer = req.headers.get('referer') || '/'
    return NextResponse.redirect(new URL(referer, req.url))
  }

  //Если пользователь не авторизован и идёт на защищённую страницу — редирект на логин
  if (!isLoggedIn && !isAuthPage) {
    return NextResponse.redirect(new URL('/Account/Login', req.url))
  }

  return NextResponse.next()
}