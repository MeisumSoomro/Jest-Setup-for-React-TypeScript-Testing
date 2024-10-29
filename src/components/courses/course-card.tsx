import Image from 'next/image'
import Link from 'next/link'
import { Course } from '@prisma/client'

interface CourseCardProps {
  course: Course & {
    _count: {
      modules: number
    }
  }
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/groups/${course.groupId}/courses/${course.id}`}>
      <div className="border rounded-lg overflow-hidden hover:shadow-md transition">
        <div className="relative h-48 w-full">
          {course.image ? (
            <Image
              src={course.image}
              alt={course.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg">{course.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{course.description}</p>
          <div className="mt-4 text-sm text-gray-500">
            {course._count.modules} modules
          </div>
        </div>
      </div>
    </Link>
  )
} 