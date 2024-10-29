import { useState } from 'react'
import { toast } from 'sonner'

export function useCourseProgress(courseId: string) {
  const [updating, setUpdating] = useState(false)

  const updateProgress = async (moduleId: string, completed: boolean, lastPosition?: number) => {
    try {
      setUpdating(true)
      const response = await fetch(`/api/courses/${courseId}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId, completed, lastPosition })
      })

      if (!response.ok) throw new Error('Failed to update progress')

      const data = await response.json()
      return data
    } catch (error) {
      toast.error('Failed to update progress')
      return null
    } finally {
      setUpdating(false)
    }
  }

  return {
    updateProgress,
    updating
  }
} 