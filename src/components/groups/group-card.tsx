import Image from 'next/image'
import Link from 'next/link'
import { Group } from '@prisma/client'

interface GroupCardProps {
  group: Group & {
    owner: { name: string | null; image: string | null };
    _count: { members: number };
  }
}

export function GroupCard({ group }: GroupCardProps) {
  return (
    <Link href={`/groups/${group.id}`}>
      <div className="border rounded-lg overflow-hidden hover:shadow-md transition">
        <div className="relative h-48 w-full">
          {group.image ? (
            <Image
              src={group.image}
              alt={group.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-lg">{group.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{group.description}</p>
          
          <div className="flex items-center mt-4 text-sm text-gray-500">
            <div className="flex items-center">
              {group.owner.image && (
                <Image
                  src={group.owner.image}
                  alt={group.owner.name || ''}
                  width={20}
                  height={20}
                  className="rounded-full"
                />
              )}
              <span className="ml-2">{group.owner.name}</span>
            </div>
            <div className="ml-auto">
              {group._count.members} members
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
} 