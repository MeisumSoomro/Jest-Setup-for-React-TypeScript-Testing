import { Hero } from "@/components/home/Hero";
import { CourseCard } from "@/components/courses/CourseCard";

const FEATURED_COURSES = [
  {
    id: "1",
    title: "Web Development Bootcamp",
    imageUrl: "/images/courses/web-dev.jpg",
    price: 99.99,
    category: "Programming",
    instructor: "John Doe"
  },
  {
    id: "2",
    title: "Digital Marketing Masterclass",
    imageUrl: "/images/courses/marketing.jpg",
    price: 89.99,
    category: "Marketing",
    instructor: "Jane Smith"
  },
  // Add more featured courses...
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Featured Courses</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {FEATURED_COURSES.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>
      </div>
    </div>
  );
} 