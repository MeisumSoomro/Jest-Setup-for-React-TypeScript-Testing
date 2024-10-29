import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/lib/db/prisma'

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { title, content, videoUrl, order, courseId } = body

    if (!title || !courseId) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    // Verify user is course owner
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { group: true }
    })

    if (!course || course.group.ownerId !== userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const module = await prisma.module.create({
      data: {
        title,
        content,
        videoUrl,
        order,
        courseId
      }
    })

    return NextResponse.json(module)
  } catch (error) {
    console.log('[MODULES_POST]', error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 