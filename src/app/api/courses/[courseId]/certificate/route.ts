import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/lib/db/prisma'

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { pdfUrl } = body

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
      return new NextResponse("Course not completed", { status: 400 })
    }

    // Create or update certificate
    const certificate = await prisma.certificate.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId: params.courseId
        }
      },
      create: {
        userId,
        courseId: params.courseId,
        pdfUrl
      },
      update: {
        pdfUrl
      }
    })

    return NextResponse.json(certificate)
  } catch (error) {
    console.log('[COURSE_CERTIFICATE]', error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 