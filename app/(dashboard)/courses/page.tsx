import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import CourseCard from "@/components/courses/course-card"
import Link from "next/link"
import { Plus } from "lucide-react"

export const metadata = { title: "Courses — EduTask" }

export default async function CoursesPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const isInstructor = session.user.role === "INSTRUCTOR"

  // Instructors see only their courses; students see all
  const courses = await prisma.course.findMany({
    where: isInstructor ? { instructorId: session.user.id } : {},
    include: {
      instructor: { select: { name: true, email: true } },
      _count: { select: { assignments: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isInstructor ? "My Courses" : "All Courses"}
          </h1>
          <p className="text-gray-500 mt-1">
            {isInstructor
              ? "Courses you are teaching"
              : "Browse available courses"}
          </p>
        </div>

        {/* Only instructors can create courses */}
        {isInstructor && (
          <Link
            href="/courses/new"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Course
          </Link>
        )}
      </div>

      {/* Course list */}
      {courses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500 mb-4">
            {isInstructor
              ? "You haven't created any courses yet."
              : "No courses available yet."}
          </p>
          {isInstructor && (
            <Link
              href="/courses/new"
              className="text-indigo-600 font-medium hover:underline"
            >
              Create your first course →
            </Link>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course: any) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
            <CourseCard
              key={course.id}
              course={{
                ...course,
                createdAt: course.createdAt.toISOString(),
              }}
              role={session.user.role}
            />
          ))}
        </div>
      )}
    </div>
  )
}
