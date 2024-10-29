import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface EngagementMetricsProps {
  data: any[]
}

export function EngagementMetrics({ data }: EngagementMetricsProps) {
  const chartData = {
    labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
    datasets: [
      {
        label: 'Number of Reviews',
        data: data.map(d => d._count),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      }
    ]
  }

  return (
    <div className="bg-white p-4 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Rating Distribution</h3>
      <Bar data={chartData} />
    </div>
  )
} 