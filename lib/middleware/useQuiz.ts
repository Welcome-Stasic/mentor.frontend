import { NextRequest, NextResponse } from 'next/server';
import { type Middleware } from './types';
import { jwtDecode } from 'jwt-decode';
import { getAllQuiz } from '@/mentorApi/request/getAllQuiz';

export const useQuiz: Middleware = async (req: NextRequest) => {
  const url = req.nextUrl;
 
  const token = req.cookies.get('token')?.value ?? ''
  
  if(!token) return;
  
  const decoded: Record<string, unknown> = jwtDecode(token);
  
  const applicationUserId = decoded['id'] as string;
  const isWithOutQuiz = decoded['isWithOutQuiz'] as string;
  
  if (url.pathname.startsWith("/Quiz")) {

    if(isWithOutQuiz === 'True'){
      const referer = req.headers.get('referer') || '/';
      return NextResponse.redirect(new URL(referer, req.url));
    }
    
    return;
  }

  if(applicationUserId && isWithOutQuiz !== 'True'){
    const response = await getAllQuiz(applicationUserId);
    const quiz = response?.Result?.data?.[0];

    if (!quiz?.isCompleted) {
      return NextResponse.redirect(new URL('/Quiz', req.url));
    }
  };
}