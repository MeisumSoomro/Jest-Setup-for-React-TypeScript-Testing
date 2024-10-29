import { SignIn } from "@clerk/nextjs";

/**
 * Authentication Page Component
 * 
 * Purpose: Handles user authentication using Clerk
 * Usage: Automatically handles OAuth and email/password authentication
 * Related Files:
 * - middleware.ts (protects routes)
 * - .env (CLERK_SECRET_KEY configuration)
 * 
 * Route: /sign-in
 * Protected: No
 */

export default function Page() {
  return <SignIn />;
} 