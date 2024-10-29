import { Course, CourseProgress } from '@prisma/client'
import Link from 'next/link'
import { Progress } from '../ui/progress'
import { Card } from '../ui/card'

interface EnrolledCoursesProps {
  courses: (Course & {
    _count: {
      modules: number
    }
  })[]
  progress: (CourseProgress & {
    course: {
      title: string
    }
  })[]
}

export function EnrolledCourses({ courses, progress }: EnrolledCoursesProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Enrolled Courses</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => {
          const courseProgress = progress.find(p => p.courseId === course.id)
          
          return (
            <Card key={course.id} className="p-4">
              <Link href={`/groups/${course.groupId}/courses/${course.id}`}>
                <div className="space-y-2">
                  <h3 className="font-medium">{course.title}</h3>
                  <div className="text-sm text-gray-500">
                    {course._count.modules} modules
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{Math.round(courseProgress?.progress || 0)}%</span>
                    </div>
                    <Progress value={courseProgress?.progress || 0} className="h-2" />
                  </div>
                </div>
              </Link>
            </Card>
          )
        })}
      </div>
    </div>
  )
} 