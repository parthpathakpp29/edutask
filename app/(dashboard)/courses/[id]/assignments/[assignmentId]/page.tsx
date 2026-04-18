import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Pencil, Star, Users } from "lucide-react"
import SubmissionForm from "@/components/submissions/submission-form"
import DeleteAssignmentButton from "@/components/assignments/delete-assignment-button"

interface PageProps {
  params: Promise<{ id: string; assignmentId: string }>
}

export default async function AssignmentDetailPage({ params }: PageProps) {
  const session = await auth()
  if (!session) redirect("/login")

  const { id: courseId, assignmentId } = await params

  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    include: {
      course: { select: { id: true, title: true, instructorId: true } },
      _count: { select: { submissions: true } },
    },
  })

  if (!assignment || assignment.courseId !== courseId) notFound()

  const isPastDue = new Date(assignment.dueDate) < new Date()
  const isOwner =
    session.user.role === "INSTRUCTOR" &&
    assignment.course.instructorId === session.user.id

  // For students: check if they already submitted
  let existingSubmission = null
  if (session.user.role === "STUDENT") {
    existingSubmission = await prisma.submission.findFirst({
      where: {
        studentId: session.user.id,
        assignmentId: assignment.id,
      },
      select: {
        id: true,
        content: true,
        status: true,
        grade: true,
        feedback: true,
      },
    })
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back link */}
      <Link
        href={`/courses/${courseId}`}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to {assignment.course.title}
      </Link>

      {/* Assignment details */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {assignment.title}
        </h1>

        <div className="flex flex-wrap gap-4 mb-6">
          <div
            className={`flex items-center gap-1.5 text-sm ${
              isPastDue ? "text-red-500" : "text-gray-600"
            }`}
          >
            <Calendar className="w-4 h-4" />
            Due: {new Date(assignment.dueDate).toLocaleDateString("en-US", {
              weekday: "short",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
            {isPastDue && " (past due)"}
          </div>

          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <Star className="w-4 h-4" />
            {assignment.maxPoints} points
          </div>

          {isOwner && (
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              {assignment._count.submissions} submission
              {assignment._count.submissions !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap border-t pt-4">
          {assignment.description}
        </div>
      </div>

      {/* Instructor controls */}
      {isOwner && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Instructor Actions</h2>
          <div className="flex gap-3">
            <Link
              href={`/courses/${courseId}/assignments/${assignmentId}/submissions`}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <Users className="w-4 h-4" />
              View All Submissions ({assignment._count.submissions})
            </Link>
            <Link
              href={`/courses/${courseId}/assignments/${assignmentId}/edit`}
              className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit Assignment
            </Link>
            <DeleteAssignmentButton assignmentId={assignmentId} courseId={courseId} />
          </div>
        </div>
      )}

      {/* Student submission form */}
      {session.user.role === "STUDENT" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Your Submission</h2>
          <SubmissionForm
            assignmentId={assignment.id}
            existingSubmission={existingSubmission ?? undefined}
          />
        </div>
      )}
    </div>
  )
}
