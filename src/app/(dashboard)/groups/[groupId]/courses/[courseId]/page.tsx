import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/lib/db/prisma'
import { ModulesList } from '@/components/modules/modules-list'
import { CreateModuleButton } from '@/components/modules/create-module-button'
import { CourseProgress } from '@/components/courses/course-progress'
import { CourseReviews } from '@/components/courses/course-reviews'
import { CertificateGenerator } from '@/components/courses/certificate-generator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface CoursePageProps {
  params: {
    groupId: string
    courseId: string
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { userId } = auth()
  if (!userId) redirect('/sign-in')

  const course = await prisma.course.findUnique({
    where: { id: params.courseId },
    include: {
      group: true,
      modules: {
        orderBy: { order: 'asc' }
      },
      reviews: {
        include: {
          user: {
            select: {
              name: true,
              image: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!course) redirect(`/groups/${params.groupId}/courses`)
  
  const isOwner = course.group.ownerId === userId

  // Get course progress and user data
  const [courseProgress, user, userReview] = await Promise.all([
    prisma.courseProgress.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: course.id
        }
      },
      include: {
        moduleProgress: true
      }
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true }
    }),
    prisma.courseReview.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: course.id
        }
      }
    })
  ])

  const totalModules = course.modules.length
  const completedModules = courseProgress?.moduleProgress.filter(mp => mp.completed).length || 0
  const progress = totalModules === 0 ? 0 : (completedModules / totalModules) * 100
  const isCompleted = progress === 100

  // Find the first incomplete module
  const currentModule = course.modules.find(module => 
    !courseProgress?.moduleProgress.find(mp => 
      mp.moduleId === module.id && mp.completed
    )
  )

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{course.title}</h1>
        <p className="text-gray-500 mt-2">{course.description}</p>
      </div>

      <Tabs defaultValue="content" className="space-y-6">
        <TabsList>
          <TabsTrigger value="content">Course Content</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          {!isOwner && isCompleted && (
            <TabsTrigger value="certificate">Certificate</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="content">
          {!isOwner && (
            <div className="mb-6">
              <CourseProgress
                courseId={course.id}
                totalModules={totalModules}
                completedModules={completedModules}
                progress={progress}
              />
            </div>
          )}
          
          {isOwner && (
            <div className="mb-6">
              <CreateModuleButton courseId={course.id} />
            </div>
          )}
          
          <ModulesList 
            modules={course.modules} 
            progress={courseProgress?.moduleProgress}
            currentModuleId={currentModule?.id}
            isOwner={isOwner}
            courseId={course.id}
          />
        </TabsContent>

        <TabsContent value="reviews">
          <CourseReviews
            courseId={course.id}
            reviews={course.reviews}
            userReview={userReview}
          />
        </TabsContent>

        {!isOwner && isCompleted && (
          <TabsContent value="certificate">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <h2 className="text-xl font-semibold">
                Congratulations on completing the course!
              </h2>
              <p className="text-gray-500">
                You can now download your certificate of completion.
              </p>
              <CertificateGenerator
                courseName={course.title}
                userName={user?.name || 'Student'}
                completionDate={new Date()}
                onGenerate={async (pdfUrl) => {
                  await fetch(`/api/courses/${course.id}/certificate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ pdfUrl })
                  })
                }}
              />
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
} 