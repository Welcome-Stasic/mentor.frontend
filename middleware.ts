import { NextRequest } from 'next/server';
import { runMiddlewarePipeline } from './lib/middleware';
import { useLogger } from './lib/middleware/useLogger';
import { useAuth } from './lib/middleware/useAuth';
import { useRegister } from './lib/middleware/useRegister';
import { useEmailConfirm } from './lib/middleware/useEmailConfirm';
import { useQuiz } from './lib/middleware/useQuiz';

export function middleware(req: NextRequest) {
  return runMiddlewarePipeline(req, [
    useLogger,
    useEmailConfirm,
    useAuth,
    useRegister,
    useQuiz
  ])
}

export const config = {
  matcher: ['/((?!_next/static|favicon.ico).*)'], // применить ко всем путям, кроме static
}