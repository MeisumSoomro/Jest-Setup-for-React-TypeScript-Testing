'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CourseCreatorWizard } from '@/components/courses/course-creator-wizard';
import { AssignmentManager } from '@/components/courses/assignment-manager';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

interface Course {
  id: string;
  title: string;
  enrolledStudents: number;
  revenue: number;
  rating: number;
}

interface Student {
  id: string;
  name: string;
  email: string;
  progress: number;
  lastActive: Date;
}

export default function InstructorDashboard() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [coursesRes, studentsRes] = await Promise.all([
        fetch('/api/instructor/courses'),
        fetch('/api/instructor/students')
      ]);

      const [coursesData, studentsData] = await Promise.all([
        coursesRes.json(),
        studentsRes.json()
      ]);

      setCourses(coursesData);
      setStudents(studentsData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
        <Button onClick={() => setIsCreatingCourse(true)}>
          Create New Course
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <h3 className="text-sm text-gray-500">Total Courses</h3>
          <p className="text-2xl font-bold">{courses.length}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm text-gray-500">Total Students</h3>
          <p className="text-2xl font-bold">{students.length}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm text-gray-500">Total Revenue</h3>
          <p className="text-2xl font-bold">
            ${courses.reduce((acc, course) => acc + course.revenue, 0).toFixed(2)}
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm text-gray-500">Average Rating</h3>
          <p className="text-2xl font-bold">
            {(courses.reduce((acc, course) => acc + course.rating, 0) / courses.length || 0).toFixed(1)}
          </p>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList>
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          {courses.map(course => (
            <Card key={course.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold">{course.title}</h3>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>{course.enrolledStudents} students</span>
                    <span>${course.revenue} earned</span>
                    <span>{course.rating}/5 rating</span>
                  </div>
                </div>
                <Button onClick={() => router.push(`/courses/${course.id}/edit`)}>
                  Manage Course
                </Button>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          {students.map(student => (
            <Card key={student.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{student.name}</h3>
                  <p className="text-sm text-gray-500">{student.email}</p>
                  <p className="text-sm text-gray-500">
                    Last active: {format(new Date(student.lastActive), 'PPp')}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-semibold">Progress: {student.progress}%</div>
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/students/${student.id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="assignments">
          <AssignmentManager courseId="all" />
        </TabsContent>
      </Tabs>

      {/* Course Creation Modal */}
      {isCreatingCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Create New Course</h2>
              <Button
                variant="ghost"
                onClick={() => setIsCreatingCourse(false)}
              >
                ×
              </Button>
            </div>
            <CourseCreatorWizard
              onComplete={async (courseData) => {
                try {
                  const response = await fetch('/api/courses', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(courseData),
                  });

                  if (!response.ok) throw new Error('Failed to create course');

                  const course = await response.json();
                  setCourses(prev => [...prev, course]);
                  setIsCreatingCourse(false);
                } catch (error) {
                  console.error('Error creating course:', error);
                }
              }}
            />
          </Card>
        </div>
      )}
    </div>
  );
}