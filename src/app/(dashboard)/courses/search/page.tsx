import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/lib/db/prisma'
import { CourseSearch } from '@/components/courses/course-search'
import { CoursesList } from '@/components/courses/courses-list'
import { Pagination } from '@/components/shared/pagination'

interface SearchPageProps {
  searchParams: {
    q?: string
    category?: string
    page?: string
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { userId } = auth()
  if (!userId) redirect('/sign-in')

  const page = parseInt(searchParams.page || '1')
  const limit = 12

  const categories = await prisma.courseCategory.findMany()

  const where = {
    ...(searchParams.q && {
      OR: [
        { title: { contains: searchParams.q, mode: 'insensitive' } },
        { description: { contains: searchParams.q, mode: 'insensitive' } }
      ]
    }),
    ...(searchParams.category && { categoryId: searchParams.category })
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

  return (
    <div className="p-6">
      <div className="mb-6">
        <CourseSearch categories={categories} />
      </div>

      <CoursesList courses={courses} />

      <div className="mt-6">
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(total / limit)}
          baseUrl="/courses/search"
          searchParams={searchParams}
        />
      </div>
    </div>
  )
} 