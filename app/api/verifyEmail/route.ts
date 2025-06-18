import { NextResponse } from 'next/server'
import { decodeToken } from '@/lib/utils/decodeToken'  // твоя функция декодирования

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ message: 'Token is required' }, { status: 400 })
    }

    // Проверяем токен (декодируем)
    const decoded = decodeToken(token)

    if (!decoded || !decoded.id) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }

    // Возвращаем инфу о пользователе
    return NextResponse.json({ message: 'Authenticated', userId: decoded.id }, { status: 200 })

  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.redirect(new URL('/EmailConfirmed', request.url))
  }
}
