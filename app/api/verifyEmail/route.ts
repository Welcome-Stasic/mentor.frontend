import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const base = process.env.NEXT_PUBLIC_SITE_URL
  const originalUrl = new URL(request.url)

  // Копируем query-параметры
  const redirectUrl = new URL('/EmailConfirmed', base)
  redirectUrl.search = originalUrl.search 

  return NextResponse.redirect(redirectUrl)
}

