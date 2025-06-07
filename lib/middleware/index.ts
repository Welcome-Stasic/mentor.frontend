import type { Middleware } from './types'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function runMiddlewarePipeline(req: NextRequest, middlewareList: Middleware[]) {
  for (const middleware of middlewareList) {
    const result = await middleware(req)
    if (result instanceof NextResponse) {
      return result // Прервать цепочку, вернуть ответ
    }
  }

  return NextResponse.next() // Все прошли — идем дальше
}
