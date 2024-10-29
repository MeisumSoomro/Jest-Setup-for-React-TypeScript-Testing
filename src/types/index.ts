export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  price?: number;
  published: boolean;
  instructorId: string;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  courseId: string;
  order: number;
} 