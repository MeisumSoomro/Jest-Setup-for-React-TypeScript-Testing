import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/lib/db/prisma'
import { ProgressOverview } from '@/components/student/progress-overview'
import { EnrolledCourses } from '@/components/student/enrolled-courses'
import { LearningPath } from '@/components/student/learning-path'

export default async function DashboardPage() {
  const { userId } = auth()
  if (!userId) redirect('/sign-in')

  const [enrolledCourses, certificates, progress] = await Promise.all([
    // Get enrolled courses
    prisma.groupMember.findMany({
      where: { userId },
      include: {
        group: {
          include: {
            courses: {
              include: {
                _count: {
                  select: { modules: true }
                }
              }
            }
          }
        }
      }
    }),
    // Get certificates
    prisma.certificate.findMany({
      where: { userId },
      include: { course: true }
    }),
    // Get course progress
    prisma.courseProgress.findMany({
      where: { userId },
      include: {
        course: true,
        moduleProgress: true
      }
    })
  ])

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Your Dashboard</h1>
      
      <div className="grid gap-6">
        <ProgressOverview progress={progress} />
        <EnrolledCourses 
          courses={enrolledCourses.flatMap(em => em.group.courses)} 
          progress={progress}
        />
        <LearningPath 
          certificates={certificates}
          progress={progress}
        />
      </div>
    </div>
  )
} 