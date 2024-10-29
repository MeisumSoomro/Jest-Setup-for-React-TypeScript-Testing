import Link from 'next/link'
import { Group } from '@prisma/client'

interface GroupSidebarProps {
  group: Group
}

export function GroupSidebar({ group }: GroupSidebarProps) {
  return (
    <div className="bg-white border-r h-full p-4">
      <nav className="space-y-2">
        <Link 
          href={`/groups/${group.id}`}
          className="block px-2 py-1 rounded-md hover:bg-gray-100"
        >
          Home
        </Link>
        <Link 
          href={`/groups/${group.id}/about`}
          className="block px-2 py-1 rounded-md hover:bg-gray-100"
        >
          About
        </Link>
        <Link 
          href={`/groups/${group.id}/courses`}
          className="block px-2 py-1 rounded-md hover:bg-gray-100"
        >
          Courses
        </Link>
      </nav>
    </div>
  )
} 