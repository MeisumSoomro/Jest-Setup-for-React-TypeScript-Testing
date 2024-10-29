import { Course } from '@prisma/client'
import { CourseCard } from './course-card'

interface CoursesListProps {
  courses: (Course & {
    _count: {
      modules: number
    }
  })[]
}

export function CoursesList({ courses }: CoursesListProps) {
  if (courses.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No courses yet</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  )
} 