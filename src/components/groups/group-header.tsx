import Image from 'next/image'
import Link from 'next/link'
import { Group, User, GroupMember } from '@prisma/client'
import { Button } from '../ui/button'

interface GroupHeaderProps {
  group: Group & {
    owner: User;
    members: (GroupMember & { user: User })[];
    _count: { members: number };
  }
}

export function GroupHeader({ group }: GroupHeaderProps) {
  return (
    <div className="bg-white border-b">
      <div className="h-40 relative">
        {group.image ? (
          <Image
            src={group.image}
            alt={group.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gray-100" />
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{group.name}</h1>
            <p className="text-sm text-gray-500">{group.description}</p>
          </div>
          <div className="flex items-center gap-x-2">
            <Button variant="outline" asChild>
              <Link href={`/groups/${group.id}/settings`}>
                Settings
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 