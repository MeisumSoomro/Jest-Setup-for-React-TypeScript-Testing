import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q')
    const categoryId = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = 12

    const where = {
      ...(query && {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      }),
      ...(categoryId && { categoryId })
    }

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        include: {
          group: {
            include: {
              owner: true
            }
          },
          category: true,
          _count: {
            select: {
              modules: true,
              reviews: true
            }
          }
        },
        orderBy: {
          averageRating: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.course.count({ where })
    ])

    return NextResponse.json({
      courses,
      total,
      pages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.log('[COURSES_SEARCH]', error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 