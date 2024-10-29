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

interface RevenueDashboardProps {
  data: any[]
}

export function RevenueDashboard({ data }: RevenueDashboardProps) {
  const monthlyRevenue = data.reduce((acc, payment) => {
    const month = new Date(payment.createdAt).toLocaleString('default', { month: 'long' })
    acc[month] = (acc[month] || 0) + payment.amount
    return acc
  }, {})

  const chartData = {
    labels: Object.keys(monthlyRevenue),
    datasets: [
      {
        label: 'Monthly Revenue',
        data: Object.values(monthlyRevenue),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  }

  const totalRevenue = data.reduce((sum, payment) => sum + payment.amount, 0)
  const averageRevenue = totalRevenue / Object.keys(monthlyRevenue).length

  return (
    <div className="bg-white p-4 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold">${(totalRevenue / 100).toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Average Monthly</p>
          <p className="text-2xl font-bold">${(averageRevenue / 100).toFixed(2)}</p>
        </div>
      </div>

      <Line data={chartData} />
    </div>
  )
} 