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
    const { name, description, image, type } = body

    if (!name) {
      return new NextResponse("Name is required", { status: 400 })
    }

    const group = await prisma.group.create({
      data: {
        name,
        description,
        image,
        type,
        ownerId: userId,
      }
    })

    return NextResponse.json(group)
  } catch (error) {
    console.log('[GROUPS_POST]', error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')
    
    const groups = await prisma.group.findMany({
      where: {
        type: type as any
      },
      include: {
        owner: true,
        _count: {
          select: {
            members: true
          }
        }
      }
    })

    return NextResponse.json(groups)
  } catch (error) {
    console.log('[GROUPS_GET]', error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 