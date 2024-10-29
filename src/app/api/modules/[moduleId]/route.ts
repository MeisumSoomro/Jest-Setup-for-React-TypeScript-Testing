import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/lib/db/prisma'

export async function PATCH(
  req: Request,
  { params }: { params: { moduleId: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { title, content, videoUrl, order } = body

    // Verify user is course owner
    const module = await prisma.module.findUnique({
      where: { id: params.moduleId },
      include: {
        course: {
          include: {
            group: true
          }
        }
      }
    })

    if (!module || module.course.group.ownerId !== userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const updatedModule = await prisma.module.update({
      where: { id: params.moduleId },
      data: {
        title,
        content,
        videoUrl,
        order
      }
    })

    return NextResponse.json(updatedModule)
  } catch (error) {
    console.log('[MODULE_PATCH]', error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { moduleId: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Verify user is course owner
    const module = await prisma.module.findUnique({
      where: { id: params.moduleId },
      include: {
        course: {
          include: {
            group: true
          }
        }
      }
    })

    if (!module || module.course.group.ownerId !== userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    await prisma.module.delete({
      where: { id: params.moduleId }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.log('[MODULE_DELETE]', error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 