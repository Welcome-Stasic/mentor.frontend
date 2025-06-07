import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export type Middleware = (req: NextRequest) => Promise<NextResponse | void> | NextResponse | void
