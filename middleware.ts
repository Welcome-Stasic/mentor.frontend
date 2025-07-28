import { withAuth } from 'next-auth/middleware';
import { useQuiz } from './lib/middleware/useQuiz';
import { NextRequest } from 'next/server';
import { runMiddlewarePipeline } from './lib/middleware';
import { useProtectedRoutes } from './lib/middleware/useProtectedRoutes';

function middleware(req: NextRequest) {
  // Пользователь уже авторизован — теперь выполняем другие проверки
  return runMiddlewarePipeline(req, [useProtectedRoutes, useQuiz]);
}

export default withAuth(middleware, {
  pages: {
    signIn: '/Account/Login',
  },
  callbacks: {
    authorized: ({ token }) => {
      // Проверяем, что есть токены и нет ошибки
      return !!token?.accessToken && !!token?.refreshToken && !token?.error;
    },
  },
});

// 🔐 Указываем исключения: разрешён доступ к этим маршрутам без авторизации
export const config = {
  matcher: [
    '/((?!_next/static|favicon.ico|api|backend|Account/Login|Account/Register|Account/ResetPassword|EmailConfirmed|not-found|privacy-policy).*)',
  ],
};
