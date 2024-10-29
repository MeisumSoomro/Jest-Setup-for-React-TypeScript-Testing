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

interface ProgressChartProps {
  data: any[]
}

export function ProgressChart({ data }: ProgressChartProps) {
  const chartData = {
    labels: data.map(d => new Date(d.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: 'Course Progress',
        data: data.map(d => d.progress),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  }

  return (
    <div className="bg-white p-4 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Progress Over Time</h3>
      <Line data={chartData} />
    </div>
  )
} 