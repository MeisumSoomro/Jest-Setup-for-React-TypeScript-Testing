import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full h-16 px-4 border-b shadow-sm bg-white flex items-center">
      <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
        <Link href="/" className="font-bold text-xl">
          EduFlow
        </Link>
        <div className="flex items-center gap-x-4">
          <Link href="/courses" className="text-sm hover:opacity-75 transition">
            Browse Courses
          </Link>
          <Link href="/teach" className="text-sm hover:opacity-75 transition">
            Become Instructor
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </nav>
  );
}; 