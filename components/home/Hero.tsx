import Link from "next/link";

export const Hero = () => {
  return (
    <div className="h-[600px] flex items-center justify-center bg-slate-100">
      <div className="text-center space-y-6 px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
          Learn Without Limits
        </h1>
        <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto">
          Start, switch, or advance your career with thousands of courses from
          world-class universities and companies.
        </p>
        <div className="flex items-center justify-center gap-x-4">
          <Link
            href="/courses"
            className="px-6 py-3 rounded-full bg-blue-700 text-white hover:bg-blue-800 transition"
          >
            Browse Courses
          </Link>
          <Link
            href="/teach"
            className="px-6 py-3 rounded-full border border-slate-200 hover:border-slate-300 transition"
          >
            Start Teaching
          </Link>
        </div>
      </div>
    </div>
  );
}; 