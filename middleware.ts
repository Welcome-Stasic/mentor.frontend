import { NextRequest } from 'next/server';
import { runMiddlewarePipeline } from './lib/middleware';
import { useAuth } from './lib/middleware/useAuth';
import { useQuiz } from './lib/middleware/useQuiz';

export function middleware(req: NextRequest) {
  return runMiddlewarePipeline(req, [
    useAuth,
    useQuiz
  ])
}

export const config = {
  matcher: ['/((?!_next/static|favicon.ico|api).*)'], // исключаем _next/static, favicon.ico и api
};
