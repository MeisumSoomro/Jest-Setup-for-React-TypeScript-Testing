import { CourseProgress } from '@prisma/client'
import { Progress } from '../ui/progress'

interface ProgressOverviewProps {
  progress: (CourseProgress & {
    course: {
      title: string
    }
  })[]
}

export function ProgressOverview({ progress }: ProgressOverviewProps) {
  const totalCourses = progress.length
  const completedCourses = progress.filter(p => p.completed).length
  const overallProgress = (completedCourses / totalCourses) * 100

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
      
      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">Overall Progress</span>
            <span className="text-sm font-medium">{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-2xl font-bold">{completedCourses}</p>
            <p className="text-sm text-gray-500">Completed Courses</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{totalCourses - completedCourses}</p>
            <p className="text-sm text-gray-500">In Progress</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Recent Activity</h3>
          {progress
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .slice(0, 3)
            .map(p => (
              <div key={p.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{p.course.title}</p>
                  <p className="text-sm text-gray-500">
                    Last activity: {new Date(p.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <Progress value={p.progress} className="w-24 h-2" />
              </div>
            ))}
        </div>
      </div>
    </div>
  )
} 