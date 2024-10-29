import { useEffect, useState } from 'react'
import { Progress } from '../ui/progress'
import { Button } from '../ui/button'
import { CheckCircle, Circle } from 'lucide-react'

interface CourseProgressProps {
  courseId: string
  totalModules: number
  completedModules: number
  progress: number
}

export function CourseProgress({ 
  courseId, 
  totalModules, 
  completedModules, 
  progress 
}: CourseProgressProps) {
  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold">Course Progress</h3>
          <p className="text-sm text-gray-500">
            {completedModules} of {totalModules} modules completed
          </p>
        </div>
        {progress === 100 ? (
          <div className="flex items-center text-green-600">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>Completed</span>
          </div>
        ) : null}
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  )
} 