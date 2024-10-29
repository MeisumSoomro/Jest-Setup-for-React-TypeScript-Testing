/**
 * Rate Limiting Middleware
 * 
 * Purpose: Protects API routes from abuse
 * Usage: Automatically limits request frequency per IP
 * 
 * Configuration:
 * - 100 requests per 15 minutes per IP
 * - Applies to all /api/* routes
 * - Customizable limits per route
 * 
 * Related:
 * - middleware.ts (auth protection)
 * - error-handler.ts (error responses)
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()
const WINDOW_SIZE = 900000 // 15 minutes in milliseconds
const MAX_REQUESTS = 100

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.ip ?? '127.0.0.1'
    const key = `rate-limit:${ip}`

    const count = await redis.incr(key)
    if (count === 1) {
      await redis.expire(key, WINDOW_SIZE / 1000)
    }

    if (count > MAX_REQUESTS) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': WINDOW_SIZE.toString(),
        },
      })
    }
  }
  return NextResponse.next()
} 