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
    const { title, description, image, groupId } = body

    if (!title || !groupId) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    // Verify user is group owner
    const group = await prisma.group.findUnique({
      where: { id: groupId }
    })

    if (!group || group.ownerId !== userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        image,
        groupId
      }
    })

    return NextResponse.json(course)
  } catch (error) {
    console.log('[COURSES_POST]', error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 