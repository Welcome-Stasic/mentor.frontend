import { NextRequest, NextResponse } from 'next/server';

export function handleRegisterMiddleware(req: NextRequest) {
  const url = req.nextUrl;
  const token = url.searchParams.get("token");

  const role = req.cookies.get("user-role")?.value;

  if (role === "admin") return NextResponse.next(); // админов пропускаем

  if (!token) return notFound(req); // нет токена
 
  NextResponse.next(); //всё ок
}

function notFound(req: NextRequest) {
  return NextResponse.rewrite(new URL('/not-found', req.url));
}
