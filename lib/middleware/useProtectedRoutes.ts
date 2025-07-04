import { NextRequest, NextResponse } from 'next/server';
import { Middleware } from './types';
import { PAGE } from '@/constants';
import { getToken } from 'next-auth/jwt';
import { decodeToken } from '../utils/decodeToken';

export const useProtectedRoutes: Middleware = async (req: NextRequest) => {
  const url = req.nextUrl;
  const pathname = url.pathname.toLowerCase().trim();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const accessToken = token?.accessToken;
  
  if (!accessToken) return;

  const decoded = decodeToken(accessToken);
  const userRoles = decoded.roles || [];

  // Находим защищённую страницу, чей pathPrefix совпадает с началом пути
  const matchedEntry = Object.entries(PAGE).find(([_, page]) => {
    const prefix = page.pathPrefix.toLowerCase().trim();
    return page.roles.length && pathname.startsWith(prefix);
  });

  if (!matchedEntry) return;

  const [_, page] = matchedEntry;
  const hasAccess = page.roles.some(role => userRoles.includes(role));

  if (!hasAccess) {
    return NextResponse.redirect(new URL('/not-fond', req.url));
  }
};
