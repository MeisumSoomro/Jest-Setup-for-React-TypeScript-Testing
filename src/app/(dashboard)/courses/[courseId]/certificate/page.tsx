import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/lib/db/prisma'
import { CertificateGenerator } from '@/components/courses/certificate-generator'
import { Button } from '@/components/ui/button'
import { Download, Share2 } from 'lucide-react'

interface CertificatePageProps {
  params: {
    courseId: string
  }
}

export default async function CertificatePage({ params }: CertificatePageProps) {
  const { userId } = auth()
  if (!userId) redirect('/sign-in')

  // Get course, user, and certificate data
  const [course, user, certificate] = await Promise.all([
    prisma.course.findUnique({
      where: { id: params.courseId },
      include: {
        group: true
      }
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true }
    }),
    prisma.certificate.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: params.courseId
        }
      }
    })
  ])

  if (!course) redirect('/courses')

  // Verify course completion
  const courseProgress = await prisma.courseProgress.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: params.courseId
      }
    }
  })

  if (!courseProgress?.completed) {
    redirect(`/groups/${course.group.id}/courses/${course.id}`)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Course Certificate</h1>
        <p className="text-gray-500 mt-2">
          Congratulations on completing {course.title}!
        </p>
      </div>

      <div className="bg-white border rounded-lg p-8 mb-6">
        {certificate ? (
          <div className="space-y-6">
            <div className="aspect-[1.414] relative">
              <iframe
                src={certificate.pdfUrl}
                className="w-full h-full"
                title="Certificate Preview"
              />
            </div>
            <div className="flex justify-center gap-4">
              <Button asChild>
                <a href={certificate.pdfUrl} download>
                  <Download className="h-4 w-4 mr-2" />
                  Download Certificate
                </a>
              </Button>
              <Button variant="outline" onClick={() => {
                navigator.share({
                  title: `${course.title} Certificate`,
                  text: `Check out my certificate for completing ${course.title}!`,
                  url: certificate.pdfUrl
                })
              }}>
                <Share2 className="h-4 w-4 mr-2" />
                Share Certificate
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <p>Generate your certificate to download or share it.</p>
            <CertificateGenerator
              courseName={course.title}
              userName={user?.name || 'Student'}
              completionDate={courseProgress.updatedAt}
              onGenerate={async (pdfUrl) => {
                await fetch(`/api/courses/${course.id}/certificate`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ pdfUrl })
                })
              }}
            />
          </div>
        )}
      </div>

      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Certificate Details</h2>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-gray-500">Course</dt>
            <dd className="font-medium">{course.title}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Completion Date</dt>
            <dd className="font-medium">
              {courseProgress.updatedAt.toLocaleDateString()}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Certificate ID</dt>
            <dd className="font-medium">{certificate?.id || 'Not generated'}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Issued To</dt>
            <dd className="font-medium">{user?.name || 'Student'}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
} 