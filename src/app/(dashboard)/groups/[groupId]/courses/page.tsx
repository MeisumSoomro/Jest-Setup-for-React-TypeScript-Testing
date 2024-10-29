import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/lib/db/prisma'
import { CoursesList } from '@/components/courses/courses-list'
import { CreateCourseButton } from '@/components/courses/create-course-button'

interface CoursesPageProps {
  params: {
    groupId: string
  }
}

export default async function CoursesPage({ params }: CoursesPageProps) {
  const { userId } = auth()
  if (!userId) redirect('/sign-in')

  const group = await prisma.group.findUnique({
    where: { id: params.groupId },
    include: {
      owner: true,
      courses: {
        include: {
          _count: {
            select: { modules: true }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })

  if (!group) redirect('/groups')

  const isOwner = group.ownerId === userId

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Courses</h1>
        {isOwner && <CreateCourseButton groupId={group.id} />}
      </div>
      <CoursesList courses={group.courses} />
    </div>
  )
} 