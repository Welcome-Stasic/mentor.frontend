import { NextRequest } from 'next/server';
import { handleAuthMiddleware, handleRegisterMiddleware } from './app/middleware';

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Подключаем нужную проверку по маршруту
  if (url.pathname === "/Account/Register") {
    return handleRegisterMiddleware(req);
  }
  
  return handleAuthMiddleware(req);
}

export const config = {
  matcher: ['/', '/Account/:path*']
};