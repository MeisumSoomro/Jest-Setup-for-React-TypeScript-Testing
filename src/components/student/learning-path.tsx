import { Certificate, CourseProgress } from '@prisma/client'
import { CheckCircle, Circle, Trophy } from 'lucide-react'
import { Card } from '../ui/card'
import { cn } from '@/lib/utils'

interface LearningPathProps {
  certificates: (Certificate & {
    course: {
      title: string
    }
  })[]
  progress: (CourseProgress & {
    course: {
      title: string
    }
  })[]
}

export function LearningPath({ certificates, progress }: LearningPathProps) {
  const sortedProgress = [...progress].sort((a, b) => {
    if (a.completed && !b.completed) return 1
    if (!a.completed && b.completed) return -1
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Learning Path</h2>
        <div className="flex items-center gap-x-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <span className="font-medium">{certificates.length} Certificates</span>
        </div>
      </div>

      <div className="relative">
        <div className="absolute top-0 bottom-0 left-6 w-px bg-gray-200" />
        
        <div className="space-y-8">
          {sortedProgress.map((item, index) => (
            <div key={item.id} className="relative">
              <div className="flex items-start gap-x-4">
                <div className={cn(
                  "relative z-10 flex items-center justify-center w-12 h-12 rounded-full",
                  item.completed ? "bg-green-100" : "bg-white border-2"
                )}>
                  {item.completed ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <Circle className="h-6 w-6 text-gray-400" />
                  )}
                </div>
                
                <Card className="flex-1 p-4">
                  <div className="space-y-1">
                    <h3 className="font-medium">{item.course.title}</h3>
                    <div className="text-sm text-gray-500">
                      {item.completed ? (
                        <span className="text-green-600">Completed</span>
                      ) : (
                        <span>{Math.round(item.progress)}% complete</span>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 