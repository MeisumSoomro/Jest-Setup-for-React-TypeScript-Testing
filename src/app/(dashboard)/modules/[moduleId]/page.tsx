import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/lib/db/prisma'
import { VideoPlayer } from '@/components/modules/video-player'
import { ModuleContent } from '@/components/modules/module-content'
import { ModuleNavigation } from '@/components/modules/module-navigation'

interface ModulePageProps {
  params: {
    moduleId: string
  }
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { userId } = auth()
  if (!userId) redirect('/sign-in')

  const module = await prisma.module.findUnique({
    where: { id: params.moduleId },
    include: {
      course: {
        include: {
          modules: {
            orderBy: { order: 'asc' }
          },
          group: true
        }
      }
    }
  })

  if (!module) redirect('/')

  // Check if user has access
  const isMember = await prisma.groupMember.findUnique({
    where: {
      userId_groupId: {
        userId,
        groupId: module.course.group.id
      }
    }
  })

  const isOwner = module.course.group.ownerId === userId

  if (!isMember && !isOwner) {
    redirect(`/groups/${module.course.group.id}`)
  }

  // Get module progress
  const moduleProgress = await prisma.moduleProgress.findUnique({
    where: {
      userId_moduleId: {
        userId,
        moduleId: module.id
      }
    }
  })

  // Get next and previous modules
  const currentIndex = module.course.modules.findIndex(m => m.id === module.id)
  const previousModule = module.course.modules[currentIndex - 1]
  const nextModule = module.course.modules[currentIndex + 1]

  return (
    <div className="h-full flex flex-col">
      {module.videoUrl && (
        <div className="relative w-full aspect-video">
          <VideoPlayer
            url={module.videoUrl}
            moduleId={module.id}
            initialProgress={moduleProgress?.lastPosition}
          />
        </div>
      )}
      
      <div className="flex-1 p-6">
        <ModuleContent module={module} />
        
        <div className="mt-6">
          <ModuleNavigation
            previousModule={previousModule}
            nextModule={nextModule}
            courseId={module.course.id}
          />
        </div>
      </div>
    </div>
  )
} 