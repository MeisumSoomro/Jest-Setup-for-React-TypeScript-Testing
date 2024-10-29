'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/shared/calendar';
import { ProgressTracker } from '@/components/courses/progress-tracker';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

interface Course {
  id: string;
  title: string;
  progress: number;
  nextLesson: {
    title: string;
    moduleTitle: string;
  };
}

interface Assignment {
  id: string;
  title: string;
  courseTitle: string;
  dueDate: Date;
  status: 'pending' | 'submitted' | 'graded';
  grade?: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: Date;
}

export default function StudentDashboard() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [coursesRes, assignmentsRes, achievementsRes] = await Promise.all([
        fetch('/api/student/courses'),
        fetch('/api/student/assignments'),
        fetch('/api/student/achievements')
      ]);

      const [coursesData, assignmentsData, achievementsData] = await Promise.all([
        coursesRes.json(),
        assignmentsRes.json(),
        achievementsRes.json()
      ]);

      setCourses(coursesData);
      setAssignments(assignmentsData);
      setAchievements(achievementsData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Welcome back!</h1>
        <Button onClick={() => router.push('/courses/browse')}>
          Browse Courses
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="text-sm text-gray-500">Active Courses</h3>
          <p className="text-2xl font-bold">{courses.length}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm text-gray-500">Pending Assignments</h3>
          <p className="text-2xl font-bold">
            {assignments.filter(a => a.status === 'pending').length}
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm text-gray-500">Achievements</h3>
          <p className="text-2xl font-bold">{achievements.length}</p>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList>
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          {courses.map(course => (
            <Card key={course.id} className="p-4">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{course.title}</h3>
                    <p className="text-sm text-gray-500">
                      Next: {course.nextLesson.title} in {course.nextLesson.moduleTitle}
                    </p>
                  </div>
                  <Button onClick={() => router.push(`/courses/${course.id}`)}>
                    Continue Learning
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} />
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          {assignments.map(assignment => (
            <Card key={assignment.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{assignment.title}</h3>
                  <p className="text-sm text-gray-500">{assignment.courseTitle}</p>
                  <p className="text-sm text-gray-500">
                    Due: {format(new Date(assignment.dueDate), 'PPP')}
                  </p>
                </div>
                <div className="text-right">
                  {assignment.status === 'graded' ? (
                    <p className="text-lg font-semibold">Grade: {assignment.grade}%</p>
                  ) : (
                    <Button
                      variant={assignment.status === 'submitted' ? 'outline' : 'default'}
                      onClick={() => router.push(`/assignments/${assignment.id}`)}
                    >
                      {assignment.status === 'submitted' ? 'View Submission' : 'Submit'}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="achievements" className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {achievements.map(achievement => (
            <Card key={achievement.id} className="p-4 text-center">
              <img
                src={achievement.icon}
                alt={achievement.title}
                className="w-16 h-16 mx-auto"
              />
              <h3 className="font-semibold mt-2">{achievement.title}</h3>
              <p className="text-sm text-gray-500">{achievement.description}</p>
              <p className="text-xs text-gray-400 mt-2">
                Earned on {format(new Date(achievement.earnedAt), 'PP')}
              </p>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="calendar">
          <Calendar />
        </TabsContent>
      </Tabs>
    </div>
  );
}