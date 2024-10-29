import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/lib/db/prisma'
import { GroupHeader } from '@/components/groups/group-header'
import { GroupSidebar } from '@/components/groups/group-sidebar'
import { GroupPosts } from '@/components/groups/group-posts'

interface GroupPageProps {
  params: {
    groupId: string
  }
}

export default async function GroupPage({ params }: GroupPageProps) {
  const { userId } = auth()
  if (!userId) redirect('/sign-in')

  const group = await prisma.group.findUnique({
    where: { id: params.groupId },
    include: {
      owner: true,
      members: {
        include: { user: true }
      },
      _count: {
        select: { members: true }
      }
    }
  })

  if (!group) redirect('/groups')

  const isMember = group.members.some(member => member.userId === userId)
  const isOwner = group.ownerId === userId

  if (!isMember && !isOwner && group.type === 'PAID') {
    redirect(`/groups/${params.groupId}/join`)
  }

  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0">
        <GroupSidebar group={group} />
      </div>
      <main className="md:pl-56 h-full">
        <GroupHeader group={group} />
        <div className="px-4 py-6">
          <GroupPosts groupId={group.id} />
        </div>
      </main>
    </div>
  )
} 