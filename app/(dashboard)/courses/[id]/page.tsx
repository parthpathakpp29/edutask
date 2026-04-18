import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { Pencil, Plus, ArrowLeft, Calendar, Star } from "lucide-react"
import DeleteCourseButton from "@/components/courses/delete-course-button"
import DeleteAssignmentButton from "@/components/assignments/delete-assignment-button"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function CourseDetailPage({ params }: PageProps) {
  const session = await auth()
  if (!session) redirect("/login")

  const { id } = await params

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      instructor: { select: { id: true, name: true, email: true } },
      assignments: {
        include: { _count: { select: { submissions: true } } },
        orderBy: { dueDate: "asc" },
      },
    },
  })

  if (!course) notFound()

  const isOwner =
    session.user.role === "INSTRUCTOR" &&
    course.instructorId === session.user.id

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back link */}
      <Link
        href="/courses"
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to courses
      </Link>

      {/* Course header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-xs font-mono font-semibold bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
              {course.code}
            </span>
            <h1 className="text-2xl font-bold text-gray-900 mt-2">
              {course.title}
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              By {course.instructor.name}
            </p>
          </div>

          {/* Edit / delete buttons — only for the course owner */}
          {isOwner && (
            <div className="flex gap-2">
              <Link
                href={`/courses/${id}/edit`}
                className="flex items-center gap-1.5 text-sm px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </Link>
              <DeleteCourseButton courseId={id} />
            </div>
          )}
        </div>

        <p className="text-gray-700 whitespace-pre-wrap">{course.description}</p>
      </div>

      {/* Assignments section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Assignments ({course.assignments.length})
          </h2>

          {/* Only the course owner can add assignments */}
          {isOwner && (
            <Link
              href={`/courses/${id}/assignments/new`}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Assignment
            </Link>
          )}
        </div>

        {course.assignments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500">No assignments yet.</p>
            {isOwner && (
              <Link
                href={`/courses/${id}/assignments/new`}
                className="text-indigo-600 font-medium hover:underline text-sm mt-2 inline-block"
              >
                Post the first assignment →
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {course.assignments.map((assignment) => {
              const isPastDue = new Date(assignment.dueDate) < new Date()

              return (
                <div
                  key={assignment.id}
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/courses/${id}/assignments/${assignment.id}`}
                        className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
                      >
                        {assignment.title}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {assignment.description}
                      </p>
                    </div>

                    <div className="text-right shrink-0 ml-4">
                      <div
                        className={`flex items-center gap-1 text-xs mb-1 ${
                          isPastDue ? "text-red-500" : "text-gray-500"
                        }`}
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(assignment.dueDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Star className="w-3.5 h-3.5" />
                        {assignment.maxPoints} pts
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-gray-400">
                      {assignment._count.submissions} submission
                      {assignment._count.submissions !== 1 ? "s" : ""}
                    </span>

                    <div className="flex gap-2">
                      {isOwner && (
                        <>
                          <Link
                            href={`/courses/${id}/assignments/${assignment.id}/edit`}
                            className="text-xs text-gray-600 hover:text-indigo-600 font-medium transition-colors inline-flex items-center gap-1"
                          >
                            <Pencil className="w-3 h-3" />
                            Edit
                          </Link>
                          <DeleteAssignmentButton
                            assignmentId={assignment.id}
                            courseId={id}
                            compact
                          />
                        </>
                      )}
                      {isOwner && (
                        <Link
                          href={`/courses/${id}/assignments/${assignment.id}/submissions`}
                          className="text-xs text-gray-600 hover:text-indigo-600 font-medium transition-colors"
                        >
                          View Submissions
                        </Link>
                      )}
                      <Link
                        href={`/courses/${id}/assignments/${assignment.id}`}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                      >
                        {session.user.role === "STUDENT" ? "Submit →" : "Details →"}
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

