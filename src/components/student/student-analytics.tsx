import { CourseProgress } from '@prisma/client'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface StudentAnalyticsProps {
  progress: CourseProgress[]
}

export function StudentAnalytics({ progress }: StudentAnalyticsProps) {
  // Calculate daily progress
  const dailyProgress = progress.reduce((acc, p) => {
    const date = new Date(p.updatedAt).toLocaleDateString()
    acc[date] = (acc[date] || 0) + p.progress
    return acc
  }, {} as Record<string, number>)

  const chartData = {
    labels: Object.keys(dailyProgress),
    datasets: [
      {
        label: 'Daily Progress',
        data: Object.values(dailyProgress),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Learning Analytics</h2>
      <div className="bg-white p-4 rounded-lg border">
        <Line data={chartData} />
      </div>
    </div>
  )
} 