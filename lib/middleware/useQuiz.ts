import { NextRequest, NextResponse } from 'next/server';
import { type Middleware } from './types';
import { getToken } from 'next-auth/jwt';
import { API } from '../axios';
import { decodeToken } from '../utils/decodeToken';

export const useQuiz: Middleware = async (req: NextRequest) => {
  const url = req.nextUrl;

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const accessToken = token?.accessToken;

  if (!accessToken) return;

  const decoded = decodeToken(accessToken);
  const userId = decoded.id;
  const isWithoutQuiz = decoded.isWithOutQuiz === 'True';

  if (!userId) return;

  const isQuizPage = url.pathname.startsWith('/Quiz');

  if (isQuizPage) {
    // На странице Quiz: редирект, если викторины не должно быть или она уже пройдена
    if (isWithoutQuiz) return redirectToReferer(req);

    const quiz = await getFirstQuiz(userId, accessToken);
    if (quiz?.isCompleted) return redirectToReferer(req);

    return; // Доступ разрешён
  }

  // На других страницах: редирект, если у пользователя есть непройденная викторина
  if (!isWithoutQuiz) {
    const quiz = await getFirstQuiz(userId, accessToken);
    if (quiz && !quiz.isCompleted) {
      return NextResponse.redirect(new URL('/Quiz', req.url));
    }
  }
};

const redirectToReferer = (req: NextRequest) => {
  const referer = req.headers.get('referer') || '/';
  return NextResponse.redirect(new URL(referer, req.url));
};

const getFirstQuiz = async (userId: string, token: string) => {
  const response = await API.quiz.getAll(token, userId);
  return response?.Result?.data?.[0] ?? null;
};