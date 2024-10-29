import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/lib/db/prisma'
import { ProgressChart } from '@/components/analytics/progress-chart'
import { EngagementMetrics } from '@/components/analytics/engagement-metrics'
import { RevenueDashboard } from '@/components/analytics/revenue-dashboard'

export default async function CourseAnalyticsPage({ params }) {
  const { userId } = auth()
  if (!userId) redirect('/sign-in')

  const course = await prisma.course.findUnique({
    where: { id: params.courseId },
    include: {
      group: true,
      _count: {
        select: {
          reviews: true,
          certificates: true
        }
      }
    }
  })

  if (!course || course.group.ownerId !== userId) {
    redirect(`/groups/${params.groupId}/courses/${params.courseId}`)
  }

  // Get analytics data
  const [progress, engagement, revenue] = await Promise.all([
    // Progress data
    prisma.courseProgress.findMany({
      where: { courseId: params.courseId },
      include: { moduleProgress: true }
    }),
    // Engagement data
    prisma.courseReview.groupBy({
      by: ['rating'],
      where: { courseId: params.courseId },
      _count: true
    }),
    // Revenue data (if paid course)
    course.group.type === 'PAID' ? 
      prisma.payment.findMany({
        where: { courseId: params.courseId }
      }) : null
  ])

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Course Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProgressChart data={progress} />
        <EngagementMetrics data={engagement} />
        {revenue && <RevenueDashboard data={revenue} />}
      </div>
    </div>
  )
} 