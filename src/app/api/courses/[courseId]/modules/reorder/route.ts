import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/lib/db/prisma'

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { modules } = body

    // Verify user is course owner
    const course = await prisma.course.findUnique({
      where: { id: params.courseId },
      include: { group: true }
    })

    if (!course || course.group.ownerId !== userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Update all module orders in a transaction
    await prisma.$transaction(
      modules.map((module: { id: string; order: number }) =>
        prisma.module.update({
          where: { id: module.id },
          data: { order: module.order }
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.log('[MODULES_REORDER]', error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 