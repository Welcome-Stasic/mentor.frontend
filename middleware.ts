import { NextRequest } from 'next/server';
import { handleAuthMiddleware, handleRegisterMiddleware } from './middlewares';

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  if (url.pathname === "/Account/Register") {
    return handleRegisterMiddleware(req);
  }
  
  return handleAuthMiddleware(req);
}

export const config = {
  matcher: ['/', '/Account/:path*', '/Request/:path*']
};