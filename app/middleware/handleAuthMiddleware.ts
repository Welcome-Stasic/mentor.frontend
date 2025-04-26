import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function handleAuthMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Пропускаем страницы Login и Register
  if (pathname.startsWith('/Account/Login') || pathname.startsWith('/Account/Register')) {
    return NextResponse.next();
  }

  // Проверяем наличие токена
  const token = req.cookies.get('token');

  // Если токен не найден, редиректим на страницу Login
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = '/Account/Login';
    return NextResponse.redirect(url);
  }

  // Если токен есть, пропускаем запрос
  return NextResponse.next();
}
