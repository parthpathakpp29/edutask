import Link from "next/link"
import { BookOpen, Users, Clock } from "lucide-react"

interface CourseCardProps {
  course: {
    id: string
    title: string
    description: string
    code: string
    instructor: { name: string; email: string }
    _count: { assignments: number }
    createdAt: string | Date
  }
  role: string
}

export default function CourseCard({ course, role }: CourseCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      {/* Course code badge */}
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-mono font-semibold bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
          {course.code}
        </span>
        <span className="flex items-center gap-1 text-xs text-gray-500">
          <BookOpen className="w-3.5 h-3.5" />
          {course._count.assignments} assignment{course._count.assignments !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Title + description */}
      <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
      <p className="text-sm text-gray-500 line-clamp-2 mb-4">
        {course.description}
      </p>

      {/* Instructor info (shown to students) */}
      {role === "STUDENT" && (
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
          <Users className="w-3.5 h-3.5" />
          <span>{course.instructor.name}</span>
        </div>
      )}

      {/* View button */}
      <Link
        href={`/courses/${course.id}`}
        className="block text-center text-sm font-medium bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-4 py-2 rounded-lg transition-colors"
      >
        View Course
      </Link>
    </div>
  )
}
