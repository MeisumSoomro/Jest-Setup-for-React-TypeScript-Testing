import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/lib/db/prisma'
import { GroupSettings } from '@/components/groups/group-settings'

interface SettingsPageProps {
  params: {
    groupId: string
  }
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { userId } = auth()
  if (!userId) redirect('/sign-in')

  const group = await prisma.group.findUnique({
    where: { id: params.groupId },
    include: {
      owner: true,
    }
  })

  if (!group) redirect('/groups')
  if (group.ownerId !== userId) redirect(`/groups/${params.groupId}`)

  return (
    <div className="max-w-4xl mx-auto p-6">
      <GroupSettings group={group} />
    </div>
  )
} 