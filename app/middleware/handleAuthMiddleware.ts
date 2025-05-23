import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function handleAuthMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('token');

  const isAuthPage =
    pathname.startsWith('/Account/Login') ||
    pathname.startsWith('/Account/Register');

  if (isAuthPage && token) {
    const referer = req.headers.get('referer') || '/';
    return NextResponse.redirect(new URL(referer, req.url));
  }

  if (!token && !isAuthPage) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/Account/Login';
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
