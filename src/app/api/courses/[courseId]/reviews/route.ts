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
    const { rating, comment } = body

    // Create review
    const review = await prisma.courseReview.create({
      data: {
        userId,
        courseId: params.courseId,
        rating,
        comment
      }
    })

    // Update course average rating
    const reviews = await prisma.courseReview.findMany({
      where: { courseId: params.courseId }
    })

    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length

    await prisma.course.update({
      where: { id: params.courseId },
      data: { averageRating }
    })

    return NextResponse.json(review)
  } catch (error) {
    console.log('[COURSE_REVIEW]', error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 