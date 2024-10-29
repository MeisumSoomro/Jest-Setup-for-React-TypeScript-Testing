import { useEffect, useState } from 'react'
import { Course } from '@prisma/client'
import { CourseCard } from './course-card'

interface CourseRecommendationsProps {
  userId: string
  currentCourseId?: string
}

export function CourseRecommendations({ userId, currentCourseId }: CourseRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch(`/api/courses/recommendations?userId=${userId}${
          currentCourseId ? `&currentCourseId=${currentCourseId}` : ''
        }`)
        if (response.ok) {
          const data = await response.json()
          setRecommendations(data)
        }
      } catch (error) {
        console.error('Failed to fetch recommendations:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [userId, currentCourseId])

  if (loading) {
    return <div>Loading recommendations...</div>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Recommended Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  )
} 