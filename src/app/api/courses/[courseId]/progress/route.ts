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
    const { moduleId, completed, lastPosition } = body

    // Create or update course progress
    const courseProgress = await prisma.courseProgress.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId: params.courseId
        }
      },
      create: {
        userId,
        courseId: params.courseId,
      },
      update: {},
    })

    // Update module progress
    const moduleProgress = await prisma.moduleProgress.upsert({
      where: {
        userId_moduleId: {
          userId,
          moduleId
        }
      },
      create: {
        userId,
        moduleId,
        completed,
        lastPosition,
        courseProgressId: courseProgress.id
      },
      update: {
        completed,
        lastPosition
      }
    })

    // Calculate overall course progress
    const allModules = await prisma.module.count({
      where: { courseId: params.courseId }
    })

    const completedModules = await prisma.moduleProgress.count({
      where: {
        courseProgressId: courseProgress.id,
        completed: true
      }
    })

    const progress = (completedModules / allModules) * 100
    const isCompleted = progress === 100

    // Update course progress
    await prisma.courseProgress.update({
      where: { id: courseProgress.id },
      data: {
        progress,
        completed: isCompleted
      }
    })

    return NextResponse.json({ progress, completed: isCompleted })
  } catch (error) {
    console.log('[COURSE_PROGRESS]', error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 