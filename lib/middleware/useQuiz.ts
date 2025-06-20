import { NextRequest, NextResponse } from 'next/server';
import { type Middleware } from './types';
import { getToken } from 'next-auth/jwt';
import { API } from '../axios';
import { decodeToken } from '../utils/decodeToken';

export const useQuiz: Middleware = async (req: NextRequest) => {
  const url = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Нет токена — пропускаем запрос
  if (!token?.accessToken) return;

  const decoded = decodeToken(token.accessToken);

  const userId = decoded.id;
  const isWithOutQuiz = decoded.isWithOutQuiz === 'True';

  // Если нет ID пользователя — пропускаем
  if (!userId) return;

  const redirectToReferer = () => {
    const referer = req.headers.get('referer') || '/';
    return NextResponse.redirect(new URL(referer, req.url));
  };

  // Страница викторины
  if (url.pathname.startsWith('/Quiz')) {
    if (isWithOutQuiz) return redirectToReferer();

    const quiz = await getFirstQuiz(userId, token.accessToken);
    if (quiz?.isCompleted) return redirectToReferer();

    return; // доступ разрешён
  }

  // Прочие страницы: если у пользователя есть невыполненная викторина — редирект
  if (!isWithOutQuiz) {
    const quiz = await getFirstQuiz(userId, token.accessToken);
    if (quiz && !quiz.isCompleted) {
      return NextResponse.redirect(new URL('/Quiz', req.url));
    }
  }
};

const getFirstQuiz = async (userId: string, token: string) => {
  const response = await API.quiz.getAll(token, userId);

  return response?.Result?.data?.[0] || null;
};