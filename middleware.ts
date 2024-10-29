/**
 * Main Application Middleware
 * 
 * Purpose: Central middleware configuration
 * Usage: Handles:
 * - Authentication
 * - Route protection
 * - API route protection
 * 
 * Configuration:
 * - Public routes whitelist
 * - Protected route patterns
 * - API route protection
 */

import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/api/webhook",
    "/api/docs",
    "/sign-in",
    "/sign-up",
    "/forgot-password"
  ],
  ignoredRoutes: [
    "/api/public",
    "/_next",
    "/static"
  ],
  afterAuth(auth, req) {
    // Custom logic after authentication
    if (!auth.userId && !auth.isPublicRoute) {
      return NextResponse.redirect(new URL('/sign-in', req.url))
    }
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}; 