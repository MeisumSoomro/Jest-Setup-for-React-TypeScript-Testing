'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, 
  BarChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

interface AnalyticsData {
  overview: {
    totalStudents: number;
    activeCourses: number;
    completionRate: number;
    averageRating: number;
  };
  engagement: {
    dailyActiveUsers: { date: string; count: number }[];
    timeSpentLearning: { date: string; minutes: number }[];
  };
  performance: {
    courseCompletions: { course: string; completions: number }[];
    averageScores: { module: string; score: number }[];
  };
  revenue: {
    monthly: { month: string; amount: number }[];
    byProduct: { product: string; revenue: number }[];
  };
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('month');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics?range=${dateRange}`);
      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading analytics...</div>;
  if (!data) return <div>Failed to load analytics</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value as typeof dateRange)}
          className="border rounded p-2"
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <h3 className="text-sm text-gray-500">Total Students</h3>
          <p className="text-2xl font-bold">{data.overview.totalStudents}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm text-gray-500">Active Courses</h3>
          <p className="text-2xl font-bold">{data.overview.activeCourses}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm text-gray-500">Completion Rate</h3>
          <p className="text-2xl font-bold">{data.overview.completionRate}%</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm text-gray-500">Average Rating</h3>
          <p className="text-2xl font-bold">{data.overview.averageRating}/5</p>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="engagement" className="space-y-4">
        <TabsList>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="engagement" className="space-y-4">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Daily Active Users</h3>
            <LineChart
              width={800}
              height={300}
              data={data.engagement.dailyActiveUsers}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#8884d8" />
            </LineChart>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Time Spent Learning</h3>
            <LineChart
              width={800}
              height={300}
              data={data.engagement.timeSpentLearning}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="minutes" stroke="#82ca9d" />
            </LineChart>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Course Completions</h3>
            <BarChart
              width={800}
              height={300}
              data={data.performance.courseCompletions}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="course" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completions" fill="#8884d8" />
            </BarChart>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Average Scores</h3>
            <BarChart
              width={800}
              height={300}
              data={data.performance.averageScores}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="module" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" fill="#82ca9d" />
            </BarChart>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Monthly Revenue</h3>
            <LineChart
              width={800}
              height={300}
              data={data.revenue.monthly}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#8884d8" />
            </LineChart>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Revenue by Product</h3>
            <BarChart
              width={800}
              height={300}
              data={data.revenue.byProduct}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="product" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#82ca9d" />
            </BarChart>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 