import { NextRequest, NextResponse } from 'next/server';
import { type Middleware } from './types';

export const useRegister: Middleware = (req: NextRequest) => {
  const url = req.nextUrl;
  
  if (url.pathname !== "/Account/Register") return;

  const token = url.searchParams.get('token');
  const role = req.cookies.get('user-role')?.value;
  
  if (role !== 'admin' && !token) return notFound(req); // нет токена
};

function notFound(req: NextRequest) {
  return NextResponse.rewrite(new URL('/not-found', req.url));
}
