import { NextRequest, NextResponse } from 'next/server';
import { type Middleware } from './types';
import { jwtDecode } from 'jwt-decode';

export const useQuiz: Middleware = async (req: NextRequest) => {
  const url = req.nextUrl;
  
  if (url.pathname === "/Quiz") return;
  
  const token = req.cookies.get('token')?.value ?? ''

  if(!token) return;

  const decoded: Record<string, unknown> = jwtDecode(token);

  const quizStage = decoded['quiz_stage'] as string;
  const quizCompleted = decoded['quiz_isCompleted'] as string;

  if(quizStage && quizCompleted === 'False'){
    return NextResponse.redirect(new URL('/Quiz', req.url))
  };
}
