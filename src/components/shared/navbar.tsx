import Link from 'next/link'
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs'
import { Button } from '../ui/button'

export function Navbar() {
  return (
    <nav className="border-b bg-white fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              Logo
            </Link>
          </div>

          <div className="flex items-center gap-x-4">
            <Link href="/explore">
              Explore
            </Link>
            
            <SignedIn>
              <Link href="/groups">
                My Groups
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            
            <SignedOut>
              <Link href="/sign-in">
                <Button>
                  Sign In
                </Button>
              </Link>
            </SignedOut>
          </div>
        </div>
      </div>
    </nav>
  )
} 